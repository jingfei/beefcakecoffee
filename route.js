var path = require('path');
var url = require('url');

route = [
  {
    data: {
      "title": "猛男咖啡 BeefcakeCoffee"
    },
    "partials": './partials.js',
    "layout":  "./view/index.hbs",
    "filename": "./docs/index.html"
  },
  {
    data: {
      "title": "猛男咖啡 BeefcakeCoffee"
    },
    "partials": './partials.js',
    "layout":  "./view/home/index.hbs",
    "filename": "./docs/home.html"
  }
];

module.exports = route;
