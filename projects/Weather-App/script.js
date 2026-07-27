/*
File: script.js
Description: Fetches weather data from OpenWeather API and displays it.
Note: You need a free API key from https://openweathermap.org/api
*/


const API_KEY = "YOUR_API_KEY_HERE";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

let cityInput, searchBtn, messageBox;

document.addEventListener('DOMContentLoaded', () => {
    cityInput = document.getElementById('cityInput');
    searchBtn = document.getElementById('searchBtn');
    messageBox = document.getElementById('messageBox');
    
    // Always clear on load/refresh
    cityInput.value = '';
    messageBox.classList.add('hidden');
    messageBox.innerHTML = '';
    
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
});

function handleSearch() {
    const city = cityInput.value.trim();
    
    if (city === '') {
        showMessage('error', 'Please enter a city name');
        return;
    }
    
    // Check API Key
    if (API_KEY === "YOUR_API_KEY_HERE") {
        alert('⚠️ API Key Missing: Get a free key from openweathermap.org and paste it in script.js');
        /*showMessage('error', '⚠️ API Key Missing. Check console for instructions.');*/
        return;
    }
    
    getWeather(city);
}

async function getWeather(city) {
    showMessage('loading', 'Fetching weather...'); // optional loading state
    
    try {
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (response.status === 404) {
            showMessage('error', 'Enter correct spelling or valid location');
            return;
        }
        if (response.status === 401) {
            alert('error', '⚠️ Invalid API Key');
            /*showMessage('error', '⚠️ Invalid API Key');*/
            return;
        }
        if (!response.ok) {
            throw new Error('Network error');
        }
        
        const data = await response.json();
        showWeather(data); 
        
    } catch (error) {
        showMessage('error', '🌐 No internet connection. Please check your network.');
    }
}

function showWeather(data) {
    messageBox.className = 'weather'; // remove hidden, add weather class
    messageBox.innerHTML = `
    <h2>${data.name}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
    <div id="temp">${Math.round(data.main.temp)}°C</div>
    <p>${data.weather[0].description}</p>
    <div class="details">
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind: ${data.wind.speed} m/s</p>
    </div>
    `;
}

function showMessage(type, text) {
    messageBox.className = type; // 'error' or 'loading'
    messageBox.innerHTML = `<p>${text}</p>`;
}