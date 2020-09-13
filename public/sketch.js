// Front end
let serverURL = "http://localhost:3000/";
let pieChart = null;
let timelineChart = null;

// Obtaining data from the Munch Museum's API and preparing the data for creating the charts
async function getDataVisual() {
  // Get input from the user
  let input = document.getElementById("site-search").value;
  // array with objects for each category of art
  // array contains url for the GET request to the museums's API
  // the reponse is stored in json
  // the prepared data will be stored in data
  const artDataArray = [
    {
      type: "Paintings",
      background: "rgba(100, 149, 237, 0.5)",
      border: "rgba(100, 149, 237, 1)",
      url: serverURL + `munch/malerier/${input}`,
      json: {},
      data: [],
    },
    {
      type: "Graphics",
      background: "rgba(255, 209, 26, 0.5)",
      border: "rgba(255, 209, 26, 1)",
      url: serverURL + `munch/grafikk/${input}`,
      json: {},
      data: [],
    },
    {
      type: "Drawings",
      background: "rgba(255, 194, 180, 0.5)",
      border: "rgba(255, 194, 180, 1)",
      url: serverURL + `munch/tegninger/${input}`,
      json: {},
      data: [],
    },
    {
      type: "Sculptures",
      background: "rgba(179, 255, 179, 0.5)",
      border: "rgba(179, 255, 179, 1)",
      url: serverURL + `munch/skulpturer/${input}`,
      json: {},
      data: [],
    },
    {
      type: "Photopraphies",
      background: "rgba(0, 196, 154, 0.5)",
      border: "rgba(0, 196, 154, 1)",
      url: serverURL + `munch/fotografi/${input}`,
      json: {},
      data: [],
    },
    {
      type: "Documentary Photopraphies",
      background: "rgba(255, 102 , 0, 0.5)",
      border: "rgba(255, 102 , 0, 1)",
      url: serverURL + `munch/dokumentarfoto/${input}`,
      json: {},
      data: [],
    },
  ];

  // if there is no input, return an empty data array
  if (input.length === 0) {
    return artDataArray;
  }

  // obtaining the data from the API
  // for loop iterating over the artDataArray
  // for each index position, (each category of art) a fetch request is issued with the respective url
  for (i in artDataArray) {
    console.log("Getting data from: " + artDataArray[i].url);
    let json = await fetch(artDataArray[i].url)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
    // the JSON from the response is stored in the json object of each art collection
    console.log("hits: " + json.data.length);
    artDataArray[i].json = json;
  }
  // Preparing the data requierd for making the Timeline Chart
  // iterating over all elemets in the artDataArray and each work of art inside the data array
  for (i in artDataArray) {
    let xArtworks = [];
    let xtitle = [];

    // For each hit
    for (artwork of artDataArray[i].json.data) {
      // Check if artwork has "metadata" property
      if (artwork.hasOwnProperty("metadata")) {
        //Get title from data
        let { metadata } = artwork;
        let value = "NoTitle";
        // Check for "105" property
        if (metadata.hasOwnProperty("105")) {
          value = metadata[105].value;
          // if not, check "5"
        } else if (metadata.hasOwnProperty("5")) {
          value = metadata[5].value;
        }
        // Check if value exists
        if (value != null) {
          let titleString = value.toString();
          if (titleString != null) {
            xtitle.push(titleString);
          } else {
            xtitle.push("");
          }
        } else {
          xtitle.push("");
        }
      }
      // Get year number from data
      // check if more than one year number is offered e.g. 1890-92
      // pick the first 4 digits as year, push them to array
      if (artwork.metadata[203].value.length > 4) {
        let str = artwork.metadata[203].value.toString();
        let re = /^\d{4}/;
        let found = str.match(re);
        if (found != null) {
          xArtworks.push(parseInt(found[0]));
        } else {
          xArtworks.push(null);
        }
        // also push the 4 digit years to the array
      } else if (artwork.metadata[203].value.length == 4) {
        xArtworks.push(parseInt(artwork.metadata[203].value));
      } else {
        xArtworks.push(null);
      }
      // -----------------------------------------------------------------------------------------------------
      // ---------------------------------------- LIST -------------------------------------------------------
      // for each artwork create an element in list element
      // displaying a mini image, the title, and the year number
      const root = document.createElement("div");
      // added box here :)
      const box = document.createElement("div");
      // added class box to the element
      box.setAttribute("class", "box");
      const titletitle = document.createElement("div");
      const datedate = document.createElement("div");
      const kunstner = document.createElement("div");
      const photographer = document.createElement("div");
      const imageimage = document.createElement("img");

      if (artwork.hasOwnProperty("metadata")) {
        let { metadata } = artwork;
        // retrieve title
        if (metadata.hasOwnProperty("105")) {
          titletitle.textContent = `Title: ${metadata[105].value.toString()}`;
        } else {
          titletitle.textContent = `Title: `;
        }
        // retrieve date
        if (metadata.hasOwnProperty("203")) {
          datedate.textContent = `Date : ${metadata[203].value.toString()}`;
        } else {
          datedate.textContent = `Date : `;
        }
        // retrieve artist
        if (metadata.hasOwnProperty("110")) {
          kunstner.textContent = `Artist : ${metadata[110].value.toString()}`;
        } else {
          kunstner.textContent = `Artist : `;
        }
        // for credit: retrieve photographer
        if (metadata.hasOwnProperty("80")) {
          photographer.textContent = `Photographer : ${artwork.metadata[80].value[0].toString()}`;
        } else {
          photographer.textContent = `Photographer : `;
        }
      }
      // image for the miniature preview
      if (artwork.hasOwnProperty("previews")) {
        imageimage.src = `https://foto.munchmuseet.no${artwork.previews[0].href}`;
      }

      // Add all the elements to the box element and then add box to root
      box.appendChild(titletitle);
      box.appendChild(datedate);
      box.appendChild(kunstner);
      box.appendChild(photographer);
      box.appendChild(imageimage);
      root.appendChild(box);
      // append root to the list elememt in index.html
      document.getElementById("list").appendChild(root);
    }
    // --------------------------------------------------------------------------------------------------
    // ---------------------- Create Y Part of data -----------------------------------------------------
    // ---------------------- Creating an array with all titles -----------------------------------------
    // creating an array with the year numbers that occured
    let uniqueYears = Array.from(new Set(xArtworks)).sort();

    let data = [];
    let title = [];
    // if the arrays have the same lentgh, each title should end up in the same index position
    // as the corresponding work of art
    if (xtitle.length != xArtworks.length) {
      throw "Error, xtitle is not of same length as xArtWorks";
    }
    // creating the y values, that are counted up
    // iterating over the unique years and the years in the xArtworks array
    // the first time a uniqueYear is found in the xArtworks array y=1
    // every time the uniqueYear occurs again the y value counts up by 1
    // the title is pushed as well
    for (let x of uniqueYears) {
      // start at 1
      let y = 1;
      for (let i in xArtworks) {
        if (x === xArtworks[i]) {
          // the object conatining e.g. {1900, 4}
          data.push({ x, y });
          title.push(xtitle[i]);
          y++;
        }
      }
    }
    // For the Pie Chart: determining the number of works of art for a query term
    // length array = how many were found
    let numberArtworks = data.length;
    // the object stored in the data array containing an array of objects and two additional arrays
    artDataArray[i].data = { data, title, numberArtworks };
  }

  return artDataArray;
}
// count how often a value occurs in a certain array
function getOccurrence(array, value) {
  let count = 0;
  array.forEach((v) => v === value && count++);
  return count;
}

