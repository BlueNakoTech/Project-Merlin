require('dotenv').config();

const {
    REST,
    Routes
} = require('discord.js');

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!'
    },
    {
        name: 'upload',
        description: 'Upload an EPUB book',

    }
];



const rest = new REST({
    version: '10'
}).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log('Commands registered.');
    } catch (error) {
        console.error(error);
    }
})();