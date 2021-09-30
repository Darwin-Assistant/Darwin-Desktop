require("dotenv").config();
const { app, BrowserWindow, ipcMain } = require("electron");
const { key, url } = process.env;
const { IamAuthenticator } = require("ibm-watson/auth");
const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const DarwinClient = new (require("./DarwinClient"))();
// Init watson speech client
var speechClient = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: key,
  }),
  serviceUrl: url,
});
// function to handle the speech to text
const recognize = (audio) => {
  const params = {
    audio: audio,
    contentType: "audio/wav",
  };
  return speechClient.recognize(params);
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 400,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: __dirname + "/preload.js",
    },
  });
  win.loadFile(__dirname + "/web" + "/index.html");
  ipcMain.handle("recognize", async (event, audio) => {
    const result = await recognize(audio);
  });
  ipcMain.handle("window:close", () => win.close());
  ipcMain.handle("window:minimize", () => win.minimize());
};

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  app.quit();
});
process.on("uncaughtException", () => {});
