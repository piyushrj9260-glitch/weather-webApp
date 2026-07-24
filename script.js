let searchHistory = [];

const WEATHER_ICONS = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="#F2A93B" stroke-width="1.6"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2 12h2.4M19.6 12H22M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" stroke-linecap="round"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="#93A6BF" stroke-width="1.6"><path d="M6.5 18a4 4 0 1 1 .8-7.93A5 5 0 0 1 17 12.2 3.5 3.5 0 0 1 16.5 19H6.5Z" stroke-linejoin="round"/></svg>',
  rain: '<svg viewBox="0 0 24 24" fill="none" stroke="#5FB4E5" stroke-width="1.6"><path d="M6.5 15a4 4 0 1 1 .8-7.93A5 5 0 0 1 17 9.2 3.5 3.5 0 0 1 16.5 16H6.5Z" stroke-linejoin="round"/><path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2" stroke-linecap="round"/></svg>',
  snow: '<svg viewBox="0 0 24 24" fill="none" stroke="#EEF3F9" stroke-width="1.6"><path d="M6.5 14a4 4 0 1 1 .8-7.93A5 5 0 0 1 17 8.2 3.5 3.5 0 0 1 16.5 15H6.5Z" stroke-linejoin="round"/><path d="M12 17v5M9.5 19.5l5-2.5M14.5 19.5l-5-2.5" stroke-linecap="round"/></svg>',
  storm: '<svg viewBox="0 0 24 24" fill="none" stroke="#E8785A" stroke-width="1.6"><path d="M6.5 13a4 4 0 1 1 .8-7.93A5 5 0 0 1 17 7.2 3.5 3.5 0 0 1 16.5 14H6.5Z" stroke-linejoin="round"/><path d="M13 14l-3 4h3l-2 4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

function weatherCodeInfo(code){
  // simplified WMO code mapping
  if(code === 0) return { text: 'Clear sky', icon: WEATHER_ICONS.sun };
  if([1,2].includes(code)) return { text: 'Partly cloudy', icon: WEATHER_ICONS.sun };
  if(code === 3) return { text: 'Overcast', icon: WEATHER_ICONS.cloud };
  if([45,48].includes(code)) return { text: 'Fog', icon: WEATHER_ICONS.cloud };
  if([51,53,55,56,57].includes(code)) return { text: 'Drizzle', icon: WEATHER_ICONS.rain };
  if([61,63,65,66,67,80,81,82].includes(code)) return { text: 'Rain', icon: WEATHER_ICONS.rain };
  if([71,73,75,77,85,86].includes(code)) return { text: 'Snow', icon: WEATHER_ICONS.snow };
  if([95,96,99].includes(code)) return { text: 'Thunderstorm', icon: WEATHER_ICONS.storm };
  return { text: 'Clear', icon: WEATHER_ICONS.sun };
}

function uvMeta(uv){
  if(uv < 3) return { label: 'Low', color: '#4FCB90' };
  if(uv < 6) return { label: 'Moderate', color: '#F2A93B' };
  if(uv < 8) return { label: 'High', color: '#E8785A' };
  if(uv < 11) return { label: 'Very High', color: '#E1497A' };
  return { label: 'Extreme', color: '#B85FE0' };
}

function quickSearch(city){
  document.getElementById('cityInput').value = city;
  handleSearch();
}

function setStatus(msg, isError){
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = isError ? 'error' : '';
}

function gaugeCircle(radius){
  return 2 * Math.PI * radius;
}

async function handleSearch(){
  const input = document.getElementById('cityInput');
  const city = input.value.trim();
  const btn = document.getElementById('searchBtn');

  if(!city){
    setStatus('Enter a city name to search.', true);
    return;
  }

  btn.disabled = true;
  setStatus('Fetching latest readings…');

  try{
    const geoRes = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city) + '&count=1');
    const geoData = await geoRes.json();

    if(!geoData.results || geoData.results.length === 0){
      setStatus('No matching city found. Check the spelling and try again.', true);
      btn.disabled = false;
      return;
    }

    const place = geoData.results[0];
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + place.latitude +
      '&longitude=' + place.longitude +
      '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature,is_day' +
      '&daily=uv_index_max' +
      '&timezone=auto';

    const wRes = await fetch(url);
    const w = await wRes.json();

    renderWeather(place, w);
    addToHistory(place, w);
    setStatus('');
  }catch(err){
    console.error(err);
    setStatus('Could not fetch weather data. Check your connection and try again.', true);
  }

  btn.disabled = false;
}

