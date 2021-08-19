const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = require("./app");
const port = process.env.PORT || 6000;
const base45 = require("base45");
const cbor = require("cbor-web");
const fs = require("fs");
const zlib = require("zlib");
const jpeg = require("jpeg-js");
const jsQR = require("jsqr");
const pako = require("pako");
var request = require('request');
const {requestWithEncoding}= require('./test.js')

dotenv.config({ path: "./config/config.env" });
app.use(express.json({ extended: false }));
app.use(require("cors")());
console.log("wokring");

var headers = {
  "accept-charset" : "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
  "accept-language" : "en-US,en;q=0.8",
  "accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "user-agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.13+ (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2",
  "accept-encoding" : "gzip,deflate",
};

app.post("/decode", async (req, res) => {
  res.writeHead(200, { "content-encoding": headers });

  // Remove `HC1:` from the string
  // const greenpassBody = req.body.data.substr(4);

  // Data is Base45 encoded
  const decodedData = base45.decode(req.body.data);
  base64.b64encode(decodedData)
  console.log("decodedData",decodedData)
  // And zipped
  const output = zlib.inflateSync(decodedData);
  console.log("output",output)
  const results = cbor.decodeAllSync(output);

  [headers1, headers2, cbor_data, signature] = results[0].value;

  const greenpassData = cbor.decodeAllSync(cbor_data);

  console.log(JSON.stringify(greenpassData[0].get(-260).get(1), null, 2));
});


app.listen(port, () => console.log(`Server now running on port ${port}!`));
