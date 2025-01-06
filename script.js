let cityInput = document.getElementById('city_input'),
searchBtn = document.getElementById('searchBtn'),
api_key = '6c8b01bc8a3666e72b759f2e1a3e4c61',
currentWeatherCard = document.querySelectorA11('.weather-left .card')[0];
fiveDaysForecastCard = document.querySelector('.day-forecast');
aqiCard = document.querySelectorAll('.highlights.card')[0];

function getWeatherDetails(name, lat, lon, country, state){
    let FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon={lon}&appid={api_key}',
    WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon={lon}&appid={api_key}',
    AIR_POLLUTION_API_URL = 'http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid={api_key}'
    days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ],
    months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
       let {co, no, no2, o3, so2, pm2.5, pm10, nh3} = data.list[0].com
        aqiCard.innerHTML = '
        <div class="card-head">
                <p>Air Quality index</p>
                <p class="air-index aqi-1">Good</p>
            </div>
            <div class="air-indice">
                <i class="fa-regular fa-wind fa-3x"></i>
                <div class="item">
                    <p>PM2.5</p>
                    <h2>____</h2>
                </div>
                <div class="item">
                    <p>PM10</p>
                    <h2>____</h2>
                </div>
                <div class="item">
                    <p>SO2</p>
                    <h2>____</h2>
                </div>
                <div class="item">
                    <p>CO</p>
                    <h2>____</h2>
                </div>
                <div class="item">
                    <p>NO</p>
                    <h2>____</h2>
                </div>
                <div class="item">
                    <p>NO2</p>
                    <h2>____</h2>
                </div>
                <div class="item">
                    <p>NH3</p>
                    <h2>____</h2>
                </div>
                <div class="item">
                    <p>O3</p>
                    <h2>____</h2>
                </div>
            </div>
        ';
    }).catch(() => {
        alert('Failed to fetch Air Quality Index');
    });

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        let date = new Date();
        currentWeatherCard.innerHTML  = '
         <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0]description.</p>
                    </div>
                    <div class="weather-icon"></div>
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class="fa-light fa-calender"></i>${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear}</p>
                <p><i class="fa-light fa-location-dot"></i> ${name}, ${country}</p>
            </div>
        ';
    }).catch(() => {
        alert('Failed to fetch current weather');
    });
    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        let uniqueForecastDays = [];
        let fiveDaysForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
    fiveDaysForecastCard.innerHTML = '';
    for(i = 1; i < fiveDaysForecast.length; i++){
        let date = new Date(fiveDaysForecast[i].dt_txt);
        fiveDaysForecastCard.innerHTML += '
         <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" 
                        alt="">
                    <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;
                    C</span>
                    </div>
                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
        ';
    }
}).catch(() => {
    alert('Failed to fetch weather forecast');
});
}


function getCityCoordinates(){
    let cityName = cityInput.ariaValueMax.trim();
    cityInput.value = '';
    if(!cityName) return;
    let GEOCODING_API_URL_ = 'http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}';
    fetch(GEOCODING_API_URL_) .then(res => res.json()).then(data => {
        let {name, lat, lon, country, state} =data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch(() => {
        alert('Failed to fetch coordinates of ${cityName}');
    } );
}

searchBtn.addEventListener('click', getCityCoordinates);