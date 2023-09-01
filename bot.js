import 'dotenv/config';
import Discord from "discord.js";
import { addStudent, addCourse, getProfileTable, getCourseTable, getGrades, getAllAndUserGrades, getProfilesAndCourses } from './db/commands.js';
import fs from 'fs';
import { average, median, sd } from './utilities.js';
import * as dfd from 'danfojs-node';
import { spawn } from 'child_process';
import AsciiTable from 'ascii-table';
const client = new Discord.Client({intents: ["Guilds", "GuildMessages", "MessageContent"]});
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

// on slash command sent by user
client.on("interactionCreate", async interaction => {
    console.log(interaction)
    if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'add-student') {
        const firstname = interaction.options.getString('firstname')
        const lastname = interaction.options.getString('lastname')
        const school = interaction.options.getString('school')
        const major = interaction.options.getString('major')

        // add student into database
        try {
            if (firstname == null) {
                throw new Error("first name not specified.");
            }
            if (lastname == null) {
                throw new Error("last name not specified.");
            }
            if (school == null) {
                throw new Error("school not specified.");
            }
            // note there's no varchar checking size limit
            await addStudent(interaction, school, firstname, lastname, major);

        } catch (err) {
            await interaction.reply(`Error adding course: ${err.message}`);
        }

	} else if (commandName === 'add-course') {
        const school = interaction.options.getString('school')
        const coursesymbol = interaction.options.getString('coursesymbol')
        const coursenumber = interaction.options.getInteger('coursenumber')
        const coursename = interaction.options.getString('coursename')
        const grade = interaction.options.getNumber('grade')

        // add course into database
        try {
            if (school == null) {
                throw new Error("school not specified.");
            }
            if (coursename == null) {
                throw new Error("course name not specified.");
            }
            if (grade < 0 || grade > 100) {
                throw new Error("grade must be between 0 and 100.");
            }
            if (coursenumber < 0) {
                throw new Error("course number must be at least 0.");
            }

            await addCourse(interaction, school, coursesymbol, coursenumber, coursename, grade);
        } catch (err) {
            await interaction.reply(`Error adding course: ${err.message}`);
        }

	} else if (commandName === 'display-user') {
        const type = interaction.options.getString('type')
        const format = interaction.options.getString('format')
        switch(type) {
            case 'profile':
                try {
                    // to do: maybe do the table formatting on this side as opposed to the commands side.
                    await getProfileTable(interaction, [interaction.user.username]).then(response => {
                        const table = response[0]
                        if (table) {
                            console.log(format)
                            try {
                                switch(format) {
                                    case 'txt':
                                        fs.writeFileSync('profile.txt', `${table.toString()}`);
                                        // file written successfully
                                        interaction.reply({files: [{
                                            attachment: './profile.txt',
                                            name: 'profile.txt'
                                        }], ephemeral: false}).then(() => {
                                            fs.unlink('./profile.txt', (err) => {
                                                if (err) throw err;
                                                console.log('./profile.txt was deleted');
                                            });
                                        });
                                        break;
                                    case 'json':
                                        fs.writeFileSync('profile.json', JSON.stringify(table.toJSON(), null, 2));
                                        // file written successfully
                                        interaction.reply({files: [{
                                            attachment: './profile.json',
                                            name: 'profile.json'
                                        }], ephemeral: false}).then(() => {
                                            fs.unlink('./profile.json', (err) => {
                                                if (err) throw err;
                                                console.log('./profile.json was deleted');
                                            });
                                        });
                                        break;
                                    case 'csv':
                                        let df = new dfd.DataFrame(table.toJSON().rows, { columns: table.toJSON().heading });
                                        dfd.toCSV(df, { filePath: './profile.csv' });
                                        // file written successfully
                                        interaction.reply({files: [{
                                            attachment: './profile.csv',
                                            name: 'profile.csv'
                                        }], ephemeral: false}).then(() => {
                                            fs.unlink('./profile.csv', (err) => {
                                                if (err) throw err;
                                                console.log('./profile.csv was deleted');
                                            });
                                        });
                                        break;
                                    default:
                                }
                            } catch {
                                throw new Error("data cannot be written to a file!")
                            }
                        } else {
                            throw new Error("query failed!");
                        }
                    });
                } catch (err) {
                    await interaction.reply(`Error displaying profile: ${err.message}`);          
                }
                break;
            case 'courses':
                try {
                    await getCourseTable(interaction, [interaction.user.username]).then(response => {
                        const table = response[0]
                        if (table) {
                            try {
                                switch(format) {
                                    case 'txt':
                                        fs.writeFileSync('course.txt', `${table.toString()}`);
                                        // file written successfully
                                        interaction.reply({files: [{
                                            attachment: './course.txt',
                                            name: 'course.txt'
                                        }], ephemeral: false}).then(() => {
                                            fs.unlink('./course.txt', (err) => {
                                                if (err) throw err;
                                                console.log('./course.txt was deleted');
                                            });
                                        });
                                        break;
                                    case 'json':
                                        fs.writeFileSync('course.json', JSON.stringify(table.toJSON(), null, 2));
                                        // file written successfully
                                        interaction.reply({files: [{
                                            attachment: './course.json',
                                            name: 'course.json'
                                        }], ephemeral: false}).then(() => {
                                            fs.unlink('./course.json', (err) => {
                                                if (err) throw err;
                                                console.log('./course.json was deleted');
                                            });
                                        });
                                        break;
                                    case 'csv':
                                        let df = new dfd.DataFrame(table.toJSON().rows, { columns: table.toJSON().heading });
                                        dfd.toCSV(df, { filePath: './course.csv' });
                                        // file written successfully
                                        interaction.reply({files: [{
                                            attachment: './course.csv',
                                            name: 'course.csv'
                                        }], ephemeral: false}).then(() => {
                                            fs.unlink('./course.csv', (err) => {
                                                if (err) throw err;
                                                console.log('./course.csv was deleted');
                                            });
                                        });
                                        break;
                                    default:
                                }
                            } catch {
                                throw new Error("data cannot be written to a file!")
                            }
                        } else {
                            throw new Error("query failed!");
                        }
                    });
                } catch (err) {
                    await interaction.reply(`Error displaying courses: ${err.message}`);             
                }
                break;
            default:
          }
	} else if (commandName === 'display-statistics') {
        const type = interaction.options.getString('type')
        const format = interaction.options.getString('format')
        const school = interaction.options.getString('school')
        const coursename = interaction.options.getString('coursename')
        const coursesymbol = interaction.options.getString('coursesymbol')
        const coursenumber = interaction.options.getString('coursenumber')
        switch(type) {
            case 'grades':
                try {
                    await getGrades(interaction, school, coursesymbol, coursenumber, coursename).then(response => {
                        console.log(response)
                        if (response.length != 0) {
                            switch(format) {
                                case 'boxplot':
                                    const boxplotProcess = spawn('python', 
                                        [
                                            '-u',
                                            './grapher/graph.py', 
                                            JSON.stringify(response.filter(row => (row.grade != null)).map(row => row.grade)),
                                            'boxplot',
                                            coursename,
                                        ]
                                    );

                                    boxplotProcess.on('error', (err) => {
                                        throw new Error("plot cannot be created!");
                                    });
                                    
                                    boxplotProcess.stderr.on('data', (data) => {
                                        throw new Error("plot cannot be created!");
                                    });
                                    
                                    boxplotProcess.on('close', (code) => {
                                        if (code == 0) {
                                            try {
                                                interaction.reply({files: [{
                                                    attachment: './graph.png',
                                                    name: 'graph.png'
                                                }], ephemeral: false}).then(() => {
                                                    fs.unlink('./graph.png', (err) => {
                                                        if (err) throw err;
                                                        console.log('./graph.png was deleted');
                                                    });
                                                });
                                            } catch {
                                                throw new Error("plot cannot be created!");
                                            }
                                        } else {
                                            throw new Error("plot cannot be created!");
                                        }                                        
                                    });

                                    break;
                                case 'histogram':
                                    const histogramProcess = spawn('python', 
                                        [
                                            '-u',
                                            './grapher/graph.py', 
                                            JSON.stringify(response.filter(row => (row.grade != null)).map(row => row.grade)),
                                            'histogram',
                                            coursename,
                                        ]
                                    );
                                    
                                    histogramProcess.on('error', (err) => {
                                        throw new Error("plot cannot be created!");
                                    });
                                    
                                    histogramProcess.stderr.on('data', (data) => {
                                        throw new Error("plot cannot be created!");
                                    });
                                     
                                    histogramProcess.on('close', (code) => {
                                        if (code == 0) {
                                            try {
                                                interaction.reply({files: [{
                                                    attachment: './graph.png',
                                                    name: 'graph.png'
                                                }], ephemeral: false}).then(() => {
                                                    fs.unlink('./graph.png', (err) => {
                                                        if (err) throw err;
                                                        console.log('./graph.png was deleted');
                                                    });
                                                });
                                            } catch {
                                                throw new Error("plot cannot be created!");
                                            }
                                        } else {
                                            throw new Error("plot cannot be created!");
                                        }
                                    });
                                    break;
                                default:
                            }
                        } else {
                            throw new Error("no grades exist with the given inputs.");
                        }
                    });
                } catch (err) {
                    // issue: error queries (i.e. ones that are dupes or sql errors still successful and no catch...)
                    await interaction.reply(`Error displaying grades: ${err.message}`);              
                }
                break;
            default:
        }
	} else if (commandName === 'should-i-take') {
        const coursename = interaction.options.getString('coursename')
        try {
            await getAllAndUserGrades(interaction).then(response => {
                console.log(response)
                if (response[0].length != 0 && response[1].length != 0) {
                    interaction.reply('generating prediction...').then(msg => {
                        let predictAll, predictUser;
                        const pythonProcessAll = spawn('python', 
                            [
                                '-u',
                                './classifier/train.py', 
                                JSON.stringify(response[0].filter(row => (row.grade != null)).map(row => row.course_name)), 
                                JSON.stringify(response[0].filter(row => (row.grade != null)).map(row => row.grade)), coursename
                            ]
                        );
                              
                        pythonProcessAll.on('error', (err) => {
                            throw new Error("failed to train model!");
                        });
                          
                        pythonProcessAll.stderr.on('data', (data) => {
                            console.error(`stderr: ${data}`);
                        });
                        
                        pythonProcessAll.stdout.on('data', (data) => {
                            predictAll = data.toString('utf8')
                            console.log(predictAll)
                            const pythonProcessUser = spawn('python', 
                            [
                                '-u',
                                './classifier/train.py', 
                                JSON.stringify(response[1].filter(row => (row.grade != null)).map(row => row.course_name)), 
                                JSON.stringify(response[1].filter(row => (row.grade != null)).map(row => row.grade)), coursename
                            ])

                            pythonProcessUser.on('error', (err) => {
                                throw new Error("failed to train model!");
                            });
                            
                            pythonProcessUser.stderr.on('data', (data) => {
                                console.error(`stderr: ${data}`);
                            });
                            
                            pythonProcessUser.stdout.on('data', (data) => {
                                predictUser = data.toString('utf8')
                                console.log(predictUser)
                                const avgGradeUser = average(response[1].filter(course => (course.grade != null)).map(course => course.grade))
                                const avgGradeEveryone = average(response[0].filter(course => (course.grade != null)).map(course => course.grade))
                                let predictUserWithContext = Number(((predictUser / predictAll) * avgGradeEveryone).toFixed(2))
                                if (predictUserWithContext > 100) {
                                    predictUserWithContext = 100
                                }
                                console.log(avgGradeUser, avgGradeEveryone, predictUserWithContext)
                                if (predictUserWithContext >= avgGradeUser) {
                                    interaction.editReply(`Your predicted grade on ${coursename} is ${predictUserWithContext}!\nConsidering that your average grade is ${avgGradeUser}, you should take this course!`)
                                } else {
                                    interaction.editReply(`Your predicted grade on ${coursename} is ${predictUserWithContext}!\nConsidering that your average grade is ${avgGradeUser}, you should not take this course!`)
                                }
                            });
                        });
                    }); 
                } else {
                    throw new Error("cannot predict since the user has no grades.");
                }
            });
        } catch (err) {
            await interaction.reply(`Error predicting grades: ${err.message}`);              
        }
	} else if (commandName === 'compare') {
        const studentdiscordname = interaction.options.getString('studentdiscordname')
        try {
            // compare arbitrary amounts of students (to-do)
            await getProfilesAndCourses(interaction, [interaction.user.username, studentdiscordname]).then(response => {
                console.log(response)
                if (response['profiles'][0].length == 0) throw new Error("you are not registered as a student.");
                if (response['profiles'][1].length == 0) throw new Error("inputted user is not registered as a student.");     
                const averageGrades = response['courses'].map(user => {
                    if (user.filter(course => (course.grade != null)).length != 0)
                        return average(user.filter(course => (course.grade != null)).map(course => course.grade))
                    else 
                        return null
                })
                const medianGrades = response['courses'].map(user => {
                    if (user.filter(course => (course.grade != null)).length != 0)
                        return median(user.filter(course => (course.grade != null)).map(course => course.grade))
                    else 
                        return null 
                })
                const sdGrades = response['courses'].map(user => {
                    if (user.filter(course => (course.grade != null)).length != 0)
                        return sd(user.filter(course => (course.grade != null)).map(course => course.grade))
                    else 
                        return null 
                })

                // create table
                const numCoursesTaken = response['courses'].map(user => user.length)
                const numCoursesFinished = response['courses'].map(user => user.filter(course => (course.grade != null)).length)
                const schools = response['profiles'].map(user => user.map(student => student.school))
                const majors = response['profiles'].map(user => user.filter(student => (student.major != null)).map(student => student.major))

                const matchingCourses = response['courses'][0].filter(course_1 => response['courses'][1].some(course_2 => (course_2.school === course_1.school && course_2.course_sym === course_1.course_sym && course_2.course_num === course_1.course_num && course_2.course_name === course_1.course_name)));
                const matchingGrades = matchingCourses.map(course => course.grade)
                const matchingCourseSym = matchingCourses.map(course => course.course_sym)
                const matchingCourseNum = matchingCourses.map(course => course.course_num)
                const matchingCourseName = matchingCourses.map(course => course.course_name)
                const matchingSchool = matchingCourses.map(course => course.school)
                const matchingStatisticsString = () => {
                    var string = ''
                    for (var i = 0; i < matchingCourses.length; ++i) {
                        string += '- ';
                        string += matchingCourseName[i];
                        if (matchingCourseSym[i] && matchingCourseNum[i]) string += ` (${matchingCourseSym[i]} ${matchingCourseNum[i]})`
                        string += ' at '
                        string += matchingSchool[i]
                        string += ` (${matchingGrades[0]} (${interaction.user.username}) vs. ${matchingGrades[0]} (${studentdiscordname}))`
                        if (i < matchingCourses.length - 1) string += '\n'
                    }
                    return string
                }
                // to-do: maybe match similar courses taken using ai/bert encoding of strings and cosine similarity
                console.log(matchingCourses)
                try {
                    const table = new AsciiTable().setHeading('', `${interaction.user.username} (You)`, `${studentdiscordname}`)
                    table.addRow('Average Grade', averageGrades[0], averageGrades[1])
                    table.addRow('Median Grade', medianGrades[0], medianGrades[1])
                    table.addRow('Standard Deviation Grade', Number(sdGrades[0].toFixed(2)), Number(sdGrades[1].toFixed(2))) 
                    table.addRow('Number of Courses Taken', numCoursesTaken[0], numCoursesTaken[1])
                    table.addRow('Number of Courses Finished', numCoursesFinished[0], numCoursesFinished[1])
                    table.addRow('Schools', schools[0].toString(), schools[1].toString())
                    table.addRow('Majors', majors[0].toString(), majors[1].toString())
                } catch {
                    throw new Error(`failed to create table!`);
                }

                try {
                    fs.writeFileSync('comparison.txt', `${table.toString()}\nMatching Courses:\n${matchingStatisticsString()}`);
                    // file written successfully
                    interaction.reply({files: [{
                        attachment: './comparison.txt',
                        name: 'comparison.txt'
                    }], ephemeral: false}).then(() => {
                        fs.unlink('./comparison.txt', (err) => {
                            if (err) throw err;
                            console.log('./comparison.txt was deleted');
                        });
                    });
                } catch {
                    throw new Error("data cannot be written to a file!")
                }
            });
        } catch (err) {
            await interaction.reply(`Error comparing student: ${err.message}`);                   
        }
	}
});

console.log(client)
client.login(process.env.DISCORD_TOKEN);