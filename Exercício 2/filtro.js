const WebSocket = require("ws");
const webSocket = require("rxjs/webSocket").webSocket;
const filter = require("rxjs/operators").filter;
const merge = require("rxjs").merge;
const Subject = require("rxjs/Subject").Subject;
var amqp = require("amqplib/callback_api");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("voltage.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const voltage = grpcObject.voltage;

const server = new grpc.Server();
server.bind("localhost:4747", grpc.ServerCredentials.createInsecure());

server.addService(voltage.Voltage.service, {
  sendVoltage: receiveVoltage,
});
server.start();

const grpcSubject = new Subject();
function receiveVoltage(call, callback) {
  let { voltage } = call.request;
  grpcSubject.next(voltage);
  callback(null, {});
}

const subjectWS = webSocket({
  url: "ws://localhost:7474/randomVoltage",
  WebSocketCtor: WebSocket,
});

let mergedSubject = merge(grpcSubject, subjectWS);

let filteredSubject = mergedSubject.pipe(
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

    var queue = "invalidVoltages2";
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