function renderWeather(place, w){
  const temp = Math.round(w.current.temperature_2m);
  const feels = Math.round(w.current.apparent_temperature);
  const humidity = w.current.relative_humidity_2m;
  const wind = w.current.wind_speed_10m;
  const uv = w.daily.uv_index_max[0];
  const cond = weatherCodeInfo(w.current.weather_code);
  const uvi = uvMeta(uv);

  const locationName = place.name + (place.admin1 ? ', ' + place.admin1 : '') + ', ' + place.country;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const humidityCirc = gaugeCircle(30);
  const humidityOffset = humidityCirc - (humidity / 100) * humidityCirc;

  const uvCirc = gaugeCircle(30);
  const uvOffset = uvCirc - (Math.min(uv, 12) / 12) * uvCirc;

  const html = `
    <div class="hero">
      <div class="hero-main">
        <div class="hero-eyebrow"><span class="dot"></span> Live reading &middot; ${dateStr}</div>
        <div class="hero-city">${locationName}</div>
        <div class="hero-meta">Feels like ${feels}&deg; &middot; Lat ${place.latitude.toFixed(2)}, Lon ${place.longitude.toFixed(2)}</div>
        <div class="hero-reading">
          <div class="hero-icon">${cond.icon}</div>
          <div>
            <div class="temp-value">${temp}<span class="temp-unit">&deg;C</span></div>
          </div>
          <div class="condition-block">
            <div class="condition-text">${cond.text}</div>
            <div class="condition-sub">Wind ${wind} km/h</div>
          </div>
        </div>
      </div>

      <div class="instrument-col">
        <div class="instrument-card">
          <svg class="gauge" width="76" height="76" viewBox="0 0 76 76">
            <circle class="gauge-track" cx="38" cy="38" r="30"/>
            <circle class="gauge-fill" cx="38" cy="38" r="30" stroke="#5FB4E5"
              stroke-dasharray="${humidityCirc}" stroke-dashoffset="${humidityOffset}"
              transform="rotate(-90 38 38)"/>
            <text class="gauge-label" x="38" y="43" text-anchor="middle">${humidity}</text>
          </svg>
          <div class="instrument-info">
            <div class="label">Humidity</div>
            <div class="headline">${humidity}%</div>
            <div class="sub">Relative humidity at 2m</div>
          </div>
        </div>

        <div class="instrument-card">
          <svg class="gauge" width="76" height="76" viewBox="0 0 76 76">
            <circle class="gauge-track" cx="38" cy="38" r="30"/>
            <circle class="gauge-fill" cx="38" cy="38" r="30" stroke="${uvi.color}"
              stroke-dasharray="${uvCirc}" stroke-dashoffset="${uvOffset}"
              transform="rotate(-90 38 38)"/>
            <text class="gauge-label" x="38" y="43" text-anchor="middle">${uv}</text>
          </svg>
          <div class="instrument-info">
            <div class="label">UV Index</div>
            <div class="headline" style="color:${uvi.color}">${uvi.label}</div>
            <div class="sub">Peak value expected today</div>
          </div>
        </div>
      </div>
    </div>

    <div class="strip">
      <div class="strip-card">
        <div class="label">Wind Speed</div>
        <div class="value">${wind}<span>km/h</span></div>
      </div>
      <div class="strip-card">
        <div class="label">Feels Like</div>
        <div class="value">${feels}<span>&deg;C</span></div>
      </div>
      <div class="strip-card">
        <div class="label">Condition</div>
        <div class="value" style="font-size:16px;">${cond.text}</div>
      </div>
      <div class="strip-card">
        <div class="label">Local Time</div>
        <div class="value" style="font-size:16px;">${w.current.is_day ? 'Daytime' : 'Nighttime'}</div>
      </div>
    </div>
  `;

  document.getElementById('app').innerHTML = html;
}

function addToHistory(place, w){
  const temp = Math.round(w.current.temperature_2m);
  const humidity = w.current.relative_humidity_2m;
  const uv = w.daily.uv_index_max[0];

  searchHistory = searchHistory.filter(h => h.name !== place.name);
  searchHistory.unshift({ name: place.name, temp, humidity, uv });
  searchHistory = searchHistory.slice(0, 8);

  document.getElementById('historySection').style.display = 'block';
  const rail = document.getElementById('historyRail');
  rail.innerHTML = searchHistory.map(h => `
    <div class="history-card" onclick="quickSearch('${h.name.replace(/'/g, "\\'")}')">
      <div class="city">${h.name}</div>
      <div class="row"><span>Temp</span><b>${h.temp}&deg;C</b></div>
      <div class="row"><span>Humidity</span><b>${h.humidity}%</b></div>
      <div class="row"><span>UV</span><b>${h.uv}</b></div>
    </div>
  `).join('');
}

document.getElementById('cityInput').addEventListener('keydown', function(e){
  if(e.key === 'Enter') handleSearch();
});
