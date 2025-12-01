const rejsePlanUrl =
  "https://www.rejseplanen.dk/api/nearbyDepartureBoard?accessId=5b71ed68-7338-4589-8293-f81f0dc92cf2&originCoordLat=57.048731&originCoordLong=9.968186&format=json";

async function getDepartures() {
  const res = await fetch(rejsePlanUrl);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  return res.json();
}

async function displayDepartures() {
  const container = document.getElementById("departures");
  if (!container) return;

  try {
    const data = await getDepartures();

    let departures = [];
    if (data.DepartureBoard?.Departure) {
      departures = Array.isArray(data.DepartureBoard.Departure)
        ? data.DepartureBoard.Departure
        : [data.DepartureBoard.Departure];
    }

    if (!departures.length) {
      container.innerHTML = "<h2>❄️ Bustider ❄️</h2><p>No departures found.</p>";
      return;
    }

    const now = new Date();

    const futureDepartures = departures
      .map((dep) => {
        const dateStr = dep.date || new Date().toISOString().split("T")[0];
        const timeStr = dep.rtTime || dep.time;
        if (!timeStr) return null;

        const ts = `${dateStr}T${timeStr}:00`;
        const depDateTime = new Date(ts);

        return { ...dep, depDateTime };
      })
      .filter((dep) => dep && dep.depDateTime > now)
      .sort((a, b) => a.depDateTime - b.depDateTime)
      .slice(0, 8);

    container.innerHTML =
      `<h2>❄️ Bustider ❄️</h2>` +
      futureDepartures
        .map((dep, index) => {
          const name = dep.name || dep.line || "Ukendt";
          const direction = dep.direction || "";
          const time = (dep.rtTime || dep.time || "").slice(0, 5);

          const timeHtml = `<span style="color:#B11E31; font-weight:600;">${time}</span>`;

          const delay =
            dep.rtTime && dep.rtTime !== dep.time
              ? `<span style="color:#B11E31; font-weight:700;">F</span>`
              : "";

          const highlightStyle =
            index === 0 ? 'background:#F8AD1E; color:#166138;' : "";

          return `
          <div class="card departure-card" style="${highlightStyle}">
            <h3>${name}</h3>
            ${direction ? `<div><h3>${direction}</h3></div>` : ""}
            ${time ? `<div><h3>${delay} ${timeHtml}</h3></div>` : ""}
          </div>
        `;
        })
        .join("");

  } catch (err) {
    container.innerHTML =
      `<h2>❄️ Bustider ❄️</h2>
       <p>Vi kan desværre ikke hente bustider lige nu<br>Vi arbejder på sagen 💛</p>`;
  }
}

document.addEventListener("DOMContentLoaded", displayDepartures);
setInterval(displayDepartures, 10000); // update every 5 seconds