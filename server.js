var dgram = require("dgram");

var server = dgram.createSocket("udp4");

server.on("message", function (msg, rinfo) {
  console.log("ver " + msg.readUInt16BE(0));
  console.log("count " + msg.readUInt16BE(2));
  console.log("sysUpTime " + msg.readUInt32BE(4));
  console.log("UnixSec " + msg.readUInt32BE(8));
  console.log("seq " + msg.readUInt32BE(12)); 
  console.log("sourceID " + msg.readUInt32BE(16)); 
  
  //pull the flowset header to check its length
  var flowsetLenChk = new Buffer(4);
  msg.copy(flowsetLenChk,0,20,24); //first flowset starts at 20
  
  console.log("FSID " + flowsetLenChk.readUInt16BE(0));
  console.log("FS LEN " + flowsetLenChk.readUInt16BE(2));
  console.log("");

  var flowsetLen = flowsetLenChk.readUInt16BE(2);
  var flowset1 = new Buffer(flowsetLen);
  msg.copy(flowset1,0,20,20+flowsetLen);
  
  console.log("FS TMP ID " + flowset1.readUInt16BE(2));
  console.log("FS Field Count " + flowset1.readUInt16BE(4));
  console.log("");
  
  var fsTempId = flowset1.readUInt16BE(4);
  var currentOffset = 6;
  var fieldCount = flowset1.readUInt16BE(6);
  
  //detect if its a template or data
  if (fsTempId >= 0 && fsTempId <= 255) {
    for (var i = fieldCount; i <=  0; i--) {
      currentOffset = currentOffset + 2;
      console.log("FS Type " + flowset1.readUInt16BE(currentOffset));
      currentOffset = currentOffset + 2;
      console.log("FS Len " + flowset1.readUInt16BE(currentOffset));
    };
  };

  //console.log("FS octets " + parseInt(flowset.readDoubleBE(4)));
  console.log("");

});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

server.bind(2055);
