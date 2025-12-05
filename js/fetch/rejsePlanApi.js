const rejsePlanUrl =
  'https://www.rejseplanen.dk/api/nearbyDepartureBoard?accessId=5b71ed68-7338-4589-8293-f81f0dc92cf2&originCoordLat=57.048731&originCoordLong=9.968186&format=json';
 
const CACHE_KEY = 'departureCache'
const CACHE_DURATION = 60 * 60 * 1000 // 1 time i ms
 
async function getDepartures() {
  const cached = localStorage.getItem(CACHE_KEY)
 

  if (cached) {
    const { timestamp, data } = JSON.parse(cached)
    if (Date.now() - timestamp < CACHE_DURATION) {
      console.log('Bruger cached data')
      return data
    }
  }
 
  const now = new Date()
  const hour = now.getHours()
  const withinAllowedHours = hour >= 7 && hour < 15
 
  if (!withinAllowedHours) {
    console.log('API-opkald blokeret pga tidsbegrænsning (udenfor 07-15)')
    if (cached) return JSON.parse(cached).data
    return { DepartureBoard: { Departure: [] } }
  }
 
  console.log('Fetcher fra API...')
  
  
  const res = await fetch(rejsePlanUrl)
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
  const data = await res.json()
 
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      timestamp: Date.now(),
      data,
    })
  )
 
  return data
}
 
async function displayDepartures() {
  const container = document.getElementById('departures')
 
  try {
    const data = await getDepartures()
    console.log(data);
    let departures = []
    if (data.Departure) {
      departures = Array.isArray(data.Departure)
        ? data.Departure
        : [data.Departure]
    }
 
    const now = new Date()
 
      const futureDepartures = departures
     .map((dep) => {
    const dateStr = dep.date || new Date().toISOString().split('T')[0]
const timeStr = dep.rtTime || dep.time
if (!timeStr) return null
 
const depDateTime = new Date(`${dateStr}T${timeStr}:00`)
 return { ...dep, depDateTime }
})
   .slice(0, 8)

      console.log(futureDepartures);
      

      container.innerHTML =
      `<h2>❄️ Bustider ❄️</h2>` +
      futureDepartures
        .map((dep, index) => {
          console.log(`Dep:`, dep);
          
          const name = dep.name || dep.line || "Ukendt";
          const direction = dep.direction || "";
          const time = (dep.rtTime || dep.time || "").slice(0, 5);
          const delay = dep.rtTime && dep.rtTime !== dep.time ? "<strong style='color:#B11E31'>F</strong> " : "";
          const highlightStyle = index === 0 ? 'background:#F8AD1E; color:#166138;' : "";
 
          return `
          <div class="card departure-card" style="${highlightStyle}">
            <h3>${name}</h3>
            ${direction ? `<div><h3>${direction}</h3></div>` : ""}
            ${time ? `<div><h3>${delay}${time}</h3></div>` : ""}
          </div>
        `;
        })
        .join("");
        console.log(container);
        

  } catch (err) {
    console.log(err)
  }
}
 
document.addEventListener('DOMContentLoaded', displayDepartures)
setInterval(displayDepartures, 30000) // opdater hver 5 min


 


