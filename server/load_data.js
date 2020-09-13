const rest = require("./rest");
const connection = require("./connection");
let NumberOfParents;

// Get data from Munch API and upload to elasticsearch instance.
async function loadData() {
  // Get the health of the connection
  let health = await connection.checkConnection();

  // Check the status of the connection
  if (health.statusCode === 200) {
    // Delete index
    await connection.deleteIndex().catch((err) => {
      console.log(err);
    });
    // Create Index
    await connection.createIndex().catch((err) => {
      console.log(err);
    });
    // If index exists
    if (await connection.indexExists()) {
      const parents = await rest.getRequest(rest.FlaskUrl + "/N");
      // If parents has the property containing the files
      if (parents.hasOwnProperty("data")) {
        //Retrieve the parent list
        let parrentArray = parents.data;

        // Get amount of parents
        NumberOfParents = parrentArray.length;
        console.log("Number of parents to upload: " + NumberOfParents);
        // Each function call to upload a JSON object to the index
        // delayed by 50ms
        parrentArray.forEach(delayedFunctionLoop(uploadParentToES, 50));
      }
    }
  } else {
    console.log("The connection failed");
  }
}

// Upload a parent to Elasticsearch
async function uploadParentToES(parent, index) {
  console.log(
    "Uploading " +
      parent +
      " to ES index " +
      (parseInt(index) + 1) +
      " / " +
      NumberOfParents
  );
  // Get reponse from Munch API for a specific parent
  const body = await rest.getRequest(rest.FlaskUrl + "/N/" + parent);
  // Add JSON object to Index
  await connection.addToIndex(body);
}

// Function that delays the function calls
const delayedFunctionLoop = (func, delay) => {
  return async (parent, index) => {
    setTimeout(() => {
      func(parent, index);
    }, index * delay);
  };
};

// Execute Load Data
loadData();
