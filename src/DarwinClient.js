const ws = require("ws");
const { EventEmitter } = require("events");
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
      }
    });
    this.ws.on("close", () => {
      console.log("Connection closed");
    });
  }
};
