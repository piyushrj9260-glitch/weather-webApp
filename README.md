# Isobar — Live Weather Instruments 🌤️

**Isobar** is a modern, responsive weather dashboard featuring custom gauge instruments, real-time data fetching, and an elegant dark-theme interface.

🚀 **Live Demo:**  https://piyushrj9260-glitch.github.io/weather-webApp/

---

## 📸 Overview

Isobar provides comprehensive weather readings for any location worldwide using live geocoding and meteorological data.

![Isobar Preview](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

- 🔍 **Global City Search:** Instantly look up weather conditions for any city worldwide using the Open-Meteo Geocoding API.
- 📊 **Dynamic Instrument Gauges:** SVG circular gauges displaying real-time relative humidity and peak daily UV Index metrics.
- ⚡ **Quick-Search Chips:** Fast access to popular global cities with a single click.
- 🕒 **Recent Search History:** Keeps track of your recently viewed locations for fast re-checking.
- 📱 **Responsive Glassmorphism Design:** Beautiful dark-mode aesthetic built with CSS variables, smooth gradients, and custom web fonts (Fraunces, Inter, IBM Plex Mono).
- 🚫 **Zero External Dependencies:** Built with pure HTML, CSS, and Vanilla JavaScript.

---

## 🛠️ Built With

- **HTML5** — Semantic page layout
- **CSS3** — Custom properties, CSS Grid, Flexbox, & radial/conic gradients
- **JavaScript (ES6+)** — Asynchronous `fetch` API & dynamic DOM rendering
- **Open-Meteo API** — Free & open-source weather forecasting API

---

## 📂 Project Structure

```
weather/
├── index.html      # Main HTML layout & structure
├── style.css       # Design tokens, variables, & responsive styling
├── script.js       # API fetching logic, DOM updates, & interactivity
└── README.md       # Project documentation & live links
```

---

## 🚀 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/piyushrj9260-glitch/weather.git
   cd weather
   ```

2. **Open in browser:**
   Simply open `index.html` in any web browser, or launch a local static server:
   ```bash
   # Using Python
   python -m http.server 3000

   # Using Node npx
   npx serve .
   ```

3. Navigate to `http://localhost:3000` in your browser.

---

## 📄 License

This project is open source under the [MIT License](LICENSE).
