document.addEventListener("DOMContentLoaded", () => {
  const timeContainer = document.getElementById("getCopenhagenTime");
  const dateContainer = document.getElementById("getCopenhagenDate");

  function updateCopenhagenTimeAndDate() {
    const now = new Date();

    // Time
    const timeOptions = {
      timeZone: "Europe/Copenhagen",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    };

    const rawTime = now.toLocaleTimeString("da-DK", timeOptions);
    const [hh, mm, ss] = rawTime.split(":");

    timeContainer.innerHTML = `${hh}:<span class="red">${mm}</span>:<span class="red">${ss}</span>`;

    // Date
    const dateOptions = {
      timeZone: "Europe/Copenhagen",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    };
    dateContainer.textContent = now.toLocaleDateString("da-DK", dateOptions);
  }

  updateCopenhagenTimeAndDate();
  setInterval(updateCopenhagenTimeAndDate, 1000);
});
