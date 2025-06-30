const chatHandler = (function () {
  'use strict';

  const module = {};

  const user = configs.user;
  const responses = configs.responses;
  const isTesting = configs.settings.runTests;

  let targetGlobal;

  const opts = {
    identity: {
      username: user.username,
      password: user.oauth,
    },
    channels: [user.channel],
  };

  const client = new tmi.client(opts);

  client.on('message', onMessageHandler);
  client.on('connected', onConnectedHandler);

  client.connect();

  /**
   * Messages from chat pass through this function to detect when the timer command is used.
   * @summary Only executes the given commands if the user is a mod or the broadcaster
   * @param target - the channel were the message came from
   * @param {JSON} context - Additional information about the message and its sender
   * @param {String} msg - The message sent in chat
   * @param {Boolean} self - whether it was a message from the logged in account itself
   * @note This function was taken from twitch documentation: https://dev.twitch.tv/docs/irc
   */
  function onMessageHandler(target, context, msg, self) {
    if (!msg || self) return;

    targetGlobal = target;

    const { command, firstParam, secondParam } = extractMsgParams(msg);

    if (command !== '!timer' && command !== '!start') return;

    const { isMod, isBroadCaster, chatterName } = extractMsgInfo(context);

    if (!(isMod || isBroadCaster)) {
      chatItalicMessage(responses.notMod, chatterName);
      return;
    }

    if (command === '!start') {
      let startingSuccess = logic.starting();
      if (startingSuccess) chatItalicMessage(responses.streamStarting);
      else chatItalicMessage(responses.alreadyStarting);
      return;
    }

    let parsedTime;

    switch (firstParam) {
      case 'start':
        logic.startTimer();
        break;
      case 'pause':
        timerNotRunning(logic.pauseTimer(true));
        break;
      case 'add':
        parsedTime = parseTime(secondParam);
        timerNotRunning(logic.addTime(parsedTime));
        break;
      case 'sub':
        parsedTime = parseTime(secondParam);
        timerNotRunning(logic.subTime(parsedTime));
        break;
      case 'skip':
        timerNotRunning(logic.skipCycle());
        break;
      case 'resume':
      case 'unpause': // two cases in a row is the same as an or operator
        timerNotRunning(logic.pauseTimer(false));
        break;
      case 'cycle':
        let cycleSuccess = logic.updateCycle(secondParam);
        if (cycleSuccess) chatItalicMessage(responses.commandSuccess);
        else chatItalicMessage(responses.cycleWrong);
        break;
      case 'goal':
        let goalSuccess = logic.updateGoal(secondParam);
        if (goalSuccess) chatItalicMessage(responses.commandSuccess);
        else if (logic.isValidGoal(secondParam)) timerNotRunning(false);
        else chatItalicMessage(responses.goalWrong);
        break;
      case 'eta':
        logic.estimateTime();
        break;
      case 'finish':
      case 'reset':
      case 'clear':
        let finishSuccess = logic.finishTimer();
        if (!finishSuccess) chatItalicMessage(responses.notRunning);
        break;
      default:
        parsedTime = parseTime(firstParam);

        if (parsedTime) timerNotRunning(logic.updateTime(parsedTime));
        else chatItalicMessage(responses.wrongCommand);
    }
  }

  /**
   * Extracts information about the sender of the message
   * @param context - obj with user info from tmi.js
   * @return {{isMod: bool, isBroadCaster: bool, chatterName: string}}
   */
  function extractMsgInfo(context) {
    const isMod = context.mod;
    const isBroadCaster =
      context['badges-raw'] != null &&
      context['badges-raw'].startsWith('broadcaster');
    const chatterName = context['display-name']?.toLowerCase();

    return {
      isMod,
      isBroadCaster,
      chatterName,
    };
  }

  /**
   * Extracts information from chat messages
   * @param msg - message from chat
   * @return {{command: string, firstParam: string, secondParam: string}}
   */
  function extractMsgParams(msg) {
    let messageSplit = msg.split(' ');
    const length = messageSplit.length;

    let command = messageSplit[0].toLowerCase();
    let firstParam;
    if (length > 1) firstParam = messageSplit[1].toLowerCase();
    let secondParam;
    if (length > 2) secondParam = messageSplit[2].toLowerCase();

    return {
      command,
      firstParam,
      secondParam,
    };
  }

  /**
   * Parses given user input of time in digital format
   * @param time - in the format of HH:MM:SS entered by the user
   * @return time in seconds or null if invalid
   */
  function parseTime(time) {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    let split = time.split(':');

    if (split.length === 3) {
      hours = parseInt(split[0]) * 60 * 60;
      minutes = parseInt(split[1]) * 60;
      seconds = parseInt(split[2]);
    } else if (split.length === 2) {
      hours = 0;
      minutes = parseInt(split[0]) * 60;
      seconds = parseInt(split[1]);
    } else {
      hours = 0;
      minutes = 0;
      seconds = parseInt(split[0]);
    }

    let timeInSeconds = hours + minutes + seconds;
    if (isNaN(timeInSeconds)) return null;
    return timeInSeconds;
  }

  function timerNotRunning(success) {
    if (success) chatItalicMessage(responses.commandSuccess);
    else chatItalicMessage(responses.notRunning);
  }

  /**
   * Sends a message in chat in italics (/me command)
   * @param {string} message
   */
  function chatItalicMessage(message) {
    if (!message) return;
    if (message === null || message == undefined) return;
    if (message === 'null' || message == 'undefined') return;
    message = message.replace(constants.channelStr, user.channel);
    client.action(targetGlobal, message);
  }

  /**
   * Used for testing of the bot
   * @param {string} message
   */
  function chatCommand(message) {
    client.say(`#${user.channel}`, message);
  }

  /**
   * Console logs when the timer connects to the channel
   * @note taken from twitch documentation: https://dev.twitch.tv/docs/irc
   */
  function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    if (isTesting) window.addEventListener('load', testRunner.runTests());
  }

  module.chatItalicMessage = chatItalicMessage;
  module.chatCommand = chatCommand;

  return module;
})();
