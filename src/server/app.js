const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config({ path: "../../env/.env" });
const DiscoveryV2 = require("ibm-watson/discovery/v2");
const { IamAuthenticator } = require("ibm-watson/auth");
const bodyParser = require("body-parser");
const expressSanitizer = require("express-sanitizer");

app.use(cors());
app.use(
  bodyParser.json({
    type: "application/json",
  })
);

const version = process.env.VERSION;
const projectId = process.env.PROJECTID;

app.use(expressSanitizer());

app.post("/car-insurance", (req, res) => {
  console.log("Request is made with input: ", req.body.data);

  const sanitizedString = req.sanitize(req.body.data);

  const discovery = new DiscoveryV2({
    version: version,
    authenticator: new IamAuthenticator({
      apikey: process.env.APIkey,
    }),
    serviceUrl: process.env.URL,
  });

  const parameters = {
    naturalLanguageQuery: `${sanitizedString}`,
    projectId: `${projectId}`,
    count: 3,
  };

  discovery
    .query(parameters)
    .then((response) => res.send({ sanitizedString: response.result.results }))
    .catch((err) => {
      console.log("error:", err);
    });
});

app.listen(3001, () => console.log("Port is running on 3001"));
