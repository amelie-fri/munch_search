// This file connects the munch application to the Elasticsearch instance
// Functions regarding Elasticsearch are located here

// Elasticsearch variables for this project
const { Client } = require("@elastic/elasticsearch");
const index = "collection";
const port = 9200;
const host = process.env.ES_HOST || "localhost";
const url = "http://" + host + ":" + port;
const client = new Client({ node: url });

// Check the status of the Elasticsearch connection
async function checkConnection() {
  let isConnected = false;
  while (!isConnected) {
    console.log("Connecting to ES");
    try {
      const health = await client.cluster.health({});
      // console.log(health.body);
      // only log the body part :)
      isConnected = true;
      return health;
    } catch (err) {
      console.log("Connection Failed, Retrying...", err);
    }
  }
}

// Delete an existing index
async function deleteIndex() {
  // Check if the index exists
  if (await indexExists()) {
    let resp = await client.indices.delete({ index }).catch((err) => {
      console.log(err);
    });
    console.log("Deleted Index: " + index);
  } else {
    console.log("Index: " + index + " does not exist");
  }
}

// Create an index
async function createIndex() {
  // Check that the index does not exist yet!
  if (!(await indexExists())) {
    await client.indices.create({ index });
    console.log("Created index: " + index);
  } else {
    console.log("Index already exists.");
  }
}

// Adds a JSON document to an index
async function addToIndex(body) {
  await client
    .index({
      index,
      body,
    })
    .catch((err) => {
      console.log("Error during addToIndex for file: " + JSON.stringify(body));
      console.log(err);
    });
}

// Refresh an index
async function refreshIndex() {
  await client.indices.refresh({ index });
}

// Check if an index exists
async function indexExists() {
  const { body } = await client.indices.exists({ index });
  return body;
}

// Module exports
module.exports = {
  client,
  index,
  checkConnection,
  deleteIndex,
  createIndex,
  indexExists,
  addToIndex,
  refreshIndex,
};
