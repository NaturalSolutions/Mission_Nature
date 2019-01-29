'use strict';

module.exports = {
  root: window.location.pathname.replace(/\/(?:index.html)?$/, ''),
  //serveur Demo
  /* coreUrl: 'http://51.75.120.240/mission_nature',
  apiUrl: 'http://51.75.120.240/mission_nature/obfmobileapi', */

  //serveur local
  //test mobile
  // coreUrl: 'http://192.168.0.16/DRUPAL/OBF_BACK/www',
  // 	apiUrl: 'http://192.168.0.16/DRUPAL/OBF_BACK/www/obfmobileapi',


  //serveur Prod
  coreUrl: 'http://149.202.129.99/mission_nature',
  apiUrl: 'http://149.202.129.99/mission_nature/obfmobileapi',

  dateLabel: 'jj/mm/aaaa hh:mm:ss',
  dateFormats: ['DD/MM/YYYY', 'DD/MM/YYYY HH:mm:ss']
};
