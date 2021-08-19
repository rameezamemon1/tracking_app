const base45 = require("base45");
const cbor = require("cbor");
const fs = require("fs");
const jpeg = require("jpeg-js");
const jsQR = require("jsqr");
const pako = require("pako");
const axios = require("axios");

exports.greenpassDecode = (decodedGreenpass) => {
  axios
    .post("http://localhost:6000", {
      data: decodedGreenpass,
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};
