'use strict';
var PoliteBot = require('../lib/polite');

var token = process.env.BOT_API_KEY;
var name = 'Polite Bot';

var mr_polite = new PoliteBot({
  token: token,
  name: name
});

mr_polite.run();