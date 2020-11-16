const amqp = require("amqplib/callback_api");
const http = require("http");

let responses = [];
http
  .createServer(function (req, res) {
    res.writeHeader(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    responses.push(res);
  })
  .listen(9090);
console.log("SSE-Server started!");

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = "invalidVoltages2";

    channel.assertQueue(queue, {
      durable: true,
    });

    console.log("Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(
      queue,
      function (msg) {
        console.log("Invalid voltage: %s", msg.content.toString());
        responses.forEach((res) =>
          res.write("data: " + msg.content.toString() + "\n\n")
        );
      },
      {
        noAck: true,
      }
    );
  });
});
