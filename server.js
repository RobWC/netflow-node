var dgram = require("dgram");

var server = dgram.createSocket("udp4");

server.on("message", function (msg, rinfo) {
  console.log("ver " + msg.readUInt16BE(0));
  console.log("count " + msg.readUInt16BE(2));
  console.log("sysUpTime " + msg.readUInt32BE(4));
  console.log("UnixSec " + msg.readUInt32BE(8));
  console.log("seq " + msg.readUInt32BE(12));
  console.log("sourceID " + msg.readUInt32BE(16));
  
  //loop through the flow sets 59 bytes each
  var flowset = new Buffer(59);
  msg.copy(flowset,0,20,79);
  
  console.log("FSID " + flowset.readUInt16BE(0));
  console.log("FS LEN " + flowset.readUInt16BE(2));
    console.log("FS octets " + parseInt(flowset.readDoubleBE(4)));


  //console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

server.bind(2055);