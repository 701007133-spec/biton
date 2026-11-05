function hexToRgb(h){ h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
function rgbToHex(r, g, b){ return "#" + [r, g, b].map(function(v){ v = Math.max(0, Math.min(255, Math.round(v))); var s = v.toString(16); return s.length === 1 ? "0" + s : s; }).join("").toUpperCase(); }
function mix(a, b, t){ var x = hexToRgb(a), y = hexToRgb(b); return rgbToHex(x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t); }
function lum(h){ var c = hexToRgb(h); return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]; }
function textColor(h){ return lum(h) > 150 ? "#111" : "#fff"; }
function buildPalette(base){
  var steps = [
    {name: "Tint 3", hex: mix(base, "#FFFFFF", 0.75)},
    {name: "Tint 1", hex: mix(base, "#FFFFFF", 0.4)},
    {name: "Base", hex: base.toUpperCase()},
    {name: "Shade 1", hex: mix(base, "#000000", 0.35)},
    {name: "Shade 3", hex: mix(base, "#000000", 0.7)}
  ];
  var hsl = rgbToHsl(hexToRgb(base));
  var acc = hslToHex((hsl[0] + 180) % 360, hsl[1], hsl[2]);
  steps.push({name: "Accent", hex: acc});
  return steps;
}
function rgbToHsl(c){
  var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b), h = 0, s = 0, l = (max + min) / 2;
  if (max !== min){
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}
function hslToHex(h, s, l){
  var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2, rgb = [0, 0, 0];
  if (h < 60){ rgb = [c, x, 0]; } else if (h < 120){ rgb = [x, c, 0]; } else if (h < 180){ rgb = [0, c, x]; }
  else if (h < 240){ rgb = [0, x, c]; } else if (h < 300){ rgb = [x, 0, c]; } else { rgb = [c, 0, x]; }
  return rgbToHex((rgb[0] + m) * 255, (rgb[1] + m) * 255, (rgb[2] + m) * 255);
}
function loadSaved(){ try { return JSON.parse(localStorage.getItem("palette-saved") || "[]"); } catch(e){ return []; } }
function saveSaved(v){ try { localStorage.setItem("palette-saved", JSON.stringify(v)); } catch(e){} }

var baseInput = document.getElementById("baseColor");
var hexInput = document.getElementById("hexInput");
var baseHexEl = document.getElementById("baseHex");
var paletteEl = document.getElementById("palette");
var current = [];

function render(){
  var base = baseInput.value.toUpperCase();
  baseHexEl.textContent = base;
  hexInput.value = base;
  current = buildPalette(base);
  paletteEl.innerHTML = "";
  current.forEach(function(s){
    var b = document.createElement("button");
    b.type = "button"; b.className = "sw";
    b.style.background = s.hex; b.style.color = textColor(s.hex);
    b.innerHTML = "<span>" + s.hex + "</span><small>" + s.name + "</small>";
    b.addEventListener("click", function(){
      if (navigator.clipboard) navigator.clipboard.writeText(s.hex);
      b.querySelector("span").textContent = "Copied";
      setTimeout(function(){ b.querySelector("span").textContent = s.hex; }, 900);
    });
    paletteEl.appendChild(b);
  });
}
function renderSaved(){
  var saved = loadSaved();
  var list = document.getElementById("savedList");
  document.getElementById("savedEmpty").style.display = saved.length ? "none" : "block";
  list.innerHTML = "";
  saved.forEach(function(p, i){
    var d = document.createElement("div");
    d.className = "saved-card";
    d.innerHTML = '<div class="strip">' + p.colors.map(function(c){ return '<i style="background:' + c + '"></i>'; }).join("") + '</div><div class="meta"><span>' + p.base + ' · ' + p.colors.length + ' colors</span><button type="button">Load</button><button type="button" data-del="' + i + '">Delete</button></div>';
    d.querySelectorAll("button")[0].addEventListener("click", function(){ baseInput.value = p.base; render(); });
    d.querySelectorAll("button")[1].addEventListener("click", function(){ var s = loadSaved(); s.splice(i, 1); saveSaved(s); renderSaved(); });
    list.appendChild(d);
  });
}
baseInput.addEventListener("input", render);
hexInput.addEventListener("change", function(){
  var v = hexInput.value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)){ baseInput.value = v; render(); }
  else hexInput.value = baseInput.value;
});
document.getElementById("randomBtn").addEventListener("click", function(){
  var h = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0").toUpperCase();
  baseInput.value = h; render();
});
document.getElementById("saveBtn").addEventListener("click", function(){
  var saved = loadSaved();
  saved.unshift({base: baseInput.value.toUpperCase(), colors: current.map(function(s){ return s.hex; })});
  saveSaved(saved.slice(0, 12));
  renderSaved();
});
document.getElementById("cssBtn").addEventListener("click", function(){
  var css = ":root {\n" + current.map(function(s, i){ return "  --color-" + (i + 1) + ": " + s.hex + "; /* " + s.name + " */"; }).join("\n") + "\n}";
  if (navigator.clipboard) navigator.clipboard.writeText(css);
  var btn = document.getElementById("cssBtn");
  btn.textContent = "Copied as CSS";
  setTimeout(function(){ btn.textContent = "Copy as CSS"; }, 1200);
});
render();
renderSaved();
