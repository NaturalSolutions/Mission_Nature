'use strict';
var Backbone = require('backbone'),
$ = require('jquery'),
  Marionette = require('backbone.marionette'),
  _ = require('lodash'),
  Observation = require('../../observation/observation.model'),
  Router = require('../../routing/router'),
  User = require('../../profile/user.model.js'),
  Header = require('../../header/header'),
  Help = require('../../main/help.model'),
  Footer = require('../../footer/footer.view');

module.exports = Marionette.LayoutView.extend({
  template: require('./mission_sheet.tpl.html'),
  events: {
    'click .btn-accept': 'onAcceptClick',
    'click .btn-sheet': 'openWindow',
    'click .btn-back': 'onBackClick'
  },
  attributes: function () {
    var user = User.getCurrent();
    var classNames = 'page page-mission_sheet';
    if (user.hasCompletedMission(this.model))
      classNames += ' is-complete';
    else if (user.hasAcceptedMission(this.model))
      classNames += ' is-accept';
    return {
      'class': classNames
    };
  },

  regions: {
    observations: '.observations'
  },

  initialize: function () {
    var self = this;
    var user = User.getCurrent();

    this.header = {
      title: this.model.get('title'),
      buttons: {
        left: ['back']
      }
    };

    this.listenTo(user, 'change:acceptedMissions', this.onAcceptChange);
    this.listenTo(Observation.collection.getInstance(), 'add', function (observation) {
      observation.set({
        'missionId': self.model.get('id'),
        'cd_nom': self.model.get('cd_nom')
      });
      observation.save();
    });

    this.listenTo(Footer.getInstance(), 'btn:clue:click', function (e) {
      e.preventDefault();
      Router.getInstance().navigate('clue?missionId=' + self.model.get('id'), {
        trigger: true
      });
    });

    var queryHash = "missionsheet";
    var params = _.parseQueryHash(queryHash);

    var currentUser = User.getCurrent();
    var helps = Help.collection.getInstance();

    helps.someHelp(params);

  },

  openWindow: function (ev) {
    var toOpen;
    if (ev.currentTarget.id === "url")
      toOpen = this.model.get('url');
    else
      toOpen = ev.currentTarget.innerHTML;
    window.open(toOpen, '_blank');
  },

  onRender: function () {
    var user = User.getCurrent();
    var observations = Observation.collection.getInstance();
    observations = observations.where({
      userId: user.get('id'),
      missionId: this.model.get('id')
    });
    var ObservationsView = require('../../observation/observation_list.view');
    this.showChildView('observations', new ObservationsView({
      collection: new Backbone.Collection(observations)
    }));

//   console.log(this.model.get('sources'));

    switch (this.model.get('environment')) {
      case "affleurements rocheux":
        this.$el.find('.badge').addClass("grey");
        break;
      case 'forêts de conifères':
        this.$el.find('.badge').addClass("green");
        break;
      case "forêts de feuillus":
        this.$el.find('.badge').addClass("green-light");
        break;
      case "fourrés et boisements":
        this.$el.find('.badge').addClass("yellow");
        break;
      case "jardins et parcs":
        this.$el.find('.badge').addClass("pink");
        break;
      case "landes sèches":
        this.$el.find('.badge').addClass("orange");
        break;
      case "prairies":
        this.$el.find('.badge').addClass("grey-light");
        break;
      case "rivières, mares et étangs":
        this.$el.find('.badge').addClass("blue");
        break;
      case "vergers":
        this.$el.find('.badge').addClass("yellow-light");
        break;
      case "villages et zones urbaines":
        this.$el.find('.badge').addClass("orange-light");
        break;
      case "zones humides":
        this.$el.find('.badge').addClass("blue-light");
        break;
      default:
        console.log("wrong environment");
        break;
    }
  },

  serializeData: function () {
    return {
      taxon: this.model.toJSON()
    };
  },

  onAcceptClick: function (e) {
    var user = User.getCurrent();
    user.toggleAcceptedMission(this.model);
    user.save();
  },

  onAcceptChange: function () {
    var user = User.getCurrent();
    if (user.hasAcceptedMission(this.model))
      this.$el.addClass('is-accept');
    else
      this.$el.removeClass('is-accept');
  },

  onBackClick: function () {
    Router.getInstance().back();
  },

  onDestroy: function () {
    var self = this;
  }
});