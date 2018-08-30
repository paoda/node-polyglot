require("dotenv").config();
const WebSocket = require("ws");
const WebSocketStream = require("websocket-stream");
const http = require('http');


/**
 * HTTP Server with Websocket which is responsible for:
 *  - Recieving User Audio Media
 *  - Recieving Data relating to which users are in what channel
 */
class WebSocketServer {
  constructor() {
    const server = http.createServer();
    this.stream = WebSocketStream.createServer({ server: server },this.handleStream);

    server.listen(process.env.PORT || 1337)
  }

  handleStream(stream, req) {
    console.log(stream);
  }

  checkIfBuffer(stream) {

  }
}

const wss = new WebSocketServer();
