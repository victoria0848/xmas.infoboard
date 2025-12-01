const wc = document.getElementById("wc");
let occupied = false;

setInterval(() => {
  occupied = !occupied;
  wc.innerHTML = occupied ? "🚻 WC" : "🚻 WC";
  wc.style.color = occupied ? "#B11E31;" : "#166138;";
}, 4000);