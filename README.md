# Minimal Pomo Timer
 Pomodoro Twitch Overlay. I designed this for my co-working stream so that it is automatic and I don't need to set the timer every time. You can control it using commands on stream - shown below.
 
# Installation
1. Download the zip [here]() to your desired location
2. Add a local browser source (regular browser source but it's on your machine)
3. Choose `timer.html`

# Configuration
Within the folder, find the file called `configs.js`.

The file should look like this with comments on how to change the default configurations:
![image](https://user-images.githubusercontent.com/35163331/165657486-a4660bdf-41e9-4baa-99a4-9aba595e6df6.png)

# How to use
- !timer start: begins the timer with the defauly configuration
- !timer goal 10: changes the timer goal to 10
- !timer cycle 5: changes the current timer cycle to 5
- !timer 15:00: changes the time of the Pomo to 15:00
- !timer 600: changes the time of the pomo to 10:00 (works with seconds)
- !timer add 50: adds 50 seconds to the current time
- !timer pause
- !timer resume
