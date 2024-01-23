// HTML elements
const searchInputEl = $("#search-input");
const searchBtnEl = $("#search-btn");
const historySearchEl = document.getElementById('history-search');
const searchResultEl = $("#search-results");
const searchModal = document.getElementById('searchModal');
const modalTitle = searchModal.querySelector('.modal-title');
const modalBody = searchModal.querySelector('.modal-body');


// Weather API
const APIKey = "4e288eceaa29829b0c7a261ce2cac83c";
const geoCodingLimit = 5;
const geoCodingURL = "http://api.openweathermap.org/geo/1.0/direct?q="
const weatherForecastURL = "https://api.openweathermap.org/data/2.5/forecast?";

// Object
var search = {
    cityList : [],

    // _checkDuplicate : function(timeBlock) {
    //     // check if timeBlock 
    //     for (let index = 0; index < this.notes.length; index++) {
    //       const element = this.notes[index];
    //       if (element.timeBlock === timeBlock) {
    //         return index;          
    //       }
    //     };
    //     return -1;
    //   },
  
      // saveNote gets note and save note to hourNotes in localStorage after transform to string.
      // return false/true if it failed/success to save to localStorage
    saveCity : function(city) {
        
        this.cityList.push(city);
        
        // check if the timeblock data has been existed. If yes, overwite it, else push it to array.
        // var index = this._checkDuplicate(time);
        // if (index < 0) {
        //   this.notes.push(note);
        // } else {
        //   this.notes[index] = note;
        // };
  
        try {
          localStorage.setItem('cityList', JSON.stringify(this.cityList));
          return true;
        } catch(e) {
          return false;
        };
              
      },
    
    //   // loadNotes returns array of objects from cityList in localStorage.
    loadCities : function() {
        if (localStorage.getItem("cityList") != null) {
            //  get string from scoreTable in localStorage and transform back to array of objects.
            this.cityList = JSON.parse(localStorage.getItem("cityList"));           
        };
        return this.cityList;
    },
    
    // clearAll clears the array notes and hourNotes in localStorage
    clearAll : function() {
        if (this.cityList.length != 0) {
            this.cityList.length = 0;
        };
        localStorage.removeItem("cityList");
    },

}

// getCities: get citis list with lat and lon from Weather API
function getCities(url, cityName, limit) {
    //code here
    var queryURL = url + cityName + "&limit=" + limit + "&appid=" + APIKey;
    
    fetch(queryURL)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
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


// renderHistorySearch: display list of history search of city.
function renderHistorySearch() {
    if (search.cityList.length === 0) {
        historySearchEl.innerHTML = "";
        return;
    };
    
    historySearchEl.innerHTML = "";
    var cities = search.loadCities();
    for (var i = cities.length - 1; i >= 0; i--) {
        // var city = {
        //     name : cities[i].name,
        //     state : cities[i].state,
        //     country : cities[i].country,
        //     fullName : cities[i].name + '/' + cities[i].state + ', ' + cities[i].country,
        //     lat : cities[i].lat,
        //     lon : cities[i].lon,
        // }        
            
        var cityEl = document.createElement('a');
        cityEl.classList = 'list-item flex-row justify-space-between align-center';
        cityEl.setAttribute("data-lat", cities[i].lat);
        cityEl.setAttribute("data-lon", cities[i].lon);
        cityEl.setAttribute("data-name", cities[i].fullName);
        // cityEl.setAttribute("data-bs-dismiss", "modal");
        
        cityEl.textContent = cities[i].fullName;

        historySearchEl.appendChild(cityEl);
    };    
}

// renderModalBody: display lat and lon of cities on modalBody
function renderModalBody(cities, searchTerm) {
    if (cities.length === 0) {
        modalBody.textContent = 'No city found.';
        return;
    };
    
      //citySearchTerm.textContent = searchTerm;
    
    for (var i = 0; i < cities.length; i++) {
        var city = {
            name : cities[i].name,
            state : cities[i].state,
            country : cities[i].country,
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

// var searchButtonHandler = function (event) {
//     event.preventDefault();

//     var city = searchInputEl.val().trim();
//     console.log(city);
// }
// searchBtnEl.on("click", searchButtonHandler);

// catch click on modalBody
modalBody.addEventListener('click', function (event) {
    //console.log(event.target);
    var element = event.target;
    if (element.matches("a") === true) {
        // render historySearch
        var city = {
            fullName : element.getAttribute("data-name"),
            lat : element.getAttribute("data-lat"),
            lon : element.getAttribute("data-lon"),
        };
        console.log(city);
        search.saveCity(city);

        // historySearchEl.innerHTML = "";
        renderHistorySearch();

        // getWeatherForecast
    }

    modalBody.innerHTML = "";
});
// modalBody.addEventListener('hidden.bs.modal', event => {
//     console.log(event.target);
// });

// searchButtonHandler
if (searchModal) {
  searchModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    // const recipient = button.getAttribute('data-bs-whatever')
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.

    // Update the modal's content.
    

    // modalTitle.textContent = `New message to ${recipient}`
    // modalBodyInput.value = recipient

    var city = searchInputEl.val().trim();
    if (city) {
        // get lat and lon for city & display 5 results on the modalBody
        getCities(geoCodingURL, city, geoCodingLimit);

        //modalBody.textContent = city;        
    } else {
        modalBody.textContent = "Please input the correct city name"
    }
    console.log(city);
  })
}