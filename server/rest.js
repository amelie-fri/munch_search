// axios - javascript library for making http requests
// from node.js backend to Munch Api
// similar to fetch
const axios = require("axios");
const port = 5000;
const host = process.env.FLASK_HOST || "localhost";
// URL for GET request
const FlaskUrl = "http://" + host + ":" + port;

// Get data from Munch API
async function getRequest(url) {
  let response = await axios.get(url).catch((error) => {
    console.error(error);
  });
  return response.data;
}

module.exports = { getRequest, FlaskUrl };
