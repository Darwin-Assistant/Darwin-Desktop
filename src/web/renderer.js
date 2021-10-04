document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("settings-gear").onclick = () => {
    document.getElementById("settings-panel").style.visibility = "visible";
    document.getElementById("settings-panel").style.transform = "translateY(0)";
  };
  document.getElementById("close-settings-btn").onclick = () => {
    document.getElementById("settings-panel").style.transform =
      "translateY(100%)";
    setTimeout(() => {
      document.getElementById("settings-panel").style.visibility = "hidden";
    }, 1000);
  };
});


