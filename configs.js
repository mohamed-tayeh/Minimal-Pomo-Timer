let configs = (function () {
  'use strict';

  // Authentication and channels - required
  const channel = ''; // your channel
  const username = ''; // bot account
  const oauth = ''; // should be oauth:xxxxxxxxxxxx from the bot account

  // Styling - required
  const height = '150px';
  const width = '373px';
  const backgroundColor = '#000000'; // hex only
  const backgroundOpacity = 0.5; // 0 to 1 (0 is transparent)
  const backgroundRoundness = '0px';
  const textColor = 'white'; //  hex or name
  const fontFamily = 'Poppins'; // From google fonts: https://fonts.google.com
  const labelFontSize = '24px';
  const timeFontSize = '64px';
  const pomoFontSize = '24px';

  // Remember to change the height and width when changing these!
  const labelSpaceAbove = '115px';
  const labelSpaceLeft = '0px'; // negative is left; positive is right
  const timeSpaceAbove = '-10px'; // negative is up; positive is down
  const timeSpaceLeft = '-15px'; // negative is left; positive is right
  const cycleSpaceAbove = '115px'; // negative is up; positive is down
  const cycleSpaceRight = '0px'; // Diff: negative is right; positive is left

  // Remember to change the above values when changing the following one
  const direction = 'row'; // row or column

  // Time Configuration - required
  const workTime = 3600; // in seconds
  const breakTime = 600; // in seconds
  const longBreakTime = 900; // in seconds
  const longBreakEvery = 3; // long break every x pomos
  const defaultPomoNumber = 8;
  const workRemindTime = 20;
  const startingTime = 600;
  const noLastBreak = true;

  // Label Configuration - required
  const workLabel = 'Work';
  const breakLabel = 'Break';
  const finishLabel = 'Finished!';
  const startingLabel = 'Starting';

  // Sound Configuration - required
  const workSound = 'workSound.riff';
  const breakSound = 'breakSound.riff';

  // Responses - not required
  const workMsg = "It's work time 📏 📘"; // these are 7tv emotes
  const breakMsg = 'Time for a break! 🎶 🎮'; // works with emojis
  const workRemindMsg = 'Time to get ready for focus @Moh__t 💻';
  const notMod = 'hhhhh not mod';
  const notRunning = 'The timer is not running to perform this command!';
  const streamStarting = 'Stream is starting!';
  const wrongCommand = 'Command not recognized!';
  const timerRunning = 'Timer is already started!';
  const commandSuccess = 'Done!';
  const cycleWrong = 'Cycle cannot be more than goal!';
  const goalWrong = 'Goal cannot be less than cycle!';
  const finishResponse = 'Good work today everyone 💪🏽';
  const alreadyStarting =
    'The stream is already starting or the timer is running!';

  // Slow mode - not required
  const slowMode = false; // true or false
  const slowModeTime = 3; // in seconds

  // Please don't edit any of the lines below
  const runTests = false;

  const user = {
    channel,
    username,
    oauth,
  };

  const responses = {
    workMsg,
    breakMsg,
    notMod,
    workRemindMsg,
    notRunning,
    streamStarting,
    wrongCommand,
    timerRunning,
    commandSuccess,
    cycleWrong,
    goalWrong,
    finishResponse,
    alreadyStarting,
  };

  const settings = {
    startingLabel,
    workTime,
    breakTime,
    longBreakTime,
    defaultPomoNumber,
    longBreakEvery,
    startingTime,
    workLabel,
    breakLabel,
    finishLabel,
    slowMode,
    slowModeTime,
    workRemindTime,
    workSound,
    breakSound,
    noLastBreak,
    runTests,
  };

  const styles = {
    height,
    width,
    direction,
    textColor,
    backgroundColor,
    backgroundOpacity,
    backgroundRoundness,
    fontFamily,
    labelFontSize,
    timeFontSize,
    pomoFontSize,
    labelSpaceAbove,
    labelSpaceLeft,
    timeSpaceAbove,
    timeSpaceLeft,
    cycleSpaceAbove,
    cycleSpaceRight,
  };

  let module = {};

  module.user = user;
  module.styles = styles;
  module.responses = responses;
  module.settings = settings;

  return module;
})();
