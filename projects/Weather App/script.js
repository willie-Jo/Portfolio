/*
File: script.js
Description: Fetches weather data from OpenWeather API and displays it.
Note: You need a free API key from https://openweathermap.org/api
*/

// IMPORTANT: Get API key and paste it here
const API_KEY = "YOUR_API_KEY_HERE";  
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// Get DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherBox = document.getElementById('weatherBox');
const errorMsg = document.getElementById('errorMsg');

// Run search when button is clicked
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city!== '') {
        getWeather(city);
    }
});

// Run search when Enter key is pressed
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city!== '') {
            getWeather(city);
        }
    }
});

// Main function to fetch weather data
async function getWeather(city) {
    try {
        // Show loading state
        weatherBox.style.display = 'none';
        errorMsg.style.display = 'none';
        
        // Fetch data from API
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        // If city not found
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        
        // Display the data
        displayWeather(data);
        
    } catch (error) {
        // Show error message
        errorMsg.textContent = error.message;
        errorMsg.style.display = 'block';
    }
}

// Function to update the UI with weather data
function displayWeather(data) {
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('wind').textContent = data.wind.speed;
    
    // Set weather icon
    const iconCode = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    weatherBox.style.display = 'block';
}