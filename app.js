require("dotenv").config();
const { App } = require("@slack/bolt");
const axios = require("axios");

const commands = require("./commands");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

//method to return all the available commands
const getCommands = () => {
  let text = "List of Available commands. \n";
  commands.forEach(({ name, description }) => {
    text += `*${name}* - ${description}\n`;
  });
  return text;
};

//Listens to incoming messages that contain "help"
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

//Listens to incoming messages that contain "time"
app.message("time", async ({ message, say }) => {
  let date = new Date().toLocaleDateString();
  let time = new Date().toLocaleTimeString();
  await say(`Current Date and time : *${date}* , *${time}* `);
});

//Listens to incoming messages that contain invalid commands
app.message(
  /^(?!.*\b(?:hello|help|time|joke)\b).*$/,
  async ({ message, say }) => {
    await say(
      `Invalid command, please type *help* to get the list of available commands.`
    );
  }
);

//Listens to incoming messages that contain "joke"
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

//Listens to incoming messages that contain "hello" with need-help button
app.message("hello", async ({ message, say }) => {
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hello there <@${message.user}>!`,
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
  const text = getCommands();
  await ack();
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

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
