# Minimal Pomo Timer

Pomodoro Twitch Overlay. I designed this for my co-working stream so that it is automatic and I don't need to set the timer every time. You customize the style, pomodoros and control it using chat commands on stream - shown below.

This works by installing it onto your PC rather than having it hosted online on streamlabs or streamelements since that would be lighter on the PC and for example sounds when the timer finishes are less likely to get affected when you have a slow laptop/PC (used to have a laptop before PC and suffered from this).

If streamelements is responding to the timer command, the streamelements timer command can be disabled here: https://streamelements.com/dashboard/bot/commands/default

# Installation

1. Download the zip to your desired location
   ![image](https://user-images.githubusercontent.com/35163331/165662709-b55ff46a-9df3-443f-b1f4-b741dd322430.png)

2. Add a browser source
3. Choose `timer.html`

![image](https://user-images.githubusercontent.com/35163331/165658964-4ee3c16b-e151-4749-a2ec-2a0110f899e7.png)

4. The sound of the timer needs to limited in OBS using a limiter so that you can control the exact volume you would like it sound on Stream
   ![image](https://user-images.githubusercontent.com/35163331/165692767-5e523627-43e0-4ae5-88b6-7fd76c894a23.png)
   ![image](https://user-images.githubusercontent.com/35163331/165692832-f7d1ac58-e0a3-4f7b-8356-2c07493ed806.png)

# Configuration

Within the folder, find and open the file called `configs.js` using `notepad`

The file should look like this with comments on how to change the default configurations:
![image](https://user-images.githubusercontent.com/35163331/165657486-a4660bdf-41e9-4baa-99a4-9aba595e6df6.png)

Channel: channel for which to connect the bot to<BR>
username: username of the bot you which to have connected to this overlay, e.g. I have a separate bot called `moh_manager` for my channel that is connected to all the overlays.

For oauth do the following steps:

1. Log In to https://twitchapps.com/tmi/
2. Copy the token
3. Paste into configs

oauth is a token that acts like a password that only allows the overlay to send messages on behalf of that account.

workCategory, playCategory: These are null (unused) by default, but if you want to set them to valid Twitch categories,
then the timer will automatically use the categoryCommand (defaults to !game) to set your category when the timer goes off.
Useful if you forget to set it constantly like I do!

# How to use

- !timer start: begins the timer with the defauly configuration
- !timer goal 10: changes the timer goal to 10
- !timer cycle 5: changes the current timer cycle to 5
- !timer skip: skips the current session (either work or break)
- !timer 15:00: changes the time of the current Pomo to 15:00
- !timer 600: changes the time of the pomo to 10:00 (works with seconds)
- !timer add 50: adds 50 seconds to the current time
- !timer sub 50: adds 50 seconds to the current time
- !timer pause
- !timer resume
- !timer reset: clears the timer (also !timer clear)

# Configs for round timer

I recommend copying 1 by 1 just to be sure nothing gets messed up.

```javascript
// Styling - required
const height = '250px';
const width = '250px';
const backgroundColor = '#000000'; // hex only
const backgroundOpacity = 0.5; // 0 to 1 (0 is transparent)
const backgroundRoundness = '100%';
const textColor = 'white'; //  hex or name
const fontFamily = 'Poppins'; // From google fonts: https://fonts.google.com
const labelFontSize = '30px';
const timeFontSize = '50px';
const pomoFontSize = '30px';

// Remember to change the height and width when changing these!
const labelSpaceAbove = '0px';
const labelSpaceLeft = 'auto'; // auto for centered; negative px is left; positive px is right
const timeSpaceAbove = '0px'; // negative is up; positive is down
const timeSpaceLeft = 'auto'; // auto for centered; negative px is left; positive px is right
const cycleSpaceAbove = '100px'; // negative is up; positive is down
const cycleSpaceRight = 'auto'; // Diff:auto for centered; negative px is right; positive px is left

// Remember to change the above values when changing the following one
const direction = 'column'; // row or column
```

# Contribution

I made this in a rush and using some code as boiler plate so the code quality is not the best. I am working on refactoring it:)

Please star the repository on the top right or provide a link back to this page:)
