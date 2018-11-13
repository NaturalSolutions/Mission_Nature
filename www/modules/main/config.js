'use strict';

module.exports = {
  root: window.location.pathname.replace(/\/(?:index.html)?$/, ''),
  //serveur Demo
  /*coreUrl: 'http://151.80.132.63/obf-back',
  apiUrl: 'http://151.80.132.63/obf-back/obfmobileapi',*/

  //serveur local
  //test mobile
  // coreUrl: 'http://192.168.0.16/DRUPAL/OBF_BACK/www',
  // 	apiUrl: 'http://192.168.0.16/DRUPAL/OBF_BACK/www/obfmobileapi',

  // coreUrl: 'http://192.168.1.67/DRUPAL/OBF_BACK/www',
  // 	apiUrl: 'http://192.168.1.67/DRUPAL/OBF_BACK/www/obfmobileapi',

  //serveur Prod
  // coreUrl: 'http://obfmobile.noe.org',
  // apiUrl: 'http://obfmobile.noe.org/obfmobileapi',

  //test desktop
  coreUrl: 'http://51.75.120.240/mission_nature',
  apiUrl: 'http://51.75.120.240/mission_nature/obfmobileapi',
  dateLabel: 'jj/mm/aaaa hh:mm:ss',
  dateFormats: ['DD/MM/YYYY', 'DD/MM/YYYY HH:mm:ss']
};
