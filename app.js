require("dotenv").config();
const { App } = require("@slack/bolt");
const axios = require("axios");

const commands = require("./commands");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.message("hello", async ({ message, say }) => {
  await say(`Hello there <@${message.user}>!`);
});

const getCommands = () => {
  let text = "List of Available commands. \n";
  commands.forEach(({ name, description }) => {
    text += `*${name}* - ${description}\n`;
  });
  return text;
};

app.message("help", async ({ say }) => {
  const text = getCommands();
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

app.message(
  /^(?!.*\b(?:hello|help|time|joke)\b).*$/,
  async ({ message, say }) => {
    await say(
      `Invalid command, please type *help* to get the list of available commands.`
    );
  }
);

app.message(/joke/, async ({ message, say }) => {
  axios
    .get("https://api.chucknorris.io/jokes/random")
    .then(async (res) => {
      const joke = res.data.value;
      await say(`Hope this joke will make you laugh!😃\n*${joke}* 😂`);
    })
    .catch((err) => {
      console.log("Oops. Something went wrong, while processing your request");
    });
});

app.message("button", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey there <@${message.user}>!`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Need Help",
          },
          action_id: "button_click",
        },
      },
    ],
    text: `Need help button`,
  });
});

app.action("button_click", async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`<@${body.user.id}> clicked the button`);
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
