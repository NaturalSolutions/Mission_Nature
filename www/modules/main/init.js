'use strict';

var Backbone = require('backbone'),
  BackboneValidation = require('backbone-validation'),
  NsBackboneValidation = require('./ns-backbone-validation'),
  BackboneForms = require('backbone-forms'),
  LocalStorage = require('backbone.localstorage'),
  Marionette = require('backbone.marionette'),
  $ = require('jquery'),
  autocomplete = require('jquery-ui/autocomplete'),
  $ns = require('jquery-ns'),
  bootstrap = require('bootstrap'),
  $nsFabDial = require('jquery-ns-fab_dial'),
  main = require('./main.view'),
  //currentPos = require('./current-position'),
  moment = require('moment'),
  momentFr = require('moment/locale/fr'),
  momentDurationFormat = require('moment-duration-format'),
  datetimepicker = require('eonasdan-bootstrap-datetimepicker'),
  momentPickerFr = require('eonasdan-bootstrap-datetimepicker/node_modules/moment/locale/fr'),
  _ = require('lodash'),
  _ns = require('lodash-ns'),
  BackboneFormsApp = require('./app-backbone-form'),
  Observation = require('../observation/observation.model'),
  i18n = require('i18next'),
  XHR = require('i18next-xhr-backend'),
  intervalPlural = require('i18next-intervalplural-postprocessor'),
  sprintf = require('i18next-sprintf-postprocessor'),
  User = require('../profile/user.model'),
  //  TimeForest = require('../time_forest/time_forest.model'),
  Log = require('../logs/log.model'),
  City = require('../localize/city.model'),
  //  Departement = require('../main/departement.model'),
  Help = require('../main/help.model'),
  Mission = require('../mission/mission.model'),
  Taxon = require('../taxons/taxons.model'),
  Session = require('../main/session.model'),
  Utilities = require('../main/utilities'),
  Dialog = require('bootstrap-dialog'),
  Router = require('../routing/router'),
  css_browser_selector = require('css_browser_selector');

_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

