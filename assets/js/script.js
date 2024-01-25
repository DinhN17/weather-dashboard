// HTML elements
const searchInputEl = $("#search-input");
const searchBtnEl = $("#search-btn");
const historySearchEl = document.getElementById('history-search');
const todayResultEl = document.getElementById("today-result");
const next5DResultEl = document.getElementById("5-day-results");
const searchModal = document.getElementById('searchModal');
const modalTitle = searchModal.querySelector('.modal-title');
const modalBody = searchModal.querySelector('.modal-body');


// Weather API
const APIKey = "4e288eceaa29829b0c7a261ce2cac83c";
const geoCodingLimit = 5;
const geoCodingURL = "http://api.openweathermap.org/geo/1.0/direct?q="
const weatherForecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=";

//
const dayLimit = 5; //5-day forecast

// Object: search keep track of cityList which is the list of historic search of cities
var search = {
  cityList : [],

  // _checkDuplicate: check if the name of city has been existed in the cityList, return index of found duplicate or -1 if not found.
  _checkDuplicate : function(name) {
          
    for (let index = 0; index < this.cityList.length; index++) {
      const element = this.cityList[index];
      if (element.fullName === name) {
        return index;          
      }
    };
    return -1;
  },
  
  // saveCity gets city and save city to cityList in localStorage after transform to string.
  // return false/true if it failed/success to save to localStorage
  saveCity : function(city) {
    // check if the city has been existed. If yes, remove it.
    var index = this._checkDuplicate(city.fullName);
    if (index >= 0) {
      this.cityList.splice(index,1);
    };

    this.cityList.push(city);

    try {
      localStorage.setItem('cityList', JSON.stringify(this.cityList));
      return true;
    } catch(e) {
      return false;
    };      
  },
    
  // loadCities returns array of objects from cityList in localStorage.
  loadCities : function() {
      if (localStorage.getItem("cityList") != null) {
          //  get string from cityList in localStorage and transform back to array of objects.
          this.cityList = JSON.parse(localStorage.getItem("cityList"));           
      };
      return this.cityList;
  },
    
  // clearAll clears the array citys and hourcitys in localStorage
  clearAll : function() {
      if (this.cityList.length != 0) {
          this.cityList.length = 0;
      };
      localStorage.removeItem("cityList");
  },

}

// getForecast: get the weather forecast by lat and lon of city from Weather API
function getForecast(url, city) {
  var queryURL = url + city.lat + "&lon=" + city.lon + "&appid=" + APIKey;
    
  fetch(queryURL)
  .then(function (response) {
    if (response.ok) {
      // console.log(response);
      response.json().then(function (data) {
        // console.log(data);
        renderForecastResult(data, city.fullName);
      });
    } else {
      alert('Error: ' + response.statusText);
      // modalBody.textContent = "Please input the correct city name"
    }
  })
  .catch(function (error) {
    alert('Unable to connect to Open Weather Map');
  });
}

// getCities: get citis list with lat and lon from Weather API
function getCities(url, cityName, limit) {
  var queryURL = url + cityName + "&limit=" + limit + "&appid=" + APIKey;
  
  fetch(queryURL)
  .then(function (response) {
    if (response.ok) {
      // console.log(response);
      response.json().then(function (data) {
        // console.log(data);
        renderModalBody(data, cityName);
      });
    } else {
      //alert('Error: ' + response.statusText);
      modalBody.textContent = "Please input the correct city name"
    }
  })
  .catch(function (error) {
    alert('Unable to connect to Open Weather Map');
  });
}

