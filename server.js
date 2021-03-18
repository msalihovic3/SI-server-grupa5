// npm install uNetworking/uWebSockets.js#v18.14.0
const { json } = require('express');
const uWS = require('uWebSockets.js');

// an "app" is much like Express.js apps with URL routes,
// here we handle WebSocket traffic on the wildcard "/*" route

const app = uWS.App().ws('/*', {  // handle messages from client

  open: (socket, req) => {
    /* For now we only have one canvas */
    socket.send("Connected");
    console.log("Someone connected "+socket.value);
  },
  message: (socket, message, isBinary) => {

    var theMessage =JSON.parse(Buffer.from(message));

    if(theMessage.key === 'subscribeToImage'){
      socket.subscribe('imageReciever');
      socket.send("subscribed");
    }

    else if(theMessage.key === 'image'){
      app.publish("imageReciever",theMessage.value);
    }

    console.log("I got "+theMessage.key + " " +theMessage.value);
    
  }
}).get('/', (res,req) => {

  res.end("Nothing to see here");

});

var server_port = process.env.YOUR_PORT || process.env.PORT || 25565;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

app.listen(server_port,server_host, (listenSocket) => {
  if (listenSocket) {
    console.log('Listening to port '+server_port);
  }
});

