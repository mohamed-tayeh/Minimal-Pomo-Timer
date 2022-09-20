(function () {
  'use strict';

  const styles = configs.styles;

  function customStyles() {
    loadGoogleFont(styles.fontFamily);

    document.documentElement.style.setProperty('--height', styles.height);

    document.documentElement.style.setProperty('--width', styles.width);

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
      '--background-roundness',
      styles.backgroundRoundness
    );

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
      '--label-space-above',
      styles.labelSpaceAbove
    );

    document.documentElement.style.setProperty(
      '--time-space-above',
      styles.timeSpaceAbove
    );

    document.documentElement.style.setProperty(
      '--time-space-left',
      styles.timeSpaceLeft
    );

    document.documentElement.style.setProperty(
      '--cycle-space-above',
      styles.cycleSpaceAbove
    );
  }

  /**
   * Dynamically loads a google font
   * @param {string} font
   */
  function loadGoogleFont(font) {
    WebFont.load({
      google: {
        families: [font],
      },
    });
  }

  window.addEventListener('load', customStyles);
})();
