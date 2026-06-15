require('dotenv').config({
    path: '.env.prod'
});

const {
    REST,
    Routes
} = require('discord.js');

const command =
    require('./commands/setuplibrary');

const rest =
    new REST({
        version: '10'
    }).setToken(
        process.env.DISCORD_TOKEN
    );

(async () => {

    const result =
        await rest.put(
            Routes.applicationCommands(
                process.env.CLIENT_ID
            ),
            {
                body: [
                    command.data.toJSON()
                ]
            }
        );

    console.log(result);

    console.log(
        '✅ Public command deployed'
    );

})();