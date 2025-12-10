const apiKey = '0b428ea8e7150a53e7ddedee87302864';

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("cityInput").addEventListener("keypress", e => {
  if (e.key === "Enter") getWeather();
});

async function getWeather() {
  const city = document.getElementById('cityInput').value || 'delhi';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const weatherBox = document.getElementById('weather');

    if (data.cod !== 200) {
      weatherBox.innerHTML = `<p>City not found. Please try again.</p>`;
      document.body.style.background = 'linear-gradient(to bottom, #ff4e50, #f9d423)';
      return;
    }

    const now = data.dt, sunrise = data.sys.sunrise, sunset = data.sys.sunset;
    const isDay = now >= sunrise && now < sunset;
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // Day/Night background
    document.body.style.background = isDay
      ? 'linear-gradient(to bottom, #87ceeb, #00c6ff)'  // day
      : 'linear-gradient(to bottom, #0b0c2a, #2c3e50)'; // night

    weatherBox.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <img src="${iconUrl}" alt="Weather icon">
      <p><strong>${data.weather[0].main}</strong>: ${data.weather[0].description}</p>
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Min Temp: ${data.main.temp_min} °C | Max Temp: ${data.main.temp_max} °C</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p><strong>${isDay ? '☀ Day time' : '🌙 Night time'}</strong></p>
      <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
      <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
    `;

    document.getElementById('cityInput').focus();
  } catch (err) {
    document.getElementById('weather').innerHTML = `<p>Error fetching data.</p>`;
    console.error(err);
  }
}

window.onload = getWeather;
