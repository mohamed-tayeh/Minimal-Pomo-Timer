(function () {
  'use strict';

  const user = configs.user;
  const styles = configs.styles;
  const settings = configs.settings;
  const responses = configs.responses;
  const channelBots = configs.channelBots.map((bot) => bot.toLowerCase());

  let workSound = new Audio('./media/workSound.m4a');
  let breakSound = new Audio('./media/breakSound.mp3');

  const cdContainerId = 'cd-container';
  const labelId = 'label';
  const cdTimerId = 'cd-timer';
  const cycleCounterId = 'cycle-counter';

  const clearedClass = 'cleared';

  let cdContainerEl;
  let labelEl;
  let cdTimerEl;
  let cycleCounterEl;

  let isRunning = false;
  let isCleared = false;
  let isPaused = false;

  let currTime = 0;
  let cdCounter = 0;
  let cdCounterGoal = 0;
  let cdCounterGoalDefault = settings.defaultPomoNumber * 2;

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

  function customStyles() {
    document.documentElement.style.setProperty(
      '--background-opacity',
      styles.backgroundOpacity
    );

    document.documentElement.style.setProperty(
      '--text-color',
      styles.textColor
    );

    let backgroundColor = styles.backgroundColor.toString();
    if (backgroundColor.startsWith('#')) {
      backgroundColor = backgroundColor.slice(1);
    }

    let red = parseInt(backgroundColor.slice(0, 2), 16);
    let green = parseInt(backgroundColor.slice(2, 4), 16);
    let blue = parseInt(backgroundColor.slice(4, 6), 16);

    document.documentElement.style.setProperty('--background-red', red);
    document.documentElement.style.setProperty('--background-green', green);
    document.documentElement.style.setProperty('--background-blue', blue);

    document.documentElement.style.setProperty(
      '--font-family',
      styles.fontFamily
    );

    document.documentElement.style.setProperty(
      '--label-font-size',
      styles.labelFontSize
    );

    document.documentElement.style.setProperty(
      '--time-font-size',
      styles.timeFontSize
    );

    document.documentElement.style.setProperty(
      '--pomo-font-size',
      styles.pomoFontSize
    );

    document.documentElement.style.setProperty(
      '--label-time-space',
      styles.labelTimeSpace
    );

    document.documentElement.style.setProperty(
      '--time-pomo-space',
      styles.timePomoSpace
    );
  }

  /**
   * Sets up the browser source on load.
   * @summary Connects it to twitch and loads the browser source elements when the browser source finishes rendering
   * @author Mohamed Tayeh
   */
  window.addEventListener('load', function () {
    cdContainerEl = document.getElementById(cdContainerId);
    labelEl = document.getElementById(labelId);
    cdTimerEl = document.getElementById(cdTimerId);
    cycleCounterEl = document.getElementById(cycleCounterId);
    customStyles();
  });

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
    if (self) return;
    const displayName = context['display-name'].toLowerCase();
    if (channelBots.includes(displayName)) return;

    const isMod = context.mod;
    const isBroadCaster =
      context['badges-raw'] != null &&
      context['badges-raw'].startsWith('broadcaster');

    targetGlobal = target;

    let messageSplit = msg.split(' ');
    length = messageSplit.length;
    if (length < 2) return;

    let command = messageSplit[0].toLowerCase();
    let option = messageSplit[1].toLowerCase();
    let timeOrColorOrGoal;

    if (length > 2) {
      timeOrColorOrGoal = messageSplit[2].toLowerCase();
    }

    if (command === '!timer') {
      if (!(isMod || isBroadCaster)) {
        if (responses.notMod) client.say(target, responses.notMod);
        return;
      }

      if (option === 'reset' || option === 'clear') {
        clearTimer();
      } else if (option === 'skip') {
        currTime = 1;
      } else if (option === 'pause') {
        isPaused = true;
      } else if (option === 'resume' || option === 'unpause') {
        isPaused = false;
      } else if (option === 'start') {
        if (isRunning) return;
        setUpFirstCycle();
      } else if (option === 'add') {
        const parsedTime = parseTime(timeOrColorOrGoal);

        if (isNaN(parsedTime)) return;

        currTime = currTime + parsedTime;
        if (!isRunning) setUpFirstCycle();
      } else if (option === 'goal') {
        let newCdCounterGoal = 2 * timeOrColorOrGoal;
        if (newCdCounterGoal < cdCounter) return;

        cdCounterGoal = 2 * timeOrColorOrGoal;
        updateCycleCounter(false);
      } else if (option === 'cycle') {
        let newCdCounter = 2 * timeOrColorOrGoal;
        if (newCdCounter > cdCounterGoal) return;

        if (cdCounter % 2 === 0) {
          // Currently Break time
          cdCounter = newCdCounter;
        } else {
          // Currently Work time
          cdCounter = newCdCounter - 1;
        }

        updateCycleCounter(false);
      } else {
        if (msg === undefined) return;
        let time = msg.split(' ')[1];

        const parsedTime = parseTime(time);

        if (isNaN(parsedTime)) return;

        currTime = parsedTime;
        if (!isRunning) setUpFirstCycle();
      }
    }
  }

  /**
   * Updates the label on the timer
   * @param {string} newLabel - work or break
   * @author Mohamed Tayeh
   */
  function changeLabel(newLabel) {
    labelEl.textContent = newLabel;
  }

  /**
   * Updates the cycle counter label with the new cycle number or pomo goal
   * @param {boolean} updateCounter - work or break
   * @author Mohamed Tayeh
   */
  function updateCycleCounter(updateCounter) {
    if (cdCounterGoal === 0) cdCounterGoal = cdCounterGoalDefault;
    if (updateCounter) cdCounter++;

    let displayCycleNum = Math.ceil(cdCounter / 2);
    if (displayCycleNum === 0) displayCycleNum = 1;
    let displayCounterGoal = cdCounterGoal / 2;

    cycleCounterEl.textContent =
      'Pomo ' + displayCycleNum + '/' + displayCounterGoal;
  }

  /**
   * Plays the start sound
   * @author Mohamed Tayeh
   */
  function playWorkSound() {
    workSound.play();
  }

  /**
   * Play the ending sound of the timer
   * @author Mohamed Tayeh
   */
  function playBreakSound() {
    breakSound.play();
  }

  /**
   * Updates the timer info for the next cycle
   * @summary updates cycle counter and currTime
   * @author Mohamed Tayeh
   */
  function updateTimerWithNextCycle() {
    updateCycleCounter(true);

    if (cdCounter % 2 === 0) {
      // Break time
      if (cdCounter % (settings.longBreakEvery * 2) === 0) {
        currTime = settings.longBreakTime;
      } else {
        currTime = settings.breakTime;
      }

      changeLabel(settings.breakLabel);
      if (responses.breakMsg) client.action(targetGlobal, responses.breakMsg);
      if (settings.slowMode) slowMode(false);

      playBreakSound();
    }

    if (cdCounter % 2 === 1) {
      // Work time
      currTime = settings.workTime;

      changeLabel(settings.workLabel);
      if (responses.workMsg) client.action(targetGlobal, responses.workMsg);
      if (settings.slowMode) slowMode(true);

      playWorkSound();
    }
  }

  /**
   * Starts the timer with the currTime and u
   * @author Mohamed Tayeh
   */
  function timer() {
    update(currTime);

    if (isCleared) return;

    if (isPaused && isRunning) {
      setTimeout(timer, 1000);
      return;
    }

    currTime--;

    if (currTime >= 0) {
      setTimeout(timer, 1000); // Recursive call
    } else {
      // Current Timer just ended

      updateTimerWithNextCycle();

      if (cdCounter < cdCounterGoal) {
        timer(); // Next recursive call
      } else {
        clearTimer();
      }
    }
  }

  /**
   * Sets up the first cycle of work time
   * @author Mohamed Tayeh
   */
  function setUpFirstCycle() {
    currTime = settings.workTime;
    cdCounter = 0;
    isRunning = true;
    isCleared = false;

    cdContainerEl.classList.remove(clearedClass);

    changeLabel(settings.workLabel);
    if (responses.workMsg) client.action(targetGlobal, responses.workMsg);
    if (settings.slowMode) slowMode(true);

    updateCycleCounter(true);
    playWorkSound();
    timer();
  }

  /**
   * Clears the current timer and fades it out
   * @author Mohamed Tayeh
   */
  function clearTimer() {
    isRunning = false;
    isCleared = true;

    currTime = 0;
    update(currTime);

    cdCounter = cdCounterGoal;
    updateCycleCounter(false);

    changeLabel(settings.clearLabel);

    cdContainerEl.classList.add(clearedClass);
  }

  /**
   * Parses given user input of time in digital format
   * @param time - in the format of HH:MM:SS entered by the user
   * @return time in seconds
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

    return hours + minutes + seconds;
  }

  /**
   * Updates the timer's text with currTime
   * @param {number} currTime - the current time of the timer.
   */
  function update(currTime) {
    let m = Math.floor(currTime / 60);
    let s = Math.floor((currTime % 3600) % 60);

    let minutes = m < 10 ? '0' + m : m;
    let seconds = s < 10 ? '0' + s : s;

    if (currTime === null) {
      cdTimerEl.textContent = '';
      changeLabel('');
      return;
    }

    cdTimerEl.textContent = minutes + ':' + seconds;
  }

  /**
   * Setting up slow mode
   * @param {boolean} workTime - if currently work time
   * @author Mohamed Tayeh
   */
  function slowMode(workTime) {
    if (workTime) {
      client.slow(targetGlobal, settings.slowModeTime);
    } else {
      client.slowoff(targetGlobal);
    }
  }

  /**
   * Console logs when the timer connects to the channel
   * @note taken from twitch documentation: https://dev.twitch.tv/docs/irc
   */
  function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }
})();
