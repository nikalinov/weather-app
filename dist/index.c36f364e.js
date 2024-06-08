const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
const weatherTypes = {
    Rain: "https://img.icons8.com/color-glass/42/000000/rain.png",
    Clouds: "https://img.icons8.com/color-glass/42/000000/cloud.png",
    Clear: "https://img.icons8.com/color-glass/42/000000/sun.png"
};
// formatting time and day
function formatTime(date) {
    let hours = date.getHours();
    if (hours < 10) hours = `0${hours}`;
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = `0${minutes}`;
    return `${hours}:${minutes}`;
}
function formatDay(date) {
    const dayArray = date.getDay();
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    const day = days[dayArray];
    return day;
}
// getting current time & day and displaying it
const currentTime = document.querySelector("#current-time");
let newCurrentTime = new Date();
currentTime.innerHTML = formatTime(newCurrentTime);
const currentDay = document.querySelector("#current-day");
let newCurrentDay = new Date();
currentDay.innerHTML = formatDay(newCurrentDay);
// implementing search bar and api request
function displayWeatherInfo(response) {
    const fiveDaysDictionary = createFiveDaysDictionary(response);
    setCurrDayWeather(fiveDaysDictionary);
    setThreeHourForecast(fiveDaysDictionary);
    setNextDaysWeather(fiveDaysDictionary);
}
function setCurrDayWeather(fiveDaysDictionary) {
    document.querySelector("#searched-city").innerHTML = fiveDaysDictionary[0][3]["city"];
    document.querySelector("#current-temperature").innerHTML = `${fiveDaysDictionary[0][3]["temp"]}\xb0`;
    document.querySelector("#humidity").innerHTML = `${fiveDaysDictionary[0][3]["humidity"]}%`;
    document.querySelector("#wind").innerHTML = `${fiveDaysDictionary[0][3]["windSpeed"]}km/h`;
    document.querySelector("#weather-type").innerHTML = fiveDaysDictionary[0][3]["weatherType"];
    document.querySelector("#current-day").innerHTML = fiveDaysDictionary[0][3]["day"];
}
function setThreeHourForecast(fiveDaysDictionary) {
    const threeHourTemp = document.getElementById("threeHour");
    const blocks = threeHourTemp.getElementsByClassName("col");
    for(let i = 0; i < blocks.length; i++){
        let hours = 3 * i;
        if (hours < 10) hours = "0" + hours.toString();
        else hours = hours.toString();
        blocks[i].getElementsByTagName("h3")[0].innerHTML = hours + ":00";
        console.log(fiveDaysDictionary);
        const weatherType = fiveDaysDictionary[0][i]["weatherType"];
        blocks[i].getElementsByTagName("p")[0].innerHTML = weatherType;
        blocks[i].getElementsByTagName("img")[0].src = weatherTypes[weatherType];
        blocks[i].getElementsByTagName("span")[0].innerHTML = fiveDaysDictionary[0][i]["temp"] + "\xb0";
    }
}
function setNextDaysWeather(fiveDaysDictionary) {
    const nextDays = document.getElementsByClassName("row week-forecast")[0].childNodes;
    for(let i = 0; i < fiveDaysDictionary.length - 1; i++){
        const currDay = nextDays[1 + 2 * i];
        currDay.getElementsByTagName("h3")[0].innerHTML = fiveDaysDictionary[i + 1][3]["day"];
        currDay.getElementsByClassName("weather")[0].innerHTML = fiveDaysDictionary[i + 1][3]["weatherType"];
        currDay.getElementsByTagName("span")[0].innerHTML = fiveDaysDictionary[i + 1][3]["temp"] + "\xb0";
        currDay.getElementsByTagName("img")[0].src = weatherTypes[fiveDaysDictionary[i + 1][3]["weatherType"]];
    }
}
function createFiveDaysDictionary(response) {
    const dailyWeather = [
        [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ],
        [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ],
        [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ],
        [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ],
        [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    ];
    for(let i = 0; i < 5; i++)for(let j = 0; j < 8; j++){
        dailyWeather[i][j].city = response.data.city.name;
        dailyWeather[i][j].temp = Math.round(response.data.list[8 * i + (4 + j) % 8].main.temp);
        dailyWeather[i][j].humidity = response.data.list[8 * i + j].main.humidity;
        dailyWeather[i][j].windSpeed = Math.round(response.data.list[8 * i + (4 + j) % 8].wind.speed);
        dailyWeather[i][j].weatherType = response.data.list[8 * i + (4 + j) % 8].weather[0].main;
        dailyWeather[i][j].day = dayNames[new Date(response.data.list[8 * i + (4 + j) % 8].dt_txt.split(" ")[0]).getDay()];
    }
    return dailyWeather;
}
function getAllTempElements() {
    var spans = $("span").filter(function(idx) {
        console.log(idx);
        return this.innerHTML.indexOf("\xb0") > -1;
    });
    return spans;
}
function switchToFahrenheit() {
    const tempNodes = getAllTempElements();
    for(let i = 0; i < tempNodes.length; i++){
        const currCelsius = Number(tempNodes[i].innerHTML.slice(0, -1));
        tempNodes[i].innerHTML = Math.round(currCelsius * 1.8 + 32).toString() + "\xb0F";
    }
}
function searchCity(city) {
    const apiKey = "2b5fc755ac2ec59250868b5527df31c4"; // TODO hide API Key
    const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric`;
    axios.get(`${apiUrl}&appid=${apiKey}`).then(displayWeatherInfo);
    setPicture(city);
}
async function setPicture(city) {
    const promise = await fetch(`https://api.unsplash.com/search/photos/?client_id=Z2pRlKiwrqZYJQbwMytFxXzOWQF0ggPOCQQsuuecHic&query=${city}&page=1`); // TODO hide API Key
    const result = await promise.json();
    const picture = result.results[0].urls.raw;
    console.log(picture);
    document.getElementsByTagName("style")[0].innerHTML = `body::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 120%;
        background-image: url("${picture}");
        opacity: 0.2;
        background-size: cover;
      }`;
}
function handleSubmit(event) {
    event.preventDefault();
    let city = document.querySelector("#search-input").value;
    searchCity(city);
}
const searchBar = document.querySelector("#search-form");
searchBar.addEventListener("submit", handleSubmit);
const fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", switchToFahrenheit);
searchCity("Bristol");

//# sourceMappingURL=index.c36f364e.js.map
