var WebSocketServer = require("ws").Server;
wss = new WebSocketServer({ port: 7474, path: "/randomVoltage" });
wss.on("connection", function (ws) {
  ws.on("message", function (message) {
    console.log("Msg received in server: %s ", message);
  });
  var interval = setInterval(function () {
    sendData(ws);
  }, 2000);
  console.log("New connection");
});
function sendData(ws) {
  let data = randomInt(100, 130);
  console.log(`Sending data: ${data}`);
  ws.send(data);
}
function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}
