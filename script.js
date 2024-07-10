let userTab = document.querySelector("[data-userWeather]");
let searchTab = document.querySelector("[data-searchWeather]");
let userContainer = document.querySelector(".weather-container");
let grantAccessContainer = document.querySelector(".grant-location-container");
let searchForm = document.querySelector("[data-searchForm]");
let loadingScreen = document.querySelector(".loading-conatiner");
let userInfoContainer = document.querySelector(".user-info-container");
let errorPage = document.querySelector(".error-page");

//initial variables
let currentTab = userTab;
let API_KEY = "c687e729ad00a6ed0d841090a6197663";
currentTab.classList.add("current-tab");
getSessionStorage();

//function to switch tabs
function switchTab(clickedTab) {
  //if current tab is not clicked
  if (currentTab != clickedTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    //if search form is hidden then for sure we have clicked on the search tab
    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      //if search form tab is hidden then for sure w have clicked on user tab
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");

      //after hiding both the search form and user info container search for user data
      //if data found then fetch api else showing grant access screen

      getSessionStorage();
    }
  }
}

//function to get the user details - coordinates
function getSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantAccessContainer.classList.add("active"); //if user data not found then show grant access screen
  } else {
    const coordinates = JSON.parse(localCoordinates); //This converts JSON text into JSON object
    fetchUserWeatherInfo(coordinates); //if found then fetch weather info as per data
  }
}

//Asynchronous function to fetch the information from server and convert it into json format
async function fetchUserWeatherInfo(coordinates) {
  //Creating variables to store latitudes and longitudes
  const { lat, lon } = coordinates; //Destructring the JSON object

  //mkaing grantAccessContainer invisible ib order to show the loading screen till daat is being fetched from the server
  grantAccessContainer.classList.remove("active");
  //Showing the Loading screen
  loadingScreen.classList.add("active");

  //Try and Catch Block
  try {
    //getting response
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    //converting to json format
    const data = await response.json();
    //hiding loading screen
    loadingScreen.classList.remove("active");
    //showing grantAccess screen
    userInfoContainer.classList.add("active");

    renderWeatherInfo(data);
  } catch (error) {
    //If data is not fetched hide the loading screen
    loadingScreen.classList.remove("active");
    //And showing the error 404 screen
    errorPage.classList.add("active");
    //and print error on the console window
    console.log("Not Found", error);
  }
}

//If is User Tab is clicked
userTab.addEventListener("click", () => {
  switchTab(userTab);
});

//If search Tab is clicked
searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

//Rendering received information from api into the DOM
function renderWeatherInfo(weatherInfo) {
  //Creating variables for all different king of data enterie to be filled with api information
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  cityName.textContent = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.textContent = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.textContent = weatherInfo?.main?.temp;
  windspeed.textContent = weatherInfo?.wind?.speed;
  humidity.textContent = weatherInfo?.main?.humidity;
  cloudiness.textContent = weatherInfo?.clouds?.all;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log();
  }
}

function showPosition(position) {
  let userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

let grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click", getLocation);

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value === "") {
    return;
  } else {
    fetchSearchWeatherInfo(searchInput.value);
  }
});

async function fetchSearchWeatherInfo(cityName) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found");
      } else {
        throw new Error("An error occurred");
      }
    }

    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");

    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.remove("active");
    errorPage.classList.add("active");
    console.log("Not Found", error);
  }
}