async function getDataText() {
  // Get input from the user
  let inputtext = document.getElementById("search-text").value.toString();

  // Array with the url for request to ES, the received data and prepared data for the charts :)
  const textDataObject = {
    type: "Texts",
    background: "rgba(153, 0, 255, 0.5)",
    border: "rgba(153, 0, 255, 1)",
    url: "http://localhost:3000/search?term=" + inputtext,
    json: {},
    data: [],
  };
  console.log("Getting data from: " + textDataObject.url);
  // API call to backend to make a request to ES with query term = user input
  // reponse in json is stored in the prepared json object
  let json = await fetch(textDataObject.url)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });

  // store json in textdataObject
  textDataObject.json = json;

  // Local variables
  let types = [];
  let xTextDates = [];

  console.log("hits: " + textDataObject.json.body.hits.hits.length);
  // For each hit - each text
  for (written of textDataObject.json.body.hits.hits) {
    // Get title from data (what is used as the title, is acutally the text type)
    if (written._source.type_text != null) {
      let type = written._source.type_text.toString();
      // If no type exsits, it is pushed as an empty string
      if (type == null) {
        type = "";
      }
      types.push(type);
    } else {
      console.log("Error, type does not exist");
    }

    // Get date from data
    // if no date exists, the value null is pushed
    if (written._source.date.when[0] == null) {
      xTextDates.push(null);
      // also if the date equals undefined, the value null is pushed
    } else if (written._source.date.when[0] == undefined) {
      xTextDates.push(null);
      // if the date is neither null nor undefined then ...
    } else if (
      written._source.date.when[0] != null ||
      written._source.date.when[0] != undefined
    ) {
      // the first 4 digits in the string are matched and pushed to the xTextDate Array
      // creating the x values for the data object {x,y} for the timeline chart
      let str = written._source.date.when[0].toString();
      let re = /^\d{4}/;
      let found = str.match(re);
      // Found
      if (found != null) {
        xTextDates.push(parseInt(found[0]));
      }
      // }
    } else {
      console.log("No date :)");
    }

    // -----------------------------------------------------------------------------------------------------
    // ---------------------------------------- LIST -------------------------------------------------------
    // for each text create an element in list element
    // displaying a text snippet, the title/type
    const root2 = document.createElement("div");
    // added box here
    const box2 = document.createElement("div");
    // added class box2 to the element
    box2.setAttribute("class", "box2");
    const titletext = document.createElement("div");
    const texthighlight = document.createElement("div");
    // retrieve the title
    titletext.textContent = `Title: ${written._source.title.toString()}`;
    // retireve highlight text
    texthighlight.innerHTML = `Highlight: ${written.highlight.text[0].toString()}`;

    // add all the elements to element box and then box to root
    box2.appendChild(titletext);
    box2.appendChild(texthighlight);
    root2.appendChild(box2);
    // append root to the list2 elememt prepared index.html
    document.getElementById("list2").appendChild(root2);
  }
  // -----------------------------------------------------------------------------------------
  // Get unique types
  let uniqueTypes = Array.from(new Set(types)).sort();
  // array: how many times does each type of text occur
  let textData = [];
  // all the possibly expected types
  staticTypes = [
    "Brev",
    "Brevutkast",
    "Notat",
    "Blandet",
    "Varia",
    "Bildeliste",
  ];
  // For each element of static types, how often did the static type occur in the types array
  for (let i = 0; i < staticTypes.length; i++) {
    textData[i] = getOccurrence(types, staticTypes[i]);
  }
  // if a unique type is not part of staticTypes, it occurs less than once
  // that means, the type was not expected, still exists and will be added under the type unknown :)
  let unknown = 0;
  for (let i = 0; i < uniqueTypes.length; i++) {
    if (getOccurrence(staticTypes, uniqueTypes[i]) < 1) {
      unknown++;
      console.log("Unknown type:" + uniqueTypes[i]);
    }
  }
  staticTypes.push("unknown");
  textData.push(unknown);

  // Check that xTextDates has the same length as type
  // Esnuring that the index of the array for dates and
  // the array for types is the same for the same piece of art
  if (xTextDates.length != types.length) {
    throw "Error, xdates are not the same size as types";
  }

  // Create Y Part - data objects for the timeline
  // same approach as with visual arts data
  let uniqueYears = Array.from(new Set(xTextDates)).sort();

  let data = [];
  title = [];

  for (let x of uniqueYears) {
    // start at 1
    let y = 1;
    for (let i in xTextDates) {
      if (x === xTextDates[i]) {
        data.push({ x, y });
        title.push(types[i]);
        y++;
      }
    }
  }

  // Adding the object and arrays to the textDataObject inside the data array
  textDataObject.data = { textData, data, types, staticTypes, title };
  // return json;
  return textDataObject;
}

