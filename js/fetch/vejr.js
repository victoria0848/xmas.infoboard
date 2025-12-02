const rURL = "https://api.openweathermap.org/data/2.5/weather?q=Aalborg&units=metric&appid=4d58d6f0a435bf7c5a52e2030f17682d";

// Hent data uden cache
async function getWeather() {
    const res = await fetch(rURL, { cache: "no-store" });
    if (!res.ok) throw new Error("Weather API error: " + res.status);
    return await res.json();
}

function roundTemp(t) {
    return typeof t === "number" ? Math.round(t) : "N/A";
}

async function displayWeather() {
    const el = document.getElementById("weather");
    if (!el) return console.error("Element #weather ikke fundet");

    try {
        const data = await getWeather();

        console.log("RAW WEATHER DATA:", data);

        const temp = roundTemp(data.main?.temp);

        el.innerHTML = `
            <h2 class="weather-temp">${temp}°C</h2>
        `;
        
    } catch (err) {
        console.error(err);
        el.textContent = "—";
    }
}

document.addEventListener("DOMContentLoaded", displayWeather);
