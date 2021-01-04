const search = require("./search");
const fetch = require("node-fetch");
const express = require("express");
const app = express();

// Express.js Node API server - Proxy Server

// Header definition - taking care of CORS
// * instead of domain
app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Error Code
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// ENDPOINT - Test ------------------------------------
app.get("/test", (req, res, next) => {
  res.send("Hei from the Express.js Node server for the Munch Project.");
});

// ENPOINT for the TEXT part -----------------------------------
// URL example: localhost:3000/search/?term=sun
app.get("/search", async (request, response, next) => {
  // similar to const term = request.query.term
  const { term } = request.query;

  console.log("Searching for: " + term);
  // Check: does a query term exist and is it a string as well?
  if (term != null && typeof term === "string") {
    // Fetching from ES
    response.json(await search.queryTerm(term));
  } else {
    response.status(500).send("Please provide a query term.");
  }
});

// ENDPOINTS for the Visual Arts Part ---------------------------
// Malerier Endpoint
app.get("/munch/malerier/:tekst", async (request, response) => {
  const tekst = request.params.tekst;
  // Fetch from munchmuseet.no
  const json = await munchEndpoints(tekst, "5026-Malerier");
  response.json(json);
});
// Grafikk Endpoint
app.get("/munch/grafikk/:tekst", async (request, response) => {
  const tekst = request.params.tekst;
  // Fetch from munchmuseet.no
  const json = await munchEndpoints(tekst, "5011-Grafikk");
  console.log(json);
  response.json(json);
});
// Tegninger Endpoint
app.get("/munch/tegninger/:tekst", async (request, response) => {
  const tekst = request.params.tekst;
  // Fetch from munchmuseet.no
  const json = await munchEndpoints(tekst, "5020-Tegninger");
  response.json(json);
});
// Skulpturer Endpoint
app.get("/munch/skulpturer/:tekst", async (request, response) => {
  const tekst = request.params.tekst;
  // Fetch from munchmuseet.no
  const json = await munchEndpoints(tekst, "5018-Skulpturer");
  response.json(json);
});
// Fotografi Endpoint
app.get("/munch/fotografi/:tekst", async (request, response) => {
  const tekst = request.params.tekst;
  // Fetch from munchmuseet.no
  const json = await munchEndpoints(tekst, "5010-Fotografi");
  response.json(json);
});
// Dokumentarfoto Endpoint
app.get("/munch/dokumentarfoto/:tekst", async (request, response) => {
  const tekst = request.params.tekst;
  // Fetch from munchmuseet.no
  const json = await munchEndpoints(tekst, "5005-Dokumentarfoto");
  response.json(json);
});

// Stenersensamlingene - will be added when a filter is created
// only artwork by Edvard Munch

// Function for the Endpoints (Visual Part) ---------------------------------------------------------------
async function munchEndpoints(tekst, type) {
  let headers = {
    Accept: "application/vnd.fotoware.assetlist+json",
  };
  // Decide whether to search through the English titles, or the Norwegian
  // Title (English)
  const api_url = `https://foto.munchmuseet.no/fotoweb/archives/${type}/?105=${tekst}`;
  // Search all available fields - q
  // const api_url = `https://foto.munchmuseet.no/fotoweb/archives/${type}/?q=${tekst}`;
  // Tittel (Norsk)
  // const api_url = `https://foto.munchmuseet.no/fotoweb/archives/${type}/?5=${tekst}`;
  const fetch_response = await fetch(api_url, {
    method: "GET",
    headers: headers,
  });
  const json = await fetch_response.json();
  return json;
}
// ------------------------------------------------------------------------------------------

// Express App Listen
app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
