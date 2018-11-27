'use strict';

var Backbone = require('backbone'),
  Marionette = require('backbone.marionette'),
  _ = require('lodash'),
  Router = require('../../routing/router'),
  TaxonListItem = require('../taxon_list/taxon_list_item.view'),
  User = require('../../profile/user.model.js'),
  Header = require('../../header/header'),
  Help = require('../../main/help.model'),
  Footer = require('../../footer/footer.view'),
  taxonCollection = require('../../taxons/taxons.model');

module.exports = Marionette.CompositeView.extend({
  template: require('./mission_home.tpl.html'),
  childView: TaxonListItem,
  childViewContainer: '.item',
  childViewOptions: function() {
    return {
      mission_id: this.model.id
    };
   },
  events: {
    'click .btn-accept': 'onAcceptClick',
    'click .btn-back': 'onBackClick'
  },

  attributes: function() {
    var user = User.getCurrent();
    var classNames = 'page page-mission_home';
    if (user.hasCompletedMission(this.model))
      classNames += ' is-complete';
    else if (user.hasAcceptedMission(this.model))
      classNames += ' is-accept';
    return {
      'class': classNames
    };
  },

  initialize: function() {
    var self = this;
    var user = User.getCurrent();

    this.header = {
      title: this.model.get('title'),
      buttons: {
        left: ['back']
      }
    };

    this.listenTo(user, 'change:acceptedMissions', this.onAcceptChange);

    this.listenTo(Footer.getInstance(), 'btn:clue:click', function(e) {
      e.preventDefault();
      Router.getInstance().navigate('clue?missionId='+self.model.get('id'), {trigger:true});
    });

    var queryHash = window.location.hash;
    var params = _.parseQueryHash(queryHash);

    var currentUser = User.getCurrent();
    var helps = Help.collection.getInstance();

    helps.someHelp(params);

  },

  serializeData: function() {
    return {
      mission: this.model.toJSON()
    };
  },

  onAcceptClick: function(e) {
    var user = User.getCurrent();
    user.toggleAcceptedMission(this.model);
    user.save();
  },

  onAcceptChange: function() {
    var user = User.getCurrent();
    if (user.hasAcceptedMission(this.model))
      this.$el.addClass('is-accept');
    else
      this.$el.removeClass('is-accept');
  },

  onBackClick: function() {
    Router.getInstance().back();
  },

  onDestroy: function() {
    var self = this;
  }
});