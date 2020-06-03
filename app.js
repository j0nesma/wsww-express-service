const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const films = require("./db/films");

const app = express();
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "WSWW API",
      description: "This is a API for the What Shall We Watch Webpage",
      contact: {
        name: "Matthew Jones",
      },
      servers: ["http://localhost:4000"],
    },
  },
  apis: ["app.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.json({
    message: "Behold The MEVN Stack!",
  });
});

app.get("/films", (req, res) => {
  films.getAll().then((films) => {
    res.json(films);
  });
});
/**
 * @swagger
 * /films:
 *  post:
 *    description: this create a new document
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500': 
 *        description: Internal server error
 */
app.post("/films", (req, res) => {
  films
    .create(req.body)
    .then((film) => {
      res.json(film);
    })
    .catch((error) => {
      res.status(500);
      res.json(error);
    });
});

app.get("/:user/films", (req, res) => {
  films.get(req.params.user).then((films) => {
    res.json(films);
  });
});

app.patch("/:user/films", (req, res) => {
  films
    .patch(req.params.user, req.body)
    .then((films) => {
      res.json(films);
    })
    .catch((error) => {
      res.status(500);
      res.json(error);
    });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