// Assembles the datasest that is pushed to the datasets parameter of the timeline vis.
function addDataTimeline(chart, dataElement) {
  dataset = {
    label: dataElement.type,
    data: dataElement.data.data,
    title: dataElement.data.title,
    pointRadius: 7,
    backgroundColor: dataElement.background,
    borderColor: dataElement.border,
  };
  chart.data.datasets.push(dataset);
  chart.update();
}

// assembles the dataset pushed to the datasets parameter of the doughnut vis
function addDataPie(chart, dataArray) {
  dataset = {
    data: dataArray,
    title: "hjhjhjh",
    backgroundColor: [
      "#ffc200",
      "#ffce32",
      "#ffda66",
      "#ffe07f",
      "#ffecb2",
      "#fff8e5",
      "#777777",
      "#92f28e",
      "#a7f4a4",
      "#bdf7bb",
      "#d3f9d1",
      "#e9fce8",
      "#ffffff",
    ],
  };
  chart.data.datasets.push(dataset);
  chart.update();
}

// ******************************************************************************************

async function updateCharts() {
  // Data from the Munch Museum's API
  let completeData = await getDataVisual();

  // Data from ES
  let textDataPart = await getDataText();

  // ensuring that the datasets keys are initially equal to an empty array
  timelineChart.data.datasets = [];
  pieChart.data.datasets = [];
  // the object in textDataPart is pushed to the completeData array
  completeData.push(textDataPart);

  // items: Paintings, Graphics, Drawings, Sculptures, Photographies, Documentary Photographies, Texts
  // pushing dataset to timeline chart
  // calling update()
  for (let item of completeData) {
    addDataTimeline(timelineChart, item);
  }

  let occurencesArtTypes = [];
  // for each type of art in completeData push how many were found
  for (let item of completeData) {
    occurencesArtTypes.push(item.data.numberArtworks);
  }
  // combining the occurences of text types with the occurences of art types
  let occurences = textDataPart.data.textData.concat(occurencesArtTypes);
  // pushing dataset to doughnut chart
  // calling update()
  addDataPie(pieChart, occurences);
}
// ******************************************************************************************
// ----------------------------------------- TIMELINE CHART ---------------------------------
async function makeTimelineChart() {
  let ctx = document.getElementById("Chart").getContext("2d");
  // downsizing fixed
  ctx.canvas.width = 800;
  ctx.canvas.height = 300;
  timelineChart = new Chart(ctx, {
    type: "scatter",
    data: {
      // parameter waiting for prepared data
      datasets: [],
    },

    // ************* CONFIGURATION ******************
    options: {
      title: {
        display: true,
        text: "Munch Timeline",
        fontSize: 25,
      },
      legend: {
        position: "right",
        align: "center",
      },
      // moves the whole chart
      layout: {
        padding: {
          left: 50,
          right: 0,
          bottom: 0,
          top: 50,
        },
      },
      tooltips: {
        callbacks: {
          labelTextColor: function (tooltipItem, chart) {
            return "#FFC0CB";
          },
          label: function (tooltipItems, data) {
            return tooltipItems.xLabel;
          },

          // include the title of an item in the label
          title: function (tooltipItem, data) {
            // get data element
            let dataSetElement = data.datasets[tooltipItem[0].datasetIndex];
            // get title using the index from the datasetIndex
            let label = dataSetElement.title[tooltipItem[0].index];
            return label;
          },
        },
      },
      responsive: false,
      scales: {
        xAxes: [
          {
            ticks: {
              min: 1860,
              max: 1950,
            },
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            display: false,

            gridLines: {
              display: false,
              ticks: {},
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}
// ------------------------------------------------------------------------------------------
// ----------------------------------------- PIE CHART --------------------------------------

async function makePieChart() {
  let ctx2 = document.getElementById("Chart2").getContext("2d");
  pieChart = new Chart(ctx2, {
    type: "doughnut",
    data: {
      datasets: [],
      // labels appear in the legend and in the tooltips when hovering over the different parts
      // remain hardcoded
      labels: [
        "Brev",
        "Brevutkast",
        "Notat",
        "Blandet",
        "Varia",
        "Bildeliste",
        "unknown",
        "Paintings",
        "Graphics",
        "Drawings",
        "Sculptures",
        "Photographies",
        "Documentary Photographies",
      ],
    },

    // ************* CONFIGURATION ******************
    options: {
      title: {
        display: true,
        text: "Munch Doughnut",
        fontSize: 25,
      },
      legend: {
        position: "right",
        align: "center",
      },
      // moves the whole chart
      layout: {
        padding: {
          left: 50,
          right: 0,
          bottom: 0,
          top: 50,
        },
      },
    },
  });
}
// ------------------------------------------------------------------------------------------
// Initialise the Timeline Chart
makeTimelineChart();
// Initialise the Pie Chart
makePieChart();
