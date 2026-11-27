document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("nav-leaves-btn");
  if (!button) return;

  const nextMode = { off: "leaves", leaves: "rain", rain: "off" };
  const labels = { off: "关闭", leaves: "落叶", rain: "下雨" };
  const layer = document.createElement("div");
  layer.className = "weather-layer";
  layer.setAttribute("aria-hidden", "true");
  const leafColors = ["#f8d363", "#ffb347", "#e25822", "#8b4513", "#d2691e", "#cd5c5c"];
  let mode = localStorage.getItem("weather-mode");
  if (!Object.hasOwn(nextMode, mode)) {
    mode = mode === "auto" || localStorage.getItem("leaves-enabled") === "true" ? "leaves" : "off";
    localStorage.setItem("weather-mode", mode);
  }

  function renderWeather() {
    layer.remove();
    layer.replaceChildren();
    button.dataset.weather = mode;
    button.setAttribute("aria-label", `天气效果${labels[mode]}，点击切换为${labels[nextMode[mode]]}`);
    if (mode === "off") return;

    layer.className = "weather-layer weather-" + mode;
    const isRain = mode === "rain";
    const count = isRain ? 48 : 32;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("i");
      const glass = isRain && i < 10;
      const duration = glass ? 7 + Math.random() * 5
        : isRain ? 0.7 + Math.random() * 0.6 : 3 + Math.random() * 5;
      particle.className = glass ? "glass-drop" : isRain ? "rain-streak" : "falling-leaf";
      particle.style.setProperty("--duration", duration + "s");
      particle.style.setProperty("--delay", -Math.random() * duration + "s");
      if (glass) {
        // Four drops on either edge. The two central drops slide less often.
        const band = i < 4 ? 0 : i < 8 ? 82 : 18;
        particle.style.left = band + Math.random() * (i < 8 ? 18 : 64) + "%";
        if (i >= 8) particle.style.setProperty("--duration", duration * 2 + "s");
        particle.style.top = Math.random() * 93 + "%";
        particle.style.width = 3 + Math.random() * 5 + "px";
        particle.style.setProperty("--slide", 40 + Math.random() * 135 + "px");
      } else {
        particle.style.left = Math.random() * 100 + "%";
      }
      if (!isRain) {
        particle.style.width = 8 + Math.random() * 14 + "px";
        particle.style.backgroundColor = leafColors[Math.floor(Math.random() * leafColors.length)];
        particle.style.setProperty("--sway", 1.5 + Math.random() * 1.5 + "s");
      }
      layer.append(particle);
    }
    document.getElementById("wrap").append(layer);
  }

  button.addEventListener("click", () => {
    mode = nextMode[mode];
    localStorage.setItem("weather-mode", mode);
    renderWeather();
  });
  renderWeather();
  button.hidden = false;
});
