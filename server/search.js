// Function for querying the index
const { client, index } = require("./connection");

// Query ES index for the provided term
function queryTerm(term) {
  const body = {
    query: {
      // query defined as match query
      match: {
        // queries the text field
        text: {
          // definition query parameter
          query: term,
          // query operator defined as and operator
          operator: "and",
          // Test fuzziness paramter - working
          // fuzziness: "auto",
        },
      },
    },
    // hightlight parameter for the presentation of the results
    // shows part of the text containing the query term
    highlight: { fields: { text: {} } },
  };
  // return response from the ES client search API
  return client.search({ index, body });
}

module.exports = {
  queryTerm,
};
