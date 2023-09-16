const searchBtn = document.querySelector(".search");
const api = "88c44b59b8ae4c2780bdddfc60b91302";
const todayTemp = document.querySelector('.temp span');
const todayDesc = document.querySelector('.desc')
const todayDate = document.querySelector(".additional-content .date");
const todayImage = document.querySelector('.weather-image img')
const city = document.querySelector('.location .city-name')
const cityTitle = document.querySelector('h4 .city')
const windSpeed = document.querySelector('.wind-speed span')
const humidity = document.querySelector('.humidity .percent span')
const range = document.querySelector('.range-humidity input')
const visibility = document.querySelector(".visibility-mil .mil-amount");
const pressure = document.querySelector(".pressure .pressure-amount");
const nextDay1Temp = document.querySelector('.day__1 .temp .degree')
const nextDay1Image = document.querySelector('.day__1 .weather-img img')
const nextDay2Temp = document.querySelector(".day__2 .temp .degree");
const nextDay2Date = document.querySelector(".day__2 .day-date");
const nextDay2Image = document.querySelector(".day__2 .weather-img img");
const nextDay3Temp = document.querySelector(".day__3 .temp .degree");
const nextDay3Date = document.querySelector(".day__3 .day-date");
const nextDay3Image = document.querySelector(".day__3 .weather-img img");
const nextDay4Temp = document.querySelector(".day__4 .temp .degree");
const nextDay4Date = document.querySelector(".day__4 .day-date");
const nextDay4Image = document.querySelector(".day__4 .weather-img img");
const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const months = ['Jan','Feb','March','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

navigator.geolocation.getCurrentPosition((position) => {
    const {latitude} = position.coords;
    const {longitude} = position.coords;
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${api}`)
    .then(res => res.json())
    .then(data => {
        city.innerText = data.city.name.replace(" City", "");
        cityTitle.innerText = data.city.name.replace(" City", "");
    })
    getWeatherDetails(city.textContent,latitude,longitude)

})
const getWeatherDetails = (cityName, lat , lon) => {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        const uniqueForecastDays = [];
        const fiveDayForecast = data.list.filter((forecast) => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate)
            }
        })
        console.log(fiveDayForecast);
        todayTemp.innerText = Number(fiveDayForecast[0].main.temp).toFixed(1);
        todayDesc.innerText = fiveDayForecast[0].weather[0].description;
        windSpeed.innerText = Number(fiveDayForecast[0].wind.speed).toFixed(1)
        humidity.innerText = fiveDayForecast[0].main.humidity;
        range.value = fiveDayForecast[0].main.humidity;
        visibility.innerText = Number(fiveDayForecast[0].visibility/1600).toFixed(1);
        pressure.innerText = Number(fiveDayForecast[0].main.pressure)
        nextDay1Temp.innerText = Number(fiveDayForecast[1].main.temp).toFixed(1);
        nextDay2Temp.innerText = Number(fiveDayForecast[2].main.temp).toFixed(1);
        nextDay3Temp.innerText = Number(fiveDayForecast[3].main.temp).toFixed(1);
        nextDay4Temp.innerText = Number(fiveDayForecast[4].main.temp).toFixed(1);
        todayDate.innerText = `${weekDays[new Date(fiveDayForecast[0].dt_txt).getDay()]}, ${new Date(fiveDayForecast[0].dt_txt).getDate()} ${months[new Date(fiveDayForecast[0].dt_txt).getMonth()]}`
        nextDay2Date.innerText = `${weekDays[new Date(fiveDayForecast[2].dt_txt).getDay()]}, ${new Date(fiveDayForecast[2].dt_txt).getDate()} ${months[new Date(fiveDayForecast[2].dt_txt).getMonth()]}`
        nextDay3Date.innerText = `${weekDays[new Date(fiveDayForecast[3].dt_txt).getDay()]}, ${new Date(fiveDayForecast[3].dt_txt).getDate()} ${months[new Date(fiveDayForecast[3].dt_txt).getMonth()]}`
        nextDay4Date.innerText = `${weekDays[new Date(fiveDayForecast[4].dt_txt).getDay()]}, ${new Date(fiveDayForecast[4].dt_txt).getDate()} ${months[new Date(fiveDayForecast[4].dt_txt).getMonth()]}`
        if(fiveDayForecast[0].weather[0].main === 'Clear'){
            todayImage.src = "../img/sun (1).png";
        }
        else if (fiveDayForecast[0].weather[0].main === "Clouds") {
            todayImage.src = '../img/cloud-computing.png'
        }
        else if(fiveDayForecast[0].weather[0].main === "Rain"){
            todayImage.src = '../img/rainy.png'
        }
        function weatherImage(i, day){
            if (fiveDayForecast[i].weather[0].main === "Clear") {
              day.src = "../img/sun (1)-small.png";
            } else if (fiveDayForecast[i].weather[0].main === "Clouds") {
              day.src = "../img/cloud-computing-small.png";
            } else if (fiveDayForecast[i].weather[0].main === "Rain") {
              day.src = "../img/rainy-small.png";
            }
        }
        weatherImage(1,nextDay1Image)
        weatherImage(2,nextDay2Image)
        weatherImage(3,nextDay3Image)
        weatherImage(4,nextDay4Image)
    })
    .catch(() => alert('There is something problem.'))
}
const getCityCoordinates = () => {
    const cityName = searchBtn.value.trim()
    if(!cityName) return;
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api}`)
    .then(res => res.json())
    .then(data => {
        const {lat,lon,name} = data[0]
        let cityName = name.replace(' City','')
        city.innerText = cityName;
        cityTitle.innerText = cityName;
        getWeatherDetails(cityName,lat,lon);
    })
    .catch(() => alert(`There is no '${cityName}' city`))
}
searchBtn.addEventListener('keydown',(e) => {
    if(e.key === 'Enter'){
        getCityCoordinates();
    }
})



