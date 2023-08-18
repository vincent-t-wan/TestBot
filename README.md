# Development Steps
1. create bot.js
2. 'npm i g nodemon'
3. 'npm install --save discord.js dotenv nodemon'
4. 'npm init -y'
5. 'Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted'
6. run with 'nodemon --inspect bot.js
7. 'chrome://inspect/' on chrome
8. "open dedicated devtools for Node"


Tools:
- Node.js, nodemon, discord.js, chrome devtools, dotenv, 


'npm install @discordjs/builders @discordjs/rest discord-api-types'
- builders creates API-compatible JSON data for slash commands
- rest for sending slash commands
- types for endpoint routes

run 'node deploy-commands.js' to register application commands