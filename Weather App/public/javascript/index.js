const OPENWEATHERMAP_API_KEY = "c28dfa02889ca8bbe3c97565d5a8d220";
const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dem"];
const DIRECTION = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
  "N",
];

const loading = () => {
  const cover = document.querySelector(".cover");
  cover.style.zIndex = 1;
  cover.style.opacity = "1";
};

const unloading = () => {
  const cover = document.querySelector(".cover");
  cover.style.zIndex = -1;
  cover.style.opacity = "0";
};

const convertKelvinAndCelsius = (degree, isKelvin = true) => {
  if (isKelvin) {
    return parseInt(degree - 273.15);
  }

  return parseInt(degree + 273.15);
};

const getUTCTime = (timestamp) => {
  const date = new Date(timestamp);

  return `${date.getUTCHours()}:${date.getUTCMinutes()}`;
};

const getDirectionIndex = (deg) => {
  let index = parseInt((deg % 360) / 22.5) + 1;
  return DIRECTION[index - 1];
};

const getData = async (location = "London") => {
  loading();
  const rawData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OPENWEATHERMAP_API_KEY}`,
  );
  const data = await rawData.json();

  const infoSection = document.querySelector(".display-info-section");
  const errorMessage = document.querySelector(".error-message");

  if (+data.cod !== 200) {
    infoSection.style.display = "none";
    errorMessage.style.display = "block";
    errorMessage.querySelector("p").textContent =
      data.message[0].toUpperCase() + data.message.slice(1) + "!";
    unloading();
  } else {
    infoSection.style.display = "block";
    errorMessage.style.display = "none";
    showWeatherInfo(data);
  }
};

const showWeatherInfo = (data) => {
  const img = document.querySelector(".image-wraper > img");
  const imgDescription = document.querySelector(".image-wraper > p");
  const city = document.querySelector(".general-info h1");
  const date = document.querySelector(".general-info .date");
  const currTemp = document.querySelector(".general-info .current-temperature > span");
  const feelTemp = document.querySelector(".general-info .feels-like-temperature > span");

  const tempMin = document.querySelector("#temp-min");
  const tempMax = document.querySelector("#temp-max");
  const sunrise = document.querySelector("#sunrise");
  const sunset = document.querySelector("#sunset");
  const country = document.querySelector("#country");
  const humidity = document.querySelector("#humidity");
  const visibility = document.querySelector("#visibility");
  const windDirection = document.querySelector("#wind-direction");
  const windSpeed = document.querySelector("#wind-speed");
  const clouds = document.querySelector("#clouds");

  img.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  imgDescription.textContent =
    data.weather[0].description[0].toUpperCase() + data.weather[0].description.slice(1);
  city.textContent = data.name;
  date.textContent = `${
    MONTH[new Date().getMonth()]
  } ${new Date().getDate()} ${new Date().getFullYear()}`;
  currTemp.textContent = convertKelvinAndCelsius(data.main.temp);
  feelTemp.textContent = convertKelvinAndCelsius(data.main.feels_like);

  tempMin.textContent = convertKelvinAndCelsius(data.main.temp_min);
  tempMax.textContent = convertKelvinAndCelsius(data.main.temp_max);
  sunrise.textContent = getUTCTime(data.sys.sunrise * 1000);
  sunset.textContent = getUTCTime(data.sys.sunset * 1000);
  country.textContent = data.sys.country;

  humidity.textContent = data.main.humidity + "%";
  visibility.textContent = data.visibility / 1000 + "km";
  windDirection.textContent = getDirectionIndex(data.wind.deg);
  windSpeed.textContent = data.wind.speed + "m/s";
  clouds.textContent = data.clouds.all + "%";

  unloading();
};

const addSearchEvent = () => {
  const search = document.querySelector("#search");
  const searchButton = document.querySelector("#search-button");

  searchButton.addEventListener("click", (e) => {
    getData(search.value);
  });

  search.addEventListener("keyup", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.which === 13) {
      getData(search.value);
    }
  });
};

addSearchEvent();

getData();
