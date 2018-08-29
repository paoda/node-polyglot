require('dotenv').config();
const WebSocket = require('ws');

class ActionCable {
    constructor(url, channel) {
        this.url = url;
        this.channel = channel;
        this.connected = false; 
        
        this.io = new WebSocket(url, ['actioncable-v1-json', 'actioncable-unsupported']);
        
        this.setUpEventListeners();
        
    }
    
    setUpEventListeners() {
        this.io.on('open', (msg) => {
            console.log('Connected to ' + this.url)
            this.connected = true;
            this.subscribe();
        })
        
        this.io.on('close', (msg) => {
            console.log("Disconnected from ActionCable Server");
            this.connected = false;
        })
    
        this.io.on('message', (msg) => {
            console.log(msg);
        })
    }


    send(command, identifier) {
        this.io.send(JSON.stringify({command, identifier}));
    }

    subscribe() {
        this.io.send(JSON.stringify(
            {
                command: "subscribe", identifier: JSON.stringify({channel: this.channel})
            }));
    }
}

/**
 * {
 *  "identifier": "{\"channel\":\"VideoSessionChannel\"}","message":{"type":"JOIN_ROOM","from":"9921"}}
 */

class WebRTC {
    constructor(username) {
        this.username = "NodeServer";
    }

    handleJoin(data) {
        data = {
            identifier: "{\"channel\":\"VideoSessionChannel\"}",
            message: {
                type: "JOIN_ROOM",
                from: "9921"
            }
        }
    }


}
const ac = new ActionCable('ws://0.0.0.0:3000/cable', process.env.DEFAULT_CHANNEL);