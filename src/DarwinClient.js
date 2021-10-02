const ws = require("ws");
const { EventEmitter } = require("events");
const axios = require("axios");
const open = require("open");
module.exports = class DarwinClient extends EventEmitter {
  constructor(url = "ws://localhost:3500/gateway") {
    super();
    this.ws = new ws(url, {
      headers: {
        Authorization: "password",
        platform: "windows",
        name: "Windows-Main",
      },
    });
    this.ws.on("message", (msg) => {
      const data = JSON.parse(msg);
      switch (data.intent) {
        case "auth":
          this.deviceID = data.body.id;
          console.log(`Device ID: ${this.deviceID}`);
          this.emit("ready");
          this.ready = true;
          break;
        case "message.regular":
          this.emit("message", data.body);
          break;
        case "app.start":
          open("kek", { app: "google chrome" });
      }
    });
    this.ws.on("close", () => {
      console.log("Connection closed");
      this.emit("close");
      this.ready = false;
    });
  }
  sendMessage(msg) {
    axios({
      method: "post",
      url: "http://localhost:3500/api/actions/create",
      headers: {
        authorization: "password",
        "device-id": this.deviceID,
        "Content-Type": "application/json",
      },
      data: {
        message: msg,
      },
    }).catch((e) => {
      if (e.response.status === 404) {
        this.emit("message", {
          say: null,
          content: "Sorry, I don't know what to say",
        });
      } else console.error(e);
    });
  }
};
