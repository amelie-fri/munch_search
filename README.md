# Munch Search

munch_search was created as a master's thesis project, in order to explore the digital collection of the MUNCH museum in Oslo. 
munch_search is a prototype for a research and exploration tool. The explored data was kindly provided by the MUNCH museum.

## Getting Started

To get started, please get a copy of this repository on your local drive and make sure the necessary software is installed (see prerequisites).

Make sure that the Docker image `munch_api` is built and available before starting the containers for this project.  
Follow the instructions from the following project: [Munch API](https://github.com/amelie-fri/muAPI)

### `docker-compose up --build`

This command builds, downloads and starts up the services mentioned in the `docker-compose.yml` file


### `docker exec mp-api "node" "server/load_data.js"`

Executes the `load_data.js` file inside the `mp-api` container.
`load_data.js` has to be executed once in order to build the elasticsearch index. 
The data is stored in a Docker volume and will be perserved when the containers are stopped.


### [munch_search](http://localhost:8080)

After the index is built, you are free to explore the collection.

The front end of the application is available on:  
`http://localhost:8080`


### Additional instances
The additional server side instances

#### Elasticsearch

The ElasticSearch instance is available on:  
`http://localhost:9200`

#### Node.js

The Node Server is available on:  
`http://localhost:3000`

#### Munch API

The Munch API is available on:  
`http://localhost:5000`

#### Kibana

In addition, a kibana instance is connected to the elasticsearch instance and is available on:  
`http://localhost:5601`


### Prerequisites

The installation of Docker is necessary in order to use the application. Docker is available here: 
https://www.docker.com/get-started

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

**Amelie Fritsch** - https://github.com/amelie-fri

Project Link: https://github.com/amelie-fri/munch_search

## Images provided by the MUNCH that were used for the background image of the application

--> downloaded from: https://foto.munchmuseet.no/fotoweb/
Rødt hus og grantrær, Edvard Munch, 1927, Fotograf: Sidsel de Jong
Kvinne med peoner, Edvard Munch, 1926, Fotograf: Sidsel de Jong
Under kastanjetreet, Edvard Munch, 1937, Fotograf: Sidsel de Jong
Skog i snø, Edvard Munch, 1912, Fotograf: Richard Jeffries
Kålåker, Edvard Munch, 1915, Fotograf: Ove Kvavik

## Acknowledgments

- [MUNCH](https://www.munchmuseet.no/en/)
- [Elastic](https://www.elastic.co/)
- [Elasticsearch Node.js client](https://github.com/elastic/elasticsearch-js)
- [Docker](https://www.docker.com/)
- Patrick Triest [BUILDING A FULL-TEXT SEARCH APP USING DOCKER AND ELASTICSEARCH](https://blog.patricktriest.com/text-search-docker-elasticsearch/)
- [Axios](https://github.com/axios/axios)
- [Express](https://expressjs.com/)
- [Node](https://nodejs.org/en/)
- [Node-fetch](https://www.npmjs.com/package/node-fetch)
