const controller = (function () {
  'use strict';

  const module = {};

  const settings = configs.settings;

  let workSound = new Audio(`./media/${settings.workSound}`);
  let breakSound = new Audio(`./media/${settings.breakSound}`);

  const labelId = 'label';
  const cdTimerId = 'cd-timer';
  const cycleCounterId = 'cycle-counter';

  let labelEl;
  let cdTimerEl;
  let cycleCounterEl;

  /**
   * Updates the label on the timer
   * @param {string} newLabel - work or break
   */
  function updateLabel(newLabel) {
    labelEl.textContent = newLabel;
  }

  /**
   * Updates the time on timer in the given string, e.g. mm:ss
   * @param {string} time
   */
  function updateTime(time) {
    cdTimerEl.textContent = time;
  }

  /**
   * Updates the cycle counter with the give string, e.g. 6/8
   * @param {string} cycle
   */
  function updateCycleCounter(cycle) {
    cycleCounterEl.textContent = cycle;
  }

  /**
   * Plays the start sound
   */
  function playWorkSound() {
    workSound.play();
  }

  /**
   * Play the ending sound of the timer
   */
  function playBreakSound() {
    breakSound.play();
  }

  /**
   * Gets the elements on window load
   */
  function getElementsOnLoad() {
    labelEl = document.getElementById(labelId);
    cdTimerEl = document.getElementById(cdTimerId);
    cycleCounterEl = document.getElementById(cycleCounterId);
  }

  window.addEventListener('load', getElementsOnLoad);

  module.updateLabel = updateLabel;
  module.updateTime = updateTime;
  module.updateCycleCounter = updateCycleCounter;
  module.playWorkSound = playWorkSound;
  module.playBreakSound = playBreakSound;

  return module;
})();
