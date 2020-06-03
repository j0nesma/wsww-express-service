const Joi = require("joi");
const db = require("./connections");

const schema = Joi.object().keys({
  username: Joi.string().required(),
  title: Joi.string().max(500).required(),
});

const films = db.get("films");

function getAll() {
  return films.find();
}

function get(user) {
  return films.findOne({ username: user });
}

function create(film) {
  const result = Joi.validate(film, schema);
  if (result.error == null) {
    film.created = new Date();
    return films.insert(film);
  } else {
    return Promise.reject(result.error);
  }
}

function patch(user, film) {
  if(user !== film.user){
    throw new Error("Usernames do not match in url and body");
  }
  const result = Joi.validate(film, schema);
  if (result.error == null) {
    return films.findOneAndUpdate({ username: user }, { $set: film });
  } else {
    return Promise.reject(result.error);
  }
}

module.exports = {
  create,
  getAll,
  get,
  patch,
};
