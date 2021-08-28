const base45 = require("base45");
const cbor = require("cbor");
const pako = require("pako");

export const getQr = (decodedGreenpass) => {
  const greenpassBody = decodedGreenpass.substr(4);
  const decodedData = base45.decode(greenpassBody);
  const output = pako.inflate(decodedData);
  const results = cbor.decodeAllSync(output);
  const [headers1, headers2, cbor_data, signature] = results[0].value;
  const greenpassData = cbor.decodeAllSync(cbor_data);
  const _greenpassData = JSON.stringify(
    greenpassData[0].get(-260).get(1),
    null,
    2
  );
  return _greenpassData;
};
