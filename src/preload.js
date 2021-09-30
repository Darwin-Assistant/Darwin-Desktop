const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("close-btn").onclick = () => {
    ipcRenderer.invoke("window:close");
  };
  document.getElementById("min-btn").onclick = () => {
    ipcRenderer.invoke("window:minimize");
  };
  document.getElementById("input-msg").onsubmit = (e) => {
    e.preventDefault();
    if (document.getElementById("welcome-content")) {
      const t = document.getElementById("welcome-content").style;
      t.transform = "translateY(-50px)";
      t.opacity = 0;
      setTimeout(() => {
        document.getElementById("welcome-content").remove();
      }, 200);
    }
  };
});
function fadeOut(el) {
  Array.from(document.getElementsByClassName(el)).forEach((elem) => {
    elem.style.opacity = 0;
    elem.style.transform = "translateY(-50px)";
  });
}
ipcRenderer.on("message", () => {
  fadeOut("option");
  setTimeout(() => {
    Array.from(document.getElementsByClassName(el)).forEach((elem) => {
      elem.remove();
    });
  });
});
