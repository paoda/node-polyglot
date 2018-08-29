"use strict";

require("dotenv").config();
const WebSocket = require("ws");

/**
 * Client responsible for communicating with ActionCable Websocket.
 * @param {string} url - URL of Websocket (starts with ws:// or wss://)
 * @param {string} channel -  Name of ActionCable Channel.
 */
class ActionCable {
  constructor(url, channel) {
    /** @type {string} */
    this.url = url;
    /** @type {string} */
    this.channel = channel;
    /** @type {boolean} */
    this.connected = false;

    /** @type {WebSocket} */
    this.io = new WebSocket(url, [
      "actioncable-v1-json",
      "actioncable-unsupported"
    ]);

    /** @type {WebRTC} */
    this.rtc = new WebRTC("NodeServer");

    this.setUpEventListeners();
  }

  /**
   * Sets up the Websocket event listeners.
   */
  setUpEventListeners() {
    this.io.on("open", data => {
      console.log("Connected to " + this.url);
      this.connected = true;
      this.subscribe();
    });

    this.io.on("close", data => {
      console.log("Disconnected from ActionCable Server");
      this.connected = false;
    });

    this.io.on("message", data => {
      data = JSON.parse(data);
      console.log(data);

      if (data.message && data.message.type) {
        switch (data.message.type) {
          case "JOIN_ROOM":
            this.rtc.handleJoin(data.message);
            break;
          case "REMOVE_USER":
            console.log("User has Left Room");
            this.rtc.handleLeave(data.message);
            break;
          default:
            // console.log("Pinged");
        }
      }
    });
  }

  /**
   * Send Stringified Object to Websocket Server to be processed
   * @param {string} command
   * @param {Object} identifier
   */
  send(command, identifier) {
    this.io.send(JSON.stringify({ command, identifier }));
  }

  /**
   * Send Stringified Object to Websocket server asking to subscribe to channel
   */
  subscribe() {
    this.io.send(
      JSON.stringify({
        command: "subscribe",
        identifier: JSON.stringify({ channel: this.channel })
      })
    );
  }
}

/**
 * The Class Responsible for Handling the data from the WebSocket and Getting the MediaStream.
 * @param {string} username - The name of this server when joining the WebRTC Ecosystem.
 */
class WebRTC {
  constructor(username) {
    /** @type {Array<User>}  Array of Connected Users */
    this.users = [];
    /** @type {string} */
    this.username = username;
  }

  /**
   * Handles onmessage event when message contains JOIN
   * @param {JSON} data - Objectified (???) JSON
   */
  handleJoin(data) {
    console.log("User " + data.from + " has joined the room");
    this.users.push(new User(data.from));

    //Try and Exchange Data with the person 
  }

  /**
   * Handles onmessage event when message contains REMOVE
   * @param {JSON} data - Stringified JSON
   */
  handleLeave(data) {
    console.log("User " + data.from + " has left the room.");
    this.users
  }
}

const ac = new ActionCable(
  "ws://0.0.0.0:3000/cable", 
  process.env.DEFAULT_CHANNEL
);


class User {
  constructor(id) {
    this.id = id;
  }
}


(function addDeleteMethodToArrayPrototype() {
  Array.prototype.delete = function(toRemove) {
    let i = this.indexOf(toRemove);

    if (i !== -1) this.splice(i, 1);

    //return this;
  }
})();

const arr = ["Brave", "New", "World"];

console.log(arr.delete("New"));
console.log("Length: " + arr.length);