// renderForecastResult(data, city.fullName): display current and 5 Day weather forecast
function renderForecastResult(data, cityName) {
  // extract data to list of 6 day
  var days = [];
  // console.log(data);

  for (let index = 0; index < dayLimit; index++) {
    
    const element = data.list[8 * index];
    console.log(element);
    var day = {
      date : new Date(element.dt_txt).toLocaleString().slice(0,10),
      icon : element.weather[0].icon,
      temp : element.main.temp,
      humidity: element.main.humidity,
      wind : element.wind.speed,
    };
    days.push(day);
  }

  // get data for last day
  const element = data.list[39];
  // console.log(element);
  var day = {
      date : new Date(element.dt_txt).toLocaleString().slice(0,10),
      icon : element.weather[0].icon,
      temp : element.main.temp,
      humidity: element.main.humidity,
      wind : element.wind.speed,
  };
  days.push(day);
  
  // console.log(days);
  // render today
  todayResultEl.innerHTML = "";
  //const dateStr = days[0].date.toLocaleString().slice(0,10);
  var str = cityName + 
            " " + 
            days[0].date + 
            " " + 
            "<img src=\"https://openweathermap.org/img/wn/" +
            day.icon + 
            "@2x.png\" style=\"width:37px;height:37px;\">";

  var h3El = document.createElement('h3');
  h3El.innerHTML = str;
  todayResultEl.appendChild(h3El);
  
  var ul = document.createElement('ul');
  ul.classList = 'list-unstyled';
  todayResultEl.appendChild(ul);
  
  // create li to show Temperature
  var tempLi = document.createElement('li');
  tempLi.textContent = "Temp: " + days[0].temp + " °F";
  ul.appendChild(tempLi);

  // create li to show Wind
  var windLi = document.createElement('li');
  windLi.textContent = "Wind: " +  days[0].wind + " MPH";
  ul.appendChild(windLi);
  
  // create li to show Humidity
  var humidLi = document.createElement('li');
  humidLi.textContent = "Humidity: " +  days[0].humidity + " %";
  ul.appendChild(humidLi);
  
  next5DResultEl.innerHTML = "";
  // render group next 5-day
  for (let index = 1; index < days.length; index++) {
    const element = days[index];
    var cardEl = document.createElement('div');
    cardEl.classList = 'card';
    next5DResultEl.appendChild(cardEl);

    var cardBodyEl = document.createElement('div');
    cardBodyEl.classList = 'card-body bg-dark';
    cardEl.appendChild(cardBodyEl);

    ul = document.createElement('ul');
    ul.classList = 'list-unstyled';
    cardBodyEl.appendChild(ul);
    
    // create li to show Date
    var dateLi = document.createElement('li');
    dateLi.classList = 'bg-dark fw-bold';
    dateLi.textContent = element.date;
    ul.appendChild(dateLi);

    // create img to show open weather icon
    var imgEl = document.createElement('img');
    imgEl.src = "https://openweathermap.org/img/wn/" + 
                  element.icon + 
                  "@2x.png";
    imgEl.setAttribute("style","width:37px;height:37px;");
    ul.appendChild(imgEl);

    // create li to show Temperature
    tempLi = document.createElement('li');
    tempLi.classList = 'bg-dark';
    tempLi.textContent = "Temp: " + element.temp + " °F";
    ul.appendChild(tempLi);

    // create li to show Wind
    var windLi = document.createElement('li');
    windLi.textContent = "Wind: " +  element.wind + " MPH";
    windLi.classList = 'bg-dark';
    ul.appendChild(windLi);
    
    // create li to show Humidity
    var humidLi = document.createElement('li');
    humidLi.classList = 'bg-dark';
    humidLi.textContent = "Humidity: " +  element.humidity + " %";
    ul.appendChild(humidLi); 

  }
}

// renderHistorySearch: display list of history search of city.
function renderHistorySearch() {
  if (search.cityList.length === 0) {
    historySearchEl.innerHTML = "";
    return;
  };

  historySearchEl.innerHTML = "";
  var cities = search.loadCities();
  for (var i = cities.length - 1; i >= 0; i--) {
    var cityEl = document.createElement('button');
    cityEl.classList = 'text-center btn btn-secondary';
    cityEl.setAttribute("data-lat", cities[i].lat);
    cityEl.setAttribute("data-lon", cities[i].lon);
    cityEl.setAttribute("data-name", cities[i].fullName);
    
    cityEl.textContent = cities[i].fullName;

    historySearchEl.appendChild(cityEl);
  };
}

// renderModalBody: display lat and lon of cities on modalBody
function renderModalBody(cities, searchTerm) {
  
  modalBody.innerHTML = "";
  if (cities.length === 0) {
    modalBody.textContent = 'No city found.';
    return;
  };
    
  for (var i = 0; i < cities.length; i++) {
    var city = {
      fullName : cities[i].name + '/' + cities[i].state + ', ' + cities[i].country,
      lat : cities[i].lat,
      lon : cities[i].lon,
    }        
            
    var cityEl = document.createElement('a');
    cityEl.classList = 'list-item flex-row justify-space-between align-center';
    cityEl.setAttribute("data-lat", city.lat);
    cityEl.setAttribute("data-lon", city.lon);
    cityEl.setAttribute("data-name", city.fullName);
    cityEl.setAttribute("data-bs-dismiss", "modal");
        
    cityEl.textContent = city.fullName;

    modalBody.appendChild(cityEl);
  };
}

function init() {
  search.loadCities();
  renderHistorySearch();
  
  var city = {
    fullName : "Adelaide",
    lat : "-34.9281805",
    lon : "138.5999312",
  };
  getForecast(weatherForecastURL, city);

}

// catch click on historySearchEl
historySearchEl.addEventListener('click', function (event) {
  var element =event.target;
  if (element.matches("a") === true) {
    var city = {
      fullName : element.getAttribute("data-name"),
      lat : element.getAttribute("data-lat"),
      lon : element.getAttribute("data-lon"),
    };
    getForecast(weatherForecastURL, city);

    search.saveCity(city);
    renderHistorySearch();
  }
});

// catch click on modalBody
modalBody.addEventListener('click', function (event) {
  var element = event.target;
  if (element.matches("a") === true) {
    // render historySearch
    var city = {
        fullName : element.getAttribute("data-name"),
        lat : element.getAttribute("data-lat"),
        lon : element.getAttribute("data-lon"),
    };
    search.saveCity(city);

    renderHistorySearch();
    getForecast(weatherForecastURL, city);
  };

  modalBody.innerHTML = "";
});

// searchButtonHandler
if (searchModal) {
  searchModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    // const recipient = button.getAttribute('data-bs-whatever')
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    var city = searchInputEl.val().trim();
    if (city) {
      // get lat and lon for city & display 5 results on the modalBody
      getCities(geoCodingURL, city, geoCodingLimit);

      //modalBody.textContent = city;        
    } else {
      modalBody.textContent = "Please input the correct city name";
    };
  })
};

init();
