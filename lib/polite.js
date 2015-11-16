'use strict';
var util = require('util');
var Bot = require('slackbots');

var PoliteBot = function Constructor(settings) {
  this.settings = settings;
  this.settings.name = this.settings.name || 'polite';

  this.user = null;
  this.db = null;
};

util.inherits(PoliteBot, Bot); // inherits methods and properties from the Bot constructor

PoliteBot.prototype.run = function () {
  PoliteBot.super_.call(this, this.settings);

  this.on('start', this._onStart);
  this.on('message', this._onMessage);
};

PoliteBot.prototype._onStart = function () {
  this._loadBot();
};

PoliteBot.prototype._loadBot = function () {
  var self = this;
  this.user = this.users.filter(function (user) {
    return user.name === self.name;
  })[0];
};

PoliteBot.prototype._onMessage = function (message) {
  if (this._isChatMessage(message) && this._containsPolitelyDelay) {
    this._handleMessage(message);
  }
};

PoliteBot.prototype._isChatMessage = function (message) {
  return message.type === 'message' && message.text;
};

PoliteBot.prototype._containsPolitelyDelay = function (message) {
  return message.text.toLowerCase().indexOf('polite bot') > -1;
};

PoliteBot.prototype._handleMessage = function (message) {
  var user = self._getUserById(message.user);
  var channel = self._getChannelById(message.channel);
  try {
    //example: "polite bot, in 3 hours, good morning everyone";
    var reply = '';
    var parts = message.text.split(',');
    var delayQty = parts[1].match(/[0-9]/g);
    var delayUnit = parts[1].match(/(hour?|minute?|day?)/);
    reply = "Will post `" + message + "` " + " to `" + channel.name + " in " + delayQty[0] + " " + delayUnit[0] + "(s).";
    this._waitThenPost(message, delayQty, delayUnit);
  } catch (e) {
    reply = "Sorry, command not understood. Try again with something like: polite bot, in 3 hours, good morning everyone";
  }
  self.postMessageToUser(user.name, reply);
};

function getTimeInMilliseconds(quantity, unit) {
  switch (unit) {
    case 'second':
      return 1 * quantity * 1000;
    case 'minute':
      return 60 * quantity * 1000;
    case 'hour':
      return 60 * 60 * quantity * 1000;
    case 'day':
      return 60 * 60 * 24 * quantity * 1000;
  }
}

PoliteBot.prototype._waitThenPost = function (message, delayQty, delayUnit) {
  var channel = self._getChannelById(message.channel);
  var originalUser = self._getUserById(message.user);

  var delayInMilliseconds = getTimeInMilliseconds(delayQty, delayUnit);

  setTimeout(function() {
    self.postMessageToChannel(
      channel.name,
      "Delayed message from " + originalUser.name + ": " + message.text,
      {as_user: true}
    );
  }, delayInMilliseconds);
};

module.exports = PoliteBot;