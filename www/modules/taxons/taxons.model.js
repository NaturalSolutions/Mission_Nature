'use strict';
var Backbone = require('backbone');

var Model = Backbone.Model.extend({
  defaults: {
    id: '',
    cd_nom: '',
    title: '',
    family: '',
    url: '',
    description: '',
    caracteristic: '',
    environments: '',
    environment_description: '',
    not_confuse: '',
    sources: ''
  },/*
  getEnvironment: function() {

  }*/
});

var Collection = Backbone.Collection.extend({
  model: Model
});

var collectionInstance = null;

module.exports = {
  Model: Model,
  collection: {
    getClass: function() {
      return Collection;
    },
    getInstance: function() {
      if (!collectionInstance)
          collectionInstance = new Collection();
      return collectionInstance;
    }
  }
};
