import mariadb from 'mariadb';

export const pool = mariadb.createPool({
	host: 'raspberrypi',
	user: 'user',
	password: '!qazxsw2',
	connectionLimit: 5,
	database: 'gradeanalyzer'
});