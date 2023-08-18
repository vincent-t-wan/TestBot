require('dotenv').config();
const Discord = require("discord.js");
const client = new Discord.Client({intents: ["Guilds", "GuildMessages", "MessageContent"]});
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})
client.on("messageCreate", msg => {
    console.log(msg)
  if (msg.content === "ping") {
    msg.reply("pong");
  }
})
console.log(client)
client.login(process.env.DISCORD_TOKEN);