let configs = (function () {
  'use strict';

  // Authentication and channels - required
  const channel = '';
  const username = '';
  const oauth = ''; // Should be oauth:<token>
  const channelBots = ['streamelements', 'nightbot', 'streamlabs'];

  // Styling - required
  const textColor = 'white'; //  hex or name
  const backgroundColor = '#000000'; // hex only
  const backgroundOpacity = 0.5; // 0 to 1 (0 is transparent)
  const fontFamily = 'Roboto';
  const labelFontSize = '55px';
  const timeFontSize = '90px';
  const pomoFontSize = '36px';
  const labelTimeSpace = '0px';
  const timePomoSpace = '6px';

  // Time Configuration - required
  const workTime = 3000; // in seconds
  const breakTime = 600; // in seconds
  const longBreakTime = 900; // in seconds
  const longBreakEvery = 3; // long break every x pomos
  const defaultPomoNumber = 6;

  // Label Configuration - required
  const workLabel = 'Work';
  const breakLabel = 'Break';
  const clearLabel = '( ͡ᵔ ͜ʖ ͡ᵔ)';

  // Responses - not required
  const workMsg = "It's work time POLICE POLICE Knifeduck peepoRun"; // these are 7tv emotes
  const breakMsg = '🥁 🥁 Time for a break! 🥁 🥁'; // works with emojis
  const notMod = 'hhhhh not mod';

  // Slow mode - not required
  const slowMode = true; // true or false
  const slowModeTime = 3; // in seconds

  // Don't touch this
  const user = {
    channel,
    username,
    oauth,
  };

  const styles = {
    textColor,
    backgroundColor,
    backgroundOpacity,
    fontFamily,
    labelFontSize,
    timeFontSize,
    pomoFontSize,
    labelTimeSpace,
    timePomoSpace,
  };

  const responses = {
    workMsg,
    breakMsg,
    notMod,
  };

  const settings = {
    workTime,
    breakTime,
    longBreakTime,
    defaultPomoNumber,
    longBreakEvery,
    workLabel,
    breakLabel,
    clearLabel,
    slowMode,
    slowModeTime,
  };

  let module = {};

  module.user = user;
  module.styles = styles;
  module.responses = responses;
  module.settings = settings;
  module.channelBots = channelBots;

  return module;
})();
