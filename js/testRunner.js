let testRunner = (function () {
  'use strict';

  const module = {};

  /**
   * Start command
   */
  function timerStart() {
    chatHandler.chatCommand('!start');
    chatHandler.chatCommand('!start');
  }

  /**
   * Basic timer functionality
   * @note should end with timer at time ; cycle ; goal
   */
  function timerFunctionality(callback = null, callBackArg = null) {
    setTimeout(chatHandler.chatCommand('!timer start'), 1000);
    setTimeout(chatHandler.chatCommand('!timer pause'), 3000);
    setTimeout(chatHandler.chatCommand('!timer resume'), 5000);
    setTimeout(chatHandler.chatCommand('!timer pause'), 7000);
    setTimeout(chatHandler.chatCommand('!timer unpause'), 9000);
    setTimeout(chatHandler.chatCommand('!timer add 10:00'), 11000);
    setTimeout(chatHandler.chatCommand('!timer sub 5:00'), 13000);
    setTimeout(chatHandler.chatCommand('!timer skip'), 15000);
    setTimeout(chatHandler.chatCommand('!timer goal 100'), 17000);
    setTimeout(chatHandler.chatCommand('!timer cycle 99'), 19000);
    setTimeout(chatHandler.chatCommand('!timer goal 10'), 21000);
    setTimeout(chatHandler.chatCommand('!timer cycle 1'), 23000);
    setTimeout(chatHandler.chatCommand('!timer skip'), 25000);

    if (!!callback) setTimeout(callback(callBackArg), 30000);
  }

  /**
   * Testing timer with start
   */
  function timerFunctionalityWithStartBegin() {
    chatHandler.chatCommand('!start');
    timerFunctionality();
  }

  /**
   * Tests timer functionality + !start command at the end
   */
  function timerFunctionalityWithStartEnd() {
    timerFunctionality(chatHandler.chatCommand, '!start');
  }

  /**
   * Tests timer functionality + !timer start command
   */
  function timerFunctionalityWithRepeatedTimerStart() {
    timerFunctionality(chatHandler.chatCommand, '!timer start');
  }

  /**
   * Starting then finishing the timer
   */
  function startingThenFinish() {
    chatHandler.chatCommand('!start');
    chatHandler.chatCommand('!timer finish');
  }

  /**
   * Test timer functionality then finishing the timer
   */
  function timerFunctionalityThenFinish() {
    timerFunctionality(chatHandler.chatCommand, '!timer finish');
  }

  /**
   * Change goal to 1 when cycle = 1
   */
  function changingGoalTo1() {
    chatHandler.chatCommand('!timer start');
    chatHandler.chatCommand('!timer goal 1');
    chatHandler.chatCommand('!timer skip');
  }

  /**
   * Start timer after finishing
   */
  function finishThenStart() {
    setTimeout(chatHandler.chatCommand('!timer start'), 1000);
    seTimeout(chatHandler.chatCommand('!timer finish'), 2000);
    seTimeout(chatHandler.chatCommand('!start'), 4000);
  }

  /**
   * Choose which test you would like to run
   */
  function runTests() {
    // timerStart();
    // timerFunctionality();
    // timerFunctionalityWithStartBegin();
    // timerFunctionalityWithStartEnd();
    // timerFunctionalityWithRepeatedTimerStart();
    // startingThenFinish();
    // timerFunctionalityThenFinish();
    // changingGoalTo1();
  }

  module.runTests = runTests;
  return module;
})();
