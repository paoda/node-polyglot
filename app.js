require('dotenv').config();
const WebSocket = require('ws');
const WebSocketStream = require('websocket-stream');



class WebSocketServer {
  constructor() {
    this.io = new WebSocket.Server({
      port: process.env.PORT || 1337,
    });

    this.stream = WebSocketStream.createServer({
      server: this.io,
    }, this.handleStream)

  this.createEventListeners();
  }


  handleStream(stream, req) {
    console.log(stream);  
  }
  createEventListeners() {
    this.io.on('connection', (io) => {
      io.on('message', (msg) => {
        console.log('Recieved: %s', msg);
      })
    })
  }
}


const wss = new WebSocketServer();
