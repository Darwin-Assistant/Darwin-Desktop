const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("optionHandler", (e) => {
  const val = e.getAttribute("data-option");
  if (!val) return;
  if (document.getElementById("welcome-content")) {
    const t = document.getElementById("welcome-content").style;
    t.transform = "translateY(-50px)";
    t.opacity = 0;
    setTimeout(() => {
      document.getElementById("welcome-content").remove();
    }, 200);
  }
  ipcRenderer.invoke("send:message", val);
  document.getElementById("loader").style.visibility = "visible";
});
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
    const value = document.getElementById("text-input").value;
    if (!value.trim()) return;
    ipcRenderer.invoke("send:message", value);
    document.getElementById("text-input").value = "";
    document.getElementById("loader").style.visibility = "visible";
  };
});
function fadeOut(el) {
  Array.from(document.getElementsByClassName(el)).forEach((elem) => {
    elem.style.opacity = 0;
    elem.style.transform = "translateY(-50px)";
  });
}
ipcRenderer.on("message", (e, m) => {
  fadeOut("option");
  document.getElementById("message-holder").innerHTML = "";
  const elem = document.createElement("div");
  elem.classList.add("message-content");
  elem.appendChild(
    document
      .createElement("span")
      .appendChild(document.createTextNode(m.content))
  );
  document.getElementById("message-holder").appendChild(elem);
  document.getElementById("loader").style.visibility = "hidden";
  if (m.say) {
    document.getElementById("assistant-sounds").src =
      "https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=" +
      encodeURIComponent(m.say);
    document.getElementById("assistant-sounds").play();
  }
  setTimeout(() => {
    Array.from(document.getElementsByClassName("option")).forEach((elem) => {
      elem.remove();
    });
  }, 200);
});
