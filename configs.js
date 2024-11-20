let configs = (function () {
  'use strict';

  // Authentication and channels
  const channel = ''; // your channel
  const username = ''; // bot account
  const oauth = ''; // should be oauth:xxxxxxxxxxxx from the bot account

  // Styling - required
  const height = '150px';
  const width = '373px';
  const backgroundColor = '#000000'; // hex only
  const backgroundOpacity = 0.2; // 0 to 1 (0 is transparent)
  const backgroundRoundness = '0px';
  const textColor = 'white'; //  hex or name
  const fontFamily = 'Poppins'; // From google fonts: https://fonts.google.com
  const labelFontSize = '24px';
  const timeFontSize = '64px';
  const pomoFontSize = '24px';
  const textOutlineColor = 'black'; // hex or name
  const textOutlineSize = '0px';
  const flowDisplay = 'Flow'; // flow mode display message
  const textTransform = 'none'; // uppercase, lowercase, capitalize, none

  // Remember to change the height and width when changing these!
  const labelSpaceAbove = '115px';
  const labelSpaceLeft = '0px'; // auto for centered; negative px is left; positive px is right
  const timeSpaceAbove = '-10px'; // negative is up; positive is down
  const timeSpaceLeft = 'auto'; // auto for centered; negative px is left; positive px is right
  const cycleSpaceAbove = '115px'; // negative is up; positive is down
  const cycleSpaceRight = '0px'; // Diff:auto for centered; negative px is right; positive px is left

  // Remember to change the above values when changing the following one
  const direction = 'row'; // row or column

  // Time Configuration
  const workTime = 90 * 60; // in seconds
  const breakTime = 15 * 60; // in seconds
  const longBreakTime = 15 * 60; // in seconds
  const longBreakEvery = 3; // long break every x pomos
  const defaultPomoNumber = 5;
  const workTimeRemind = 25;
  const sendWorkTimeRemind = true;
  const startingTime = 300;
  const noLastBreak = true;
  const showHours = false; // true: time in hh:mm:ss; false: time in mm:ss always
  const showHoursIf00 = false; // true: will show 00:mm:ss, false: will show mm:ss when hours is 0

  // Label Configuration
  const workLabel = 'Work';
  const breakLabel = 'Break';
  const longBreakLabel = 'Break';
  const finishLabel = 'Finished!';
  const startingLabel = 'Starting';

  // Sound Configuration
  const workSound = 'workSound.riff'; // works with any sound extension
  const breakSound = 'breakSound.riff'; // ensure that the extension is put here
  const longBreakSound = 'breakSound.riff';

  // Responses
  const workMsg = "It's work time 📏 📘"; // these are 7tv emotes
  const breakMsg = 'Time for a break! 🎶 🎮'; // works with emojis
  const longBreakMsg = 'Time for a long break! 👀';
  const workRemindMsg = 'Time to get ready for focus @{channel} 💻'; // can be customized to anything
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
  const flowMsg = 'The timer is now in a flow state! 🌊';
  const flowingMsg =
    'The timer is currently in flow mode, change to pomodoro mode with !timer pomo';
  const pomoMsg = 'The timer is now in pomodoro mode! 🍅';
  const helpMsg =
    '!timer [start/pause/resume/skip/reset] | !timer [add/sub] 50 | !timer 50:00 | More commands with explanation: https://github.com/mohamed-tayeh/Minimal-Pomo-Timer?tab=readme-ov-file#how-to-use';

  // Discord notifications
  const sendDiscord = false; // true or false
  const webHookURL = ''; // make sure to keep the '' around the url
  const roleID = '1050921202853617724'; // role id to ping, can be obtained by right clicking on the role (ensure to have developer mode on)
  const content = 'Stream is going on break! {role}'; // message to send

  // work/play category options
  const workCategory = ''; // e.g. "Co-working & Studying"
  const playCategory = ''; // e.g. "Hearthstone"
  const categoryCommand = '!game';

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
    longBreakMsg,
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
    flowMsg,
    flowingMsg,
    pomoMsg,
    helpMsg,
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
    longBreakLabel,
    finishLabel,
    sendWorkTimeRemind,
    workTimeRemind,
    workSound,
    breakSound,
    longBreakSound,
    noLastBreak,
    runTests,
    showHours,
    showHoursIf00,
    workCategory,
    playCategory,
    categoryCommand,
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
    textOutlineColor,
    textOutlineSize,
    textTransform,
    flowDisplay,
  };

  const discordSettings = {
    webHookURL,
    roleID,
    content,
    sendDiscord,
  };

  let module = {};

  module.user = user;
  module.styles = styles;
  module.responses = responses;
  module.settings = settings;
  module.discordSettings = discordSettings;

  return module;
})();
