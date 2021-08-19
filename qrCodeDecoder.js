const base45 = require("base45");
const cbor = require("cbor");
const fs = require("fs");
const jpeg = require("jpeg-js");
const jsQR = require("jsqr");
const pako = require("pako");

const greenpassJpeg = fs.readFileSync("./image.jpg");
const greenpassImageData = jpeg.decode(greenpassJpeg, { useTArray: true });
const decodedGreenpass = jsQR(
  greenpassImageData.data,
  greenpassImageData.width,
  greenpassImageData.height
);

const greenpassBody = decodedGreenpass.data.substr(4);

const decodedData = base45.decode(greenpassBody);

const output = pako.inflate(decodedData);

const results = cbor.decodeAllSync(output);
[headers1, headers2, cbor_data, signature] = results[0].value;
const greenpassData = cbor.decodeAllSync(cbor_data);
console.log("greenpassData",greenpassData);
console.log(JSON.stringify(greenpassData[0].get(-260).get(1), null, 2));
