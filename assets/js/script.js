// HTML elements
const searchInputEl = $("#search-input");
const searchBtnEl = $("#search-btn");
const historySearch = $("#history-search");
const searchResultEl = $("#search-results");
const searchModal = document.getElementById('searchModal');
const modalTitle = searchModal.querySelector('.modal-title');
const modalBody = searchModal.querySelector('.modal-body');


// Weather API
const APIKey = "4e288eceaa29829b0c7a261ce2cac83c";
const geoCodingLimit = 5;
const geoCodingURL = "http://api.openweathermap.org/geo/1.0/direct?q="
const weatherForecastURL = "https://api.openweathermap.org/data/2.5/forecast?";


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
        //var cityName = cities[i].name + '/' + cities[i].state + ', ' + cities[i].country;
    
        var cityEl = document.createElement('a');
        cityEl.classList = 'list-item flex-row justify-space-between align-center';
        cityEl.setAttribute("data-lat", city.lat);
        cityEl.setAttribute("data-lon", city.lon);
        cityEl.setAttribute("data-name", city.fullName);
        cityEl.textContent = city.fullName;
    
        // var titleEl = document.createElement('span');
        // titleEl.textContent = city.fullName;
    
        // cityEl.appendChild(titleEl);
    
        // var statusEl = document.createElement('span');
        // statusEl.classList = 'flex-row align-center';
    
        // if (cities[i].open_issues_count > 0) {
        //   statusEl.innerHTML =
        //     "<i class='fas fa-times status-icon icon-danger'></i>" + cities[i].open_issues_count + ' issue(s)';
        // } else {
        //   statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        // }
    
        // repoEl.appendChild(statusEl);
    
        modalBody.appendChild(cityEl);
    };
}

// var searchButtonHandler = function (event) {
//     event.preventDefault();

//     var city = searchInputEl.val().trim();
//     console.log(city);
// }
// searchBtnEl.on("click", searchButtonHandler);

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
        // get lat and lon for city
        getCities(geoCodingURL, city, geoCodingLimit);

        // display 5 results on the modalBody

        //

        //modalBody.textContent = city;        
    } else {
        modalBody.textContent = "Please input the correct city name"
    }
    console.log(city);
  })
}