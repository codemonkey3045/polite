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
    this._acceptReceipt(message);
    this._waitThenPost(message);
  }
};

PoliteBot.prototype._isChatMessage = function (message) {
  return message.type === 'message' && message.text;
};

PoliteBot.prototype._containsPolitelyDelay = function (message) {
  return message.text.toLowerCase().indexOf('polite bot') > -1;
};

PoliteBot.prototype._acceptReceipt = function (message) {
  var user = self._getUserById(message.user);
  var channel = self._getChannelById(message.channel);
  self.postMessageToUser(
    user.name,
    "Will post `" + message + "` " + " to `" + channel.name + "` at 9am!"
  );
};

PoliteBot.prototype._waitThenPost = function (message) {
  //not sure how to address time yet.. should user tell bot hours to wait? Or should I hardcode to 9am?

};

module.exports = PoliteBot;