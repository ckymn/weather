class FetchController {
  constructor(){
    this.baseUrl = "https://www.metaweather.com/api/location";
    this.searchApi = `${this.baseUrl}/search`;
    this.addCorsHeader();
  }

  addCorsHeader(){
    $.ajaxPrefilter(options => {
      if (options.crossDomain && $.support.cors) {
        options.url = "https://the-ultimate-api-challenge.herokuapp.com/"+ options.url
      }
    });
  }

  getLocation(query, callback){
    $.getJSON(this.searchApi,{query}).done(data => callback(data)).fail(() => callback(null));
  }

  getWeatherData(location, callback){
    $.getJSON(`${this.baseUrl}/${location}`).done(data => callback(data)).fail(() => callback(null));
  }
}

class CoreDomElements {
  constructor() {
    this.searchForm = $('#search-form');
    this.errorBox = $('#error-box');
    this.searchBox = $('#search-box');
    this.loaderBox = $('#loader-box');
    this.forecastBox = $('#forecast-box');
}

showForecast() {
    this.hideError();
    this.forecastBox.removeClass('d-none');
    this.forecastBox.addClass('d-flex');
}

showLoader() {
    this.loaderBox.removeClass('d-none');
}

hideLoader() {
    this.loaderBox.addClass('d-none');
}

showSearch() {
    this.searchBox.removeClass('d-none');
    this.searchBox.addClass('d-flex');
}

hideSearchBox() {
    this.searchBox.removeClass('d-flex');
    this.searchBox.addClass('d-none');
}

showError(message) {
    this.hideLoader();
    this.showSearch();
    this.errorBox.removeClass('d-none');
    this.errorBox.addClass('d-block');
    this.errorBox.html(`<p class="mb-0">${message}</p>`);
}

hideError() {
    this.errorBox.addClass('d-none');
}
}

class RequestController{
  constructor() {
    this.FetchController = new FetchController();
    this.CoreDomElements = new CoreDomElements();
    this.registerEventListener();
  }
  
  showhide(){
    this.CoreDomElements.showLoader();
    this.CoreDomElements.hideSearchBox();
  }

  fetchWeather(query){
    this.FetchController.getLocation(query, (location) =>{
      if (!location || location.length === 0){
        this.CoreDomElements.showError("Aradiginiz sonuc bulundamadi . Tekrar deneyiniz lutfen..");
        return;
      }
      this.FetchController.getWeatherData(location[0].woeid , (data) =>{
        if(!data || data.length === 0) {
           this.CoreDomElements.showError("Aradiginiz istek surecin'de sorun olustu . Tekrara deneyiniz...");
           return;
        }
        console.log("fetcweather " , data)
      })
    });
  }
  
  onSubmit(){
    const query = $("#search-query").val().trim();
    if (!query) return;
    this.showhide();
    this.fetchWeather(query);
  }

  registerEventListener() {
    this.CoreDomElements.searchForm.on("submit" , (e) => {
      e.preventDefault();
      this.onSubmit();
    })
  }
}

const resapi = new RequestController();