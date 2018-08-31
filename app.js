require("dotenv").config();
const http = require('http');
const Speech = require('./google-cloud/Speech');
const Translate = require('./google-cloud/Translate');

/**
 * HTTP Server with Websocket which is responsible for:
 *  - Recieving User Audio Media
 *  - Recieving Data relating to which users are in what channel
 */
class WebSocketServer {
  constructor() {
    const server = http.createServer();

    /** @type {Server} */
    this.io = require('socket.io')(server);

    this.google = {
      /** @type {Speech} */
      speech: null,
      /** @type {Translate} */
      translate: null
    }

    server.listen(process.env.PORT || 1337);

    this.listen();
  }

  listen() {
    this.io.on('connection', (client) => {
      console.log("User Connected to Server.");

      client.on('disconnect', () => {
        console.log("Client Disconnected.");
      });

      client.on('join', () => {
        client.emit("welcome", "Welcome to The Polyglot NodeJS Server");
      });

      client.on('binary', (data) => {
        if (this.google.speech.enabled) {
          this.google.speech.getStream().write(data);
        }
      });

      client.on('startRecognition', (lang) => {
        if (this.google.speech) {
          this.google.speech.stopRecognition();
          this.google.speech = null;
        }

        console.log("Speech Recognition Started");
        this.google.speech = new Speech()
        this.google.speech.startRecognition(lang);
      })

      client.on('stopRecognition', () => {
        // Close Speech Class
        console.log("Command given to close Speech Class");
      })
    });
  }
}

const wss = new WebSocketServer();
