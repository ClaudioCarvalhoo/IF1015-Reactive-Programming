const WebSocket = require("ws");
const webSocket = require("rxjs/webSocket").webSocket;
const filter = require("rxjs/operators").filter;
var amqp = require("amqplib/callback_api");

const subject = webSocket({
  url: "ws://localhost:8080/randomVoltage",
  WebSocketCtor: WebSocket,
});

let filteredSubject = subject.pipe(
  filter((voltage) => voltage >= 105 && voltage <= 120)
);

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = "invalidVoltages";
    channel.assertQueue(queue, {
      durable: true,
    });

    filteredSubject.subscribe(
      (msg) => {
        console.log("Invalid voltage: " + msg);
        channel.sendToQueue(queue, Buffer.from(msg.toString()));
      },
      (err) => console.log(err),
      () => console.log("Connection closed")
    );
  });
});
