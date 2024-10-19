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

    const styleProperties = [
      { cssVar: '--background-red', value: red },
      { cssVar: '--background-green', value: green },
      { cssVar: '--background-blue', value: blue },
      { cssVar: '--background-roundness', value: styles.backgroundRoundness },
      { cssVar: '--font-family', value: styles.fontFamily },
      { cssVar: '--label-font-size', value: styles.labelFontSize },
      { cssVar: '--time-font-size', value: styles.timeFontSize },
      { cssVar: '--pomo-font-size', value: styles.pomoFontSize },
      { cssVar: '--label-space-above', value: styles.labelSpaceAbove },
      { cssVar: '--label-space-left', value: styles.labelSpaceLeft },
      { cssVar: '--time-space-above', value: styles.timeSpaceAbove },
      { cssVar: '--time-space-left', value: styles.timeSpaceLeft },
      { cssVar: '--cycle-space-above', value: styles.cycleSpaceAbove },
      { cssVar: '--cycle-space-right', value: styles.cycleSpaceRight },
      { cssVar: '--text-outline-color', value: styles.textOutlineColor },
      { cssVar: '--text-outline-size', value: styles.textOutlineSize },
      { cssVar: '--direction', value: styles.direction },
      { cssVar: '--text-transform', value: styles.textTransform },
    ];

    styleProperties.forEach(({ cssVar, value }) => {
      document.documentElement.style.setProperty(cssVar, value);
    });
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
