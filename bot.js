import 'dotenv/config';
import Discord from "discord.js";
import fetch from 'node-fetch';
const client = new Discord.Client({intents: ["Guilds", "GuildMessages", "MessageContent"]});
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

let listeningClient = null

// on message sent by user
client.on("messageCreate", async msg => {
    console.log(msg)
    if (msg.content === "ping") {
        await msg.reply("pong");
    }
    if (listeningClient && listeningClient == msg.author.id)
        if (msg.attachments.size > 0) {
            listeningClient = null
            msg.reply('parsing file/s...');
            console.log(msg.attachments.keys())
            for (var index = 0; index < msg.attachments.size; ++index) {

                let url = msg.attachments.at(index).attachment;

                if (!url) {
                    console.log('no file url found for file ', index);
                    continue;
                }

                try {

                    const response = await fetch(url);
                    if (!response.ok) {
                        msg.reply(
                            'there was an error with fetching file ' + index + ': ' + response.statustext
                        );
                        continue;
                    }

                    const text = await response.text();

                    if (text) {
                        msg.reply(text);
                    }

                } catch (error) {
                    console.log(error);
                    continue;
                }
            }
            msg.reply('completed parsing files!');

            // TO-DO: add different messages depending on errors/issues/situations
        } else {
            msg.reply('message is not a file. upload process cancelled.');
            listeningClient = null
        }
    })

// on slash command sent by user
client.on("interactionCreate", async interaction => {
    console.log(interaction)
    if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'upload') {
		await interaction.reply('now listening for your uploads! send the file now...');
        listeningClient = interaction.user.id
	} else if (commandName === 'display') {
        type = interaction.options.getString('type')
        switch(type) {
            case 'grades':
                await interaction.reply('displaying grades...');
                break;
            case 'classes':
                await interaction.reply('displaying classes...');
                break;
            default:
          }
	}

});

console.log(client)
client.login(process.env.DISCORD_TOKEN);