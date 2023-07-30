require("dotenv").config();

const { App } = require("@slack/bolt");
const commands = require("./commands");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.message("hello", async ({ message, say }) => {
  await say(`Hello there <@${message.user}>!`);
});

app.message("help", async ({ say }) => {
  let text = "";
  commands.forEach(({ name, description }) => {
    text += `*${name}* - ${description}\n`;
  });

  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text,
        },
      },
    ],
    text: "Help Section",
  });
});

app.message("time", async ({ message, say }) => {
  let date = new Date().toLocaleDateString();
  let time = new Date().toLocaleTimeString();
  await say(`Current Date and time : *${date}* , *${time}* `);
});

app.message(/^(?!.*\b(?:hello|help|time)\b).*$/, async ({ message, say }) => {
  await say(
    `Invalid command, please type *help* to get the list of available commands.`
  );
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
