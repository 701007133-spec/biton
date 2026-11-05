var MODES = {focus: 25 * 60, short: 5 * 60, long: 15 * 60};
var LABELS = {focus: "Focus", short: "Short break", long: "Long break"};
var mode = "focus";
var remaining = MODES.focus;
var running = false;
var timer = null;
var CIRC = 603;

function todayKey(){ return new Date().toISOString().slice(0, 10); }
function loadStats(){
  try { return JSON.parse(localStorage.getItem("tempo-stats") || "{}"); } catch(e){ return {}; }
}
function saveStats(s){ try { localStorage.setItem("tempo-stats", JSON.stringify(s)); } catch(e){} }
var stats = loadStats();
if (!stats.days) stats.days = {};
if (!stats.total) stats.total = 0;

var timeEl = document.getElementById("time");
var phaseEl = document.getElementById("phaseLabel");
var ringEl = document.getElementById("ringFg");
var startBtn = document.getElementById("startBtn");
var hintEl = document.getElementById("hint");

function fmt(s){ var m = Math.floor(s / 60), sec = s % 60; return (m < 10 ? "0" : "") + m + ":" + (sec < 10 ? "0" : "") + sec; }
function render(){
  timeEl.textContent = fmt(remaining);
  ringEl.style.strokeDashoffset = CIRC * (1 - remaining / MODES[mode]);
  ringEl.style.stroke = mode === "focus" ? "#FE2C55" : "#D5FF71";
  var task = document.getElementById("taskInput").value.trim();
  phaseEl.textContent = running ? (mode === "focus" ? (task ? "Focusing: " + task : "Focusing — stay with it") : "On a break — breathe") : LABELS[mode] + " · " + fmt(MODES[mode]);
  startBtn.textContent = running ? "Pause" : (remaining < MODES[mode] ? "Resume" : "Start " + LABELS[mode].toLowerCase());
  document.title = fmt(remaining) + " · Tempo — " + LABELS[mode];
}
function renderStats(){
  var today = stats.days[todayKey()] || 0;
  document.getElementById("statToday").textContent = today;
  document.getElementById("statTotal").textContent = stats.total;
  var streak = 0, d = new Date();
  while (stats.days[d.toISOString().slice(0, 10)]) { streak++; d.setDate(d.getDate() - 1); }
  document.getElementById("statStreak").textContent = streak;
  var dots = document.getElementById("dots");
  dots.innerHTML = "";
  var done = today % 4;
  for (var i = 0; i < 4; i++){ var dot = document.createElement("i"); if (i < done) dot.className = "done"; dots.appendChild(dot); }
}
function setMode(m){
  mode = m; remaining = MODES[m]; stopTimer();
  document.querySelectorAll(".mode").forEach(function(b){ b.classList.toggle("on", b.dataset.mode === m); });
  hintEl.textContent = m === "focus" ? "25 minutes of work, then a 5-minute break. Four focus sessions earn a long break."
    : m === "short" ? "5 minutes. Stand up, drink water, look away from the screen."
    : "15 minutes. You've earned it — four focus sessions done.";
  render();
}
function stopTimer(){ running = false; if (timer){ clearInterval(timer); timer = null; } }
function tick(){
  remaining--;
  if (remaining <= 0){
    stopTimer();
    if (mode === "focus"){
      stats.total++;
      stats.days[todayKey()] = (stats.days[todayKey()] || 0) + 1;
      saveStats(stats);
      renderStats();
      var done = stats.days[todayKey()] % 4;
      hintEl.textContent = "Session done. " + (done === 0 ? "Four in a row — take the long break." : "Take a 5-minute break, then go again.");
      setMode(done === 0 ? "long" : "short");
    } else {
      hintEl.textContent = "Break over. Ready for another focus session?";
      setMode("focus");
    }
    render();
    return;
  }
  render();
}
startBtn.addEventListener("click", function(){
  if (running){ stopTimer(); render(); return; }
  running = true;
  timer = setInterval(tick, 1000);
  render();
});
document.getElementById("resetBtn").addEventListener("click", function(){ stopTimer(); remaining = MODES[mode]; render(); });
document.querySelectorAll(".mode").forEach(function(b){ b.addEventListener("click", function(){ setMode(b.dataset.mode); }); });
document.getElementById("taskInput").addEventListener("input", render);
render();
renderStats();
