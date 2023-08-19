// bot commands

require('dotenv').config();
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
    // .setOptions
	new SlashCommandBuilder()
		.setName('upload')
		.setDescription('Upload your transcript!'),
	new SlashCommandBuilder()
		.setName('display')
		.setDescription('Display statistics!')
		.addStringOption(option => option
									.setRequired(true)
									.setName('type')
									.setDescription('Specify what statistic to display!')
									.addChoices(
										{ name: 'grades', value: 'grades' },
										{ name: 'classes', value: 'classes' },
									)
									),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

// sends the commands to the interactions endpoint url?
rest.put(Routes.applicationCommands(process.env.APP_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);