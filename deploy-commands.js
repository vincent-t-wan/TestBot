import 'dotenv/config';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const commands = [
	new SlashCommandBuilder()
		.setName('add-student')
		.setDescription('Add your student info!')
		.addStringOption(option => option
			.setRequired(true)
			.setName('firstname')
			.setDescription('Enter your first name!'))
		.addStringOption(option => option
			.setRequired(true)
			.setName('lastname')
			.setDescription('Enter your last name!'))
		.addStringOption(option => option
			.setRequired(true)
			.setName('school')
			.setDescription('Enter your school!'))
		.addStringOption(option => option
			.setRequired(false)
			.setName('major')
			.setDescription('Enter your major!')),
	new SlashCommandBuilder()
		.setName('add-course')
		.setDescription('Add a course!')
		.addStringOption(option => option
			.setRequired(true)
			.setName('school')
			.setDescription('Enter your school!'))
		.addStringOption(option => option
			.setRequired(true)
			.setName('coursename')
			.setDescription('Enter the course name!'))
		.addNumberOption(option => option
			.setRequired(false)
			.setMinValue(0)
			.setMaxValue(100)
			.setName('grade')
			.setDescription('Enter your grade! Fill it blank if the grade isn\'t finalized yet.'))
		.addStringOption(option => option
			.setRequired(false)
			.setName('coursesymbol')
			.setDescription('Enter the course symbol! Fill it blank it does not apply to you.'))
		.addIntegerOption(option => option
			.setRequired(false)
			.setMinValue(0)
			.setName('coursenumber')
			.setDescription('Enter the course number! Fill it blank it does not apply to you.')),
	new SlashCommandBuilder()
		.setName('display-user')
		.setDescription('Display User information!')
		.addStringOption(option => option
			.setRequired(true)
			.setName('type')
			.setDescription('Specify what user information to display!')
			.addChoices(
				{ name: 'profile', value: 'profile' },
				{ name: 'courses', value: 'courses' },))
		.addStringOption(option => option
			.setRequired(true)
			.setName('format')
			.setDescription('Specify the format of the information!')
			.addChoices(
				{ name: 'txt', value: 'txt' },
				{ name: 'json', value: 'json' },
				{ name: 'csv', value: 'csv' },)),
	new SlashCommandBuilder()
		.setName('display-statistics')
		.setDescription('Display Statistics!')
		.addStringOption(option => option
			.setRequired(true)
			.setName('type')
			.setDescription('Specify what statistic to display!')
			.addChoices(
				{ name: 'grades', value: 'grades' },))
		.addStringOption(option => option
			.setRequired(true)
			.setName('format')
			.setDescription('Specify the format!')
			.addChoices(
				{ name: 'boxplot', value: 'boxplot' },
				{ name: 'histogram', value: 'histogram' }))
		.addStringOption(option => option
			.setRequired(true)
			.setName('school')
			.setDescription('Specify school!'))
		.addStringOption(option => option
			.setRequired(true)
			.setName('coursename')
			.setDescription('Specify course name!'))
		.addStringOption(option => option
			.setRequired(false)
			.setName('coursesymbol')
			.setDescription('Specify course symbol!'))
		.addStringOption(option => option
			.setRequired(false)
			.setName('coursenumber')
			.setDescription('Specify course number!')),
	new SlashCommandBuilder()
		.setName('should-i-take')
		.setDescription('Tells you whether you should take the course!')
		.addStringOption(option => option
			.setRequired(true)
			.setName('coursename')
			.setDescription('Specify course name!')),
	// new SlashCommandBuilder()
	// 	.setName('predict-graduation-grade')
	// 	.setDescription('Predicts your graduation grade!')
	// 	.addStringOption(option => option
	// 		.setRequired(true)
	// 		.setName('startingyear')
	// 		.setDescription('Specify starting year!'))
	// 	.addStringOption(option => option
	// 		.setRequired(true)
	// 		.setName('endingyear')
	// 		.setDescription('Specify ending year!')),
	// new SlashCommandBuilder()
	// 	.setName('recommend-courses')
	// 	.setDescription('Recommends a course!'),
	new SlashCommandBuilder()
		.setName('compare')
		.setDescription('Compare grades with other students!')
		.addStringOption(option => option
			.setRequired(true)
			.setName('studentdiscordname')
			.setDescription('Specify other student\'s Discord username! (CASE SENSITIVE)')),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationCommands(process.env.APP_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);