function init() {
  if (navigator.onLine) {
    Session.model.getInstance().set({
      'network': true
    });
  } else {
    Session.model.getInstance().set({
      'network': false
    });
  }

  window.addEventListener('online', function () {
    console.log('online');
    Session.model.getInstance().set({
      'network': true
    });
  }, false);

  window.addEventListener('offline', function () {
    Session.model.getInstance().set({
      'network': false
    });
  }, false);

  window.addEventListener('native.keyboardshow', function () {
    $('body').addClass('keyboardshow');
  });
  window.addEventListener('native.keyboardhide', function () {
    $('body').removeClass('keyboardshow');
  });

  moment.locale('fr');

  Backbone.Marionette.Renderer.render = function (template, data) {
    return template(data);
  };

  var getI18n = function () {
    var deferred = $.Deferred();

    i18n
      .use(XHR)
      .use(sprintf)
      .use(intervalPlural)
      .init({
        backend: {
          loadPath: "locales/{{lng}}/{{ns}}.json"
        },
        lng: 'fr',
      }, function (t) {
        deferred.resolve();
      });

    return deferred;
  };

  var getMissions = function () {
    var missionCollection = Mission.collection.getInstance();

    //TODO manage updates
    var deferred = $.Deferred();
    $.getJSON('./data/missions.json')
      .then(function (missionDatas) {
        //var missionDatas = JSON.parse(response);
        var now = moment();
        _.forEach(missionDatas, function (missionData) {
          _.forEach(missionData.seasons, function (season) {
            season.startAt = moment(season.startAt, 'MM');
            season.endAt = moment(season.endAt, 'MM');
            season.endAt.endOf('month');
            if (season.startAt > season.endAt) {
              if (now > season.endAt)
                season.endAt.add(1, 'y');
              else
                season.startAt.subtract(1, 'y');
            }
            season.startAt = season.startAt.toDate();
            season.endAt = season.endAt.toDate();
          });
          // try new collection of taxon in each collection of mission
          var taxonCollection = Taxon.collection.getInstance();
          _.forEach(missionData.taxon, function (taxonData) {
              taxonData.sources = taxonData.sources.split(",");

              switch (taxonData.environment) {
                case "0":
                  taxonData.environment = "inconnu";
                  break;
                case "1":
                  taxonData.environment = "affleurements rocheux";
                  break;
                case "2":
                  taxonData.environment = "forêts de conifères";
                  break;
                case "3":
                taxonData.environment = "forêts de feuillus";
                  break;
                case "4":
                taxonData.environment = "fourrés et boisements";
                  break;
                case "5":
                taxonData.environment = "jardins et parcs";
                  break;
                case "6":
                taxonData.environment = "landes sèches";
                  break;
                case "7":
                taxonData.environment = "prairies";
                  break;
                case "8":
                taxonData.environment = "rivières, mares et étangs";
                  break;
                case "9":
                taxonData.environment = "vergers";
                  break;
                case "10":
                taxonData.environment = "villages et zones urbaines";
                  break;
                case "11":
                taxonData.environment = "zones humides";
                  break;
                default:
                  console.log(taxonData.environment);
                  console.log("error : wrong environment number");
                  break;
              }
            var taxon = new Taxon.Model({
              id: taxonData.id,
              cd_nom: taxonData.cd_nom,
              title: taxonData.title,
              family: taxonData.family,
              url: taxonData.url,
              description: taxonData.description,
              characteristic: taxonData.characteristic,
              environment: taxonData.environment,
              environment_description: taxonData.environment_description,
              not_confuse: taxonData.not_confuse,
              sources: taxonData.sources
            });
            taxonCollection.add(taxon);
          });
          var mission = new Mission.Model({
            id: missionData.id,
            num: missionData.num,
            title: missionData.title,
            caption: missionData.caption,
            plural: missionData.plural,
            difficulty: missionData.difficulty,
            seasons: missionData.seasons,
            introduction: missionData.introduction,
            id_taxons: missionData.id_taxons,
            taxon: taxonCollection
          });
          missionCollection.add(mission);
        });
        deferred.resolve();
      }, function (error) {
        console.log(error);
      });

    return deferred;
  };

  var getCities = function () {
    return City.model.getInstance().load();
  };

  /*  var getDepartements = function() {
      var deferred = $.Deferred();
      var departementCollection = new Departement.collection.getInstance();

      $.getJSON('./data/departements.json')
        .then(function(response) {
          var departementDatas = response;
          _.forEach(departementDatas, function(departementData) {
            var departement = new Departement.Model({
              id: departementData.code,
              label: departementData.title,
              title: departementData.title,
              lat: departementData.lat,
              lon: departementData.lon
            });
            departementCollection.add(departement);
          });
          deferred.resolve();
        }, function(error) {
          console.log(error);
        });

      return deferred;
    };
    */

  var gethelp = function () {
    var deferred = $.Deferred();
    var helpCollection = new Help.collection.getInstance();

    $.getJSON('./data/helps.json')
      .then(function (response) {
        var helpDatas = response;
        _.forEach(helpDatas, function (helpData) {
          var help = new Help.Model({
            id: helpData.id,
            title: helpData.title,
            description: helpData.description
          });
          helpCollection.add(help);
        });
        deferred.resolve();
      }, function (error) {
        console.log(error);
      });

    return deferred;
  };

  var getLogs = function () {
    return Log.collection.getInstance().fetch();
  };

  var getObservations = function () {
    return Observation.collection.getInstance().fetch();
  };

  var getUser = function () {
    var deferred = $.Deferred();
    var collection = User.collection.getInstance();
    collection.fetch({
      success: function (data) {
        var anonymous = collection.getAnonymous();
        var current = collection.findWhere({
          isCurrent: true
        });
        if (!current)
          current = anonymous;
        collection.setCurrent(current);
        deferred.resolve(current);
      },
      error: function (error) {
        console.log(error);
        deferred.reject(error);
      }
    });

    return deferred;
  };
  /*
    var getTimeForest = function() {
      var deferred = $.Deferred();
      var collection = TimeForest.collection.getInstance();
      collection.fetch({
        success: function(data) {
          // collection.forEach(function(item) {
          //   item.set({
          //     startTime: 0,
          //     intervalDuration: 0
          //   }).save();
          // });
          deferred.resolve();
        },
        error: function(error) {
          console.log(error);
          deferred.reject(error);
        }
      });

      return deferred;
    };
  */
  var checkUrlFile = function () {
    /* jshint ignore:start */
    if (device.platform === 'iOS') {
      getObservations().done(function (obss) {
        obss.forEach(function (obs, idx) {
          obs.photos.forEach(function (photo) {
            var absolutePath = photo.url.indexOf('file://');
            if (absolutePath !== -1)
              photo.url = 'cdvfile://localhost/persistent/mission-nature/' + photo.url.substr(photo.url.lastIndexOf('/') + 1);
          });
        });
      });
    }
    /* jshint ignore:end */
  };

  var app = new Marionette.Application();
  app.on('start', function () {
    BackboneFormsApp.init();
    Router.getInstance();
    main.init();
    main.getInstance().render();
    Backbone.history.start();
  });

  $.when(getI18n(), getMissions(), getCities(), /*getDepartements(),*/ gethelp(), getUser(), getObservations(), getLogs() /*, getTimeForest()*/ )
    .done(function () {
      if (window.cordova)
        checkUrlFile();
      app.start();
    });
}

if (window.cordova) {
  //iOS During initial startup, the first offline event (if applicable) takes at least a second to fire.
  setTimeout(function () {
    document.addEventListener('deviceready', init, false);
    navigator.splashscreen.hide();
    window.open = window.cordova.InAppBrowser.open;
  }, 3000);

} else {

  setTimeout(function () {
    $(document).ready(init);
  }, 500);
}