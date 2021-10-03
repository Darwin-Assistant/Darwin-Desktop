const ws = require("ws");
const { EventEmitter } = require("events");
const axios = require("axios");
const open = require("open");
module.exports = class DarwinClient extends EventEmitter {
  constructor(host = "localhost:3500", secureProtocol = false) {
    super();
    this.host = host;
    this.restUrl = `${secureProtocol ? "https" : "http"}://${host}/api`;
    this.ws = new ws(
      (secureProtocol ? "wss://" : "ws://") + host + "/gateway",
      {
        headers: {
          Authorization: "password",
          platform: "windows",
          name: "Windows-Main",
        },
      }
    );
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
      url: this.restUrl + "/actions/create",
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
