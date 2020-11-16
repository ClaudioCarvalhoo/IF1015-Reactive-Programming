const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("voltage.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const voltage = grpcObject.voltage;

const client = new voltage.Voltage(
  "localhost:4747",
  grpc.credentials.createInsecure()
);

setInterval(function () {
  let data = randomInt(100, 130);
  console.log(`Sending data: ${data}`);
  client.sendVoltage({ voltage: data }, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log(response);
    }
  });
}, 2000);

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}
