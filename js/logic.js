const logic = (function () {
  'use strict';

  const module = {};

  const settings = configs.settings;
  const responses = configs.responses;

  let isRunning;
  let isPaused;
  let isStarting;
  let currTime;
  let cdCounter;
  let cdCounterGoal;

  /**
   * Inits the pomo timer for work time
   */
  function initTimer() {
    isRunning = false;
    isPaused = false;
    currTime = settings.workTime;
    cdCounter = 0;
    cdCounterGoal = settings.defaultPomoNumber * 2;

    // Initial look of the timer
    controller.updateLabel(settings.workLabel);
    controller.updateTime(formatCurrTime());
    updateCycleCounter();
  }

  window.addEventListener('load', initTimer);

  /**
   * Sets up the starting timer
   */
  function starting() {
    // Timer already running or starting timer is running
    if ((isRunning && !isStarting) || isStarting) return false;

    isRunning = true;
    isStarting = true;
    cdCounter = 0;

    // The look of the timer during starting
    controller.updateLabel(settings.startingLabel);
    currTime = settings.startingTime;
    updateCycleCounter();
    startingTimer();
    return true;
  }

  /**
   * Recursive function for the starting screen timer
   */
  function startingTimer() {
    if (!isStarting) return;
    if (isPaused && isStarting) {
      setTimeout(startingTimer, 1000);
      return;
    }

    controller.updateTime(formatCurrTime());
    currTime--;

    if (currTime >= 0) {
      setTimeout(startingTimer, 1000); // Recursive call
    } else {
      controller.playWorkSound();
      initTimer();
    }
  }

  /**
   * Sets up the first cycle of work time
   */
  function startTimer() {
    if (isRunning && !isStarting) {
      chatHandler.chatItalicMessage(responses.timerRunning);
      return;
    }

    currTime = settings.workTime;
    cdCounter = 0;
    isRunning = true;
    isStarting = false;

    controller.updateLabel(settings.workLabel);

    if (responses.workMsg) chatHandler.chatItalicMessage(responses.workMsg);
    if (settings.slowMode) chatHandler.slowMode(true);

    cdCounter++;
    updateCycleCounter();
    controller.playWorkSound();
    timer();
  }

  /**
   * Starts the timer with the currTime and u
   */
  function timer() {
    controller.updateTime(formatCurrTime());

    if (isPaused && isRunning) {
      setTimeout(timer, 1000);
      return;
    }

    currTime--;

    if (currTime >= 0) {
      if (
        !isWorkTime() &&
        currTime === settings.workTimeRemind &&
        settings.sendWorkTimeRemind &&
        !isLastBreak()
      ) {
        chatHandler.chatItalicMessage(responses.workRemindMsg);
      }

      setTimeout(timer, 1000); // Recursive call
    } else {
      if (cdCounter < cdCounterGoal && !settings.noLastBreak) {
        updateTimerWithNextCycle();
        timer(); // Next recursive call
      } else if (cdCounter < cdCounterGoal - 1 && settings.noLastBreak) {
        updateTimerWithNextCycle();
        timer(); // Next recursive call
      } else {
        finishTimer();
      }
    }
  }

  /**
   * Updates the timer info for the next cycle
   * @summary updates cycle counter and currTime
   */
  function updateTimerWithNextCycle() {
    cdCounter++;
    updateCycleCounter();

    if (isWorkTime()) {
      currTime = settings.workTime;

      controller.updateLabel(settings.workLabel);
      controller.playWorkSound();

      if (responses.workMsg) chatHandler.chatItalicMessage(responses.workMsg);
      if (settings.slowMode) chatHandler.slowMode(true);
    } else {
      if (isLongBreak()) {
        currTime = settings.longBreakTime;
      } else {
        currTime = settings.breakTime;
      }

      if (settings.noLastBreak && cdCounter === cdCounterGoal) finishTimer();

      controller.updateLabel(settings.breakLabel);
      controller.playBreakSound();

      if (configs.discordSettings.sendDiscord)
        discordHandler.sendDiscordBreakNotif();

      if (responses.breakMsg) chatHandler.chatItalicMessage(responses.breakMsg);
      if (settings.slowMode) chatHandler.slowMode(false);
    }
  }

  /**
   * Updates the current cycle number
   * @param {number} newCycleNum
   */
  function updateCycle(newCycleNum) {
    let newCdCounter = 2 * newCycleNum;
    if (newCdCounter > cdCounterGoal) return false;

    if (isWorkTime()) cdCounter = newCdCounter - 1;
    else cdCounter = newCdCounter;

    updateCycleCounter();
    return true;
  }

  /**
   * Updates the current goal number
   * @param {number} newGoalNum - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
   */
  function updateGoal(newGoalNum) {
    let newCdCounterGoal = 2 * newGoalNum;
    if (newCdCounterGoal < cdCounter) return false;

    cdCounterGoal = newCdCounterGoal;
    updateCycleCounter();
    return true;
  }

  /**
   * Controls the current timer to be in a finished state
   */
  function finishTimer() {
    if (!isRunning) return false;

    controller.updateLabel(settings.finishLabel);
    currTime = 0;
    controller.updateTime(formatCurrTime());

    isRunning = false;
    isStarting = false;
    isPaused = false;

    cdCounter = cdCounterGoal;
    updateCycleCounter();

    if (settings.noLastBreak) controller.playBreakSound();

    chatHandler.chatItalicMessage(responses.finishResponse);
    return true;
  }

  /**
   * Updates the cycle counter label with the new cycle number and pomo goal
   */
  function updateCycleCounter() {
    let displayCycleNum = Math.ceil(cdCounter / 2);
    let displayCounterGoal = cdCounterGoal / 2;

    controller.updateCycleCounter(
      'Pomo ' + displayCycleNum + '/' + displayCounterGoal
    );
  }

  /**
   * Updates the time displayed on the timer
   * @param {number} time
   */
  function updateTime(time) {
    if (!isRunning) return false;
    currTime = time;
    return true;
  }

  /**
   * Adds timeInSeconds to the currTime
   * @param {number} timeInSeconds
   */
  function addTime(timeInSeconds) {
    if (!isRunning) return false;
    if (!timeInSeconds) return;
    currTime += timeInSeconds;
    return true;
  }

  /**
   * subtracts time from currTime
   * @param {number} timeInSeconds
   */
  function subTime(timeInSeconds) {
    if (!isRunning) return false;
    if (!timeInSeconds) return;
    currTime -= timeInSeconds;
    return true;
  }

  /**
   * Skips the current cycle by making it to a value of 1
   * @return {boolean} success or fail
   */
  function skipCycle() {
    if (!isRunning) return false;
    currTime = 1;
    return true;
  }

  /**
   * Pauses/Resumes the timer
   * @param {boolean} pause
   * @return {boolean} success or fail
   */
  function pauseTimer(pause) {
    if (!isRunning) return false;
    isPaused = pause;
    return true;
  }

  /**
   * Returns true if it is currently work time (1)
   * @summary cdCounter is odd when it is work time; even during break time
   * @return {boolean}
   */
  function isWorkTime() {
    return cdCounter % 2;
  }

  /**
   * Returns if it is a long break
   * @return {boolean}
   */
  function isLongBreak() {
    return !(cdCounter % (settings.longBreakEvery * 2));
  }

  /**
   * Returns if it is a long break
   * @return {boolean}
   */
  function isLastBreak() {
    return cdCounter == cdCounterGoal;
  }

  /**
   * Formats the currTime (seconds) into mm:ss
   * @return {string}
   */
  function formatCurrTime() {
    let h = Math.floor(currTime / 3600);
    let m = settings.showHours
      ? Math.floor((currTime % 3600) / 60)
      : Math.floor(currTime / 60);
    let s = Math.floor((currTime % 3600) % 60);

    let hours = h < 10 ? '0' + h : h;
    let minutes = m < 10 ? '0' + m : m;
    let seconds = s < 10 ? '0' + s : s;

    if (settings.showHours && settings.showHoursIf00)
      return hours + ':' + minutes + ':' + seconds;
    if (settings.showHours)
      return (h ? hours + ':' : '') + minutes + ':' + seconds;

    return minutes + ':' + seconds;
  }

  module.starting = starting;
  module.startTimer = startTimer;
  module.updateCycle = updateCycle;
  module.updateGoal = updateGoal;
  module.updateTime = updateTime;
  module.addTime = addTime;
  module.subTime = subTime;
  module.skipCycle = skipCycle;
  module.pauseTimer = pauseTimer;
  module.finishTimer = finishTimer;

  return module;
})();
