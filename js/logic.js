const logic = (function () {
  'use strict';
  
  const obsConfig = configs.obs;
  let obsSocket;
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  async function connect() {
    if (!obsConfig.port) return

    console.debug("Connecting to OBS WebSocket ws://localhost:", obsConfig.port);
    obsSocket = new WebSocket("ws://localhost:" + obsConfig.port);

    obsSocket.onopen = function () {
      console.log('Connected to OBS WebSocket');
    };

    obsSocket.onclose = function () {
      console.log('Disconnected from OBS WebSocket');
    };

    obsSocket.onerror = function (error) {
      console.error('OBS WebSocket error:', error);
    };

    obsSocket.onmessage = function (message) {
      const data = JSON.parse(message.data);
      if (data.op === 0) {
        authenticate(data.d);
      }
    };
  }
  async function authenticate(data) {
    const passwordSalt = configs.obs.password + data.authentication.salt;

    const shaObj1 = new jsSHA("SHA-256", "TEXT");
    shaObj1.update(passwordSalt);
    const base64Secret = shaObj1.getHash("B64");

    const secretChallenge = base64Secret + data.authentication.challenge;

    const shaObj2 = new jsSHA("SHA-256", "TEXT");
    shaObj2.update(secretChallenge);
    const authString = shaObj2.getHash("B64");
  
    const authMessage = {
      "op": 1,
      "d": {
        "rpcVersion": 1,
        "authentication": authString,
      }
    };
  
    // Send the authentication message
    obsSocket.send(JSON.stringify(authMessage));
  }

  async function changeScene(sceneName) {
    if (!obsConfig.port || !sceneName) return
  
    const changeSceneMessage = {
      "op": 6,
      "d": {
        "requestType": "SetCurrentProgramScene",
        "requestId": generateUUID(),
        "requestData": {
          "sceneName": sceneName
        }
      }
    };
    obsSocket.send(JSON.stringify(changeSceneMessage));
    console.log(`Scene changed to: ${sceneName}`);
  }

  window.obsHandler = {
    connect,
    changeScene
  };

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

    // Setup OBS Websocket
    obsHandler.connect();

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

    // Start the timer
    obsHandler.changeScene(configs.obs.sceneWork);

    cdCounter++;
    updateCycleCounter();
    controller.playWorkSound();
    timer();

    // set work category
    if (settings.workCategory != '') {
      chatHandler.chatCommand(
        settings.categoryCommand + ' ' + settings.workCategory
      );
    }
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
      obsHandler.changeScene(configs.obs.sceneWork);
      currTime = settings.workTime;

      controller.updateLabel(settings.workLabel);
      controller.playWorkSound();

      if (responses.workMsg) chatHandler.chatItalicMessage(responses.workMsg);
      // set work category
      if (settings.workCategory)
        chatHandler.chatCommand(
          settings.categoryCommand + ' ' + settings.workCategory
        );
    } else {
      obsHandler.changeScene(configs.obs.sceneBreak);
      if (isLongBreak()) {
        currTime = settings.longBreakTime;
        controller.updateLabel(settings.longBreakLabel);
        controller.playLongBreakSound();
        if (responses.longBreakMsg)
          chatHandler.chatItalicMessage(responses.longBreakMsg);
      } else {
        currTime = settings.breakTime;
        controller.updateLabel(settings.breakLabel);
        controller.playBreakSound();
        if (responses.breakMsg)
          chatHandler.chatItalicMessage(responses.breakMsg);
      }

      if (settings.noLastBreak && cdCounter === cdCounterGoal) finishTimer();

      if (configs.discordSettings.sendDiscord)
        discordHandler.sendDiscordBreakNotif();

      // set play category
      if (settings.playCategory !== '') {
        chatHandler.chatCommand(
          settings.categoryCommand + ' ' + settings.playCategory
        );
      }
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
   * Returns true if the goal is valid, false otherwise
   * @param {number} newGoalNum
   * @return {boolean} goal validity
   */
  function isValidGoal(newGoalNum) {
    return 2 * newGoalNum >= cdCounter;
  }

  /**
   * Updates the current goal number
   * @param {number} newGoalNum - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
   */
  function updateGoal(newGoalNum) {
    if (!isRunning) return false;

    let newCdCounterGoal = 2 * newGoalNum;
    if (newCdCounterGoal < cdCounter) return false;

    cdCounterGoal = newCdCounterGoal;
    settings.defaultPomoNumber = newGoalNum;
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

  /**
   * Adds timer eta
   * @return {string}
   */
  function estimateTime() {
    if (!isRunning) {
      chatHandler.chatItalicMessage(responses.notRunning)
      return false;
    }

    let totalRemainingTime = currTime;
    let nextCycleNumber = cdCounter + 1;
    const lastCycle = cdCounterGoal;

    while (nextCycleNumber <= lastCycle) {
      const isWork = nextCycleNumber % 2 === 1;

      if (isWork) {
        totalRemainingTime += settings.workTime;
      } else {
        // Skip adding break time if noLastBreak and this is the last cycle
        if (settings.noLastBreak && nextCycleNumber === lastCycle) {
          break;
        }

        const isLongBreak = nextCycleNumber % (settings.longBreakEvery * 2) === 0;
        totalRemainingTime += isLongBreak ? settings.longBreakTime : settings.breakTime;
      }

      nextCycleNumber++;
    }

    const endTime = Date.now() + totalRemainingTime * 1000;
    const timeStr = new Date(endTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (responses.eta) chatHandler.chatItalicMessage(responses.eta.replace('{time}', timeStr));

    return timeStr;
  }

  module.starting = starting;
  module.startTimer = startTimer;
  module.updateCycle = updateCycle;
  module.updateGoal = updateGoal;
  module.isValidGoal = isValidGoal;
  module.updateTime = updateTime;
  module.addTime = addTime;
  module.subTime = subTime;
  module.skipCycle = skipCycle;
  module.pauseTimer = pauseTimer;
  module.finishTimer = finishTimer;
  module.estimateTime = estimateTime;

  return module;
})();
