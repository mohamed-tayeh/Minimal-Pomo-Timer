const discordHandler = (function () {
  'use strict';

  let { webHookURL, roleID, content } = configs.discordSettings;

  /**
   * Sends a Discord notification to the configured webhook URL, title, desriptiona and role ID.
   */
  function sendDiscordBreakNotif() {
    const roleIDStr = '{role}';
    const roleTag = `<@&${roleID}>`;

    content = content.replace(roleIDStr, roleTag);

    return fetch(webHookURL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        content,
      }),
    }).catch((err) => console.error(err));
  }

  const module = {};
  module.sendDiscordBreakNotif = sendDiscordBreakNotif;

  return module;
})();
