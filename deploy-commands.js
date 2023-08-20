// bot commands

import 'dotenv/config';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const commands = [
    // .setOptions
	new SlashCommandBuilder()
		.setName('upload')
		.setDescription('Upload your transcript/s! (currently only accepting PDFs and plain text files)'),
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