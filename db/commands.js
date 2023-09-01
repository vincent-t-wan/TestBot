import { pool } from '../db/connect.js';
import AsciiTable from 'ascii-table/ascii-table.js';

// add student into database
export const addStudent = async (interaction, school, firstname, lastname, major) => {
    pool.getConnection()
        .then( conn => {
            console.log(conn)
            let query_major = major == null ? null : `'${major}'`
            let query = `INSERT INTO student VALUES ('${interaction.user.username}', '${school}', '${firstname}', '${lastname}', ${query_major})`
            console.log(query)
            conn.query(query)
                .then( () => {
                    interaction.reply('Successfully added student!')
                    return conn.end();
                }).catch( err => {
                    if (err.errno == 1062) {
                        interaction.reply(`Error adding student: Cannot add more than one student of the same university!`)
                    } else {
                        interaction.reply(`Error adding student: Insertion query failed!`)
                    }
                    conn.end();
                });
    }).catch(err => {
        interaction.reply(`Error adding student: Connection to database failed!`)
    });
}

// add course into database
export const addCourse = async (interaction, school, coursesymbol, coursenumber, coursename, grade) => {
    pool.getConnection()
        .then( conn => {
            console.log(conn)
            let query_coursesymbol = coursesymbol == null ? null : `'${coursesymbol}'`
            let query_coursenumber = coursenumber == null ? null : `'${coursenumber}'`
            let query = `INSERT INTO course VALUES ('${interaction.user.username}', '${school}', ${query_coursesymbol}, ${query_coursenumber}, '${coursename}', ${grade})`
            console.log(query)
            conn.query(query)
                .then( () => {
                    interaction.reply('Successfully added course!')
                    return conn.end();
                }).catch( err => {
                    console.log(err)
                    if (err.errno == 1452) {
                        interaction.reply(`Error adding course: The inputted school must be a school that you go to!`)
                    } else if (err.errno == 1062) {
                        interaction.reply(`Error adding course: Such a course is already in the database!`)
                    } else {
                        interaction.reply(`Error adding course: Insertion query failed!`)
                    }
                    conn.end();
                });
    }).catch(err => {
        interaction.reply(`Error adding course: Connection to database failed!`)
    });
}

// display profile of user
export const getProfileTable = async (interaction, usernames) => {
    let conn;
    let tables = [];
    try {
        conn = await pool.getConnection();
        for (const username of usernames) {
            console.log(username)
            let query_username = username == null ? null : `'${username}'`
            const res = await conn.query(`SELECT school, first_name, last_name, major FROM student WHERE username = ${query_username}`);
            try {
                const table = new AsciiTable().setHeading('First Name', 'Last Name', 'School', 'Major')
                for (var row of res) {
                    table.addRow(row.first_name, row.last_name, row.school, row.major)
                }
                console.log(res)
                console.log(table.toString())
                tables.push(table)           
            } catch {
                interaction.reply(`Error displaying profile: Failed to create table!`)
                return;
            }                
        }
    } catch (err) {
        interaction.reply(`Error displaying profile: Connection to database failed!`)
        return
    } finally {
        if (conn) conn.end();
        return tables;
    }
}

// display courses of user
export const getCourseTable = async (interaction, usernames) => {
    let conn
    let tables = [];
    try {
        conn = await pool.getConnection();
        for (const username of usernames) {
            let query_username = username == null ? null : `'${username}'`
            const res = await conn.query(`SELECT school, course_sym, course_num, course_name, grade FROM course WHERE username = ${query_username}`)
            try {
                const table = new AsciiTable().setHeading('Course Name', 'Course Symbol', 'Course Number', 'School', 'Grade')
                for (var row of res) {
                    table.addRow(row.course_name, row.course_sym, row.course_num, row.school, row.grade)
                }
                console.log(res)
                console.log(table.toString())
                tables.push(table)
            } catch {
                interaction.reply(`Error displaying courses: Failed to create table!`)
                return                
            }
        }
    } catch (err) {
        interaction.reply(`Error displaying courses: Connection to database failed!`)
    } finally {
        if (conn) conn.end();
        return tables;
    }
}

// get grades
export const getGrades = async (interaction, school, coursesymbol, coursenumber, coursename) => {
    let conn, res;
    try {
        let query_coursesymbol = coursesymbol == null ? `course_sym IS NULL` : `course_sym = '${coursesymbol.toUpperCase()}'`
        let query_coursenumber = coursenumber == null ? `course_num IS NULL` : `course_num = '${coursenumber}'`
        let query = `SELECT username, grade FROM course WHERE school = '${school}' AND ${query_coursesymbol} AND ${query_coursenumber} AND course_name = '${coursename}'`
        console.log(query)
        conn = await pool.getConnection();
        res = await conn.query(query)
    } catch (err) {
        interaction.reply(`Error getting grades: Connection to database failed!`)
    } finally {
        if (conn) conn.end();
        return res;
    }
}

// display both all grades and personal grades
export const getAllAndUserGrades = async (interaction) => {
    let conn, res;
    let responses = [];
    try {

        let query = `SELECT course_name, grade FROM course`;
        conn = await pool.getConnection();
        res = await conn.query(query);
        responses.push(res)

        let query_username = interaction.user.username == null ? null : `'${interaction.user.username}'`
        query = `SELECT course_name, grade FROM course WHERE username = ${query_username}`;
        res = await conn.query(query);
        responses.push(res)

    } catch (err) {
        interaction.reply(`Error getting grades: Connection to database failed!`)
    } finally {
        if (conn) conn.end();
        return responses;
    }
}

// display profile of user
export const getProfilesAndCourses = async (interaction, usernames) => {
    let conn;
    let responses = {};
    responses['profiles'] = []
    responses['courses'] = []
    try {
        conn = await pool.getConnection();
        for (const username of usernames) {
            let query_username = username == null ? null : `'${username}'`
            console.log(username)
            const res = await conn.query(`SELECT school, first_name, last_name, major FROM student WHERE username = ${query_username}`)
            responses['profiles'].push(res)
        }
        for (const username of usernames) {
            console.log(username)
            let query_username = username == null ? null : `'${username}'`
            const res = await conn.query(`SELECT school, course_sym, course_num, course_name, grade FROM course WHERE username = ${query_username}`)
            responses['courses'].push(res)
        }
    } catch (err) {
        interaction.reply(`Error getting profiles and courses: Connection to database failed!`)
    } finally {
        if (conn) conn.end();
        return responses;
    }
}
