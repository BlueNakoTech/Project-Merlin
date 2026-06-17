
require('dotenv').config({
    path:
        process.env.NODE_ENV === 'production'
            ? '.env.prod'
            : '.env.dev'
});

const fs = require('fs');
const path = require('path');
const selectMenuHandler =
    require('./handlers/selectMenuHandler');



const {
    Client,
    Collection,
    GatewayIntentBits,
    Events,
    MessageFlags
} = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath);

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(
    Events.InteractionCreate,
    async interaction => {

        try {

            if (
                interaction.isStringSelectMenu()
            ) {

                return selectMenuHandler(
                    interaction
                );



            }


            if (
                !interaction.isChatInputCommand()
            ) {
                return;
            }

            const command =
                client.commands.get(
                    interaction.commandName
                );

            if (!command) {
                return;
            }

            await command.execute(
                interaction
            );

        } catch (error) {

            console.error(error);

            const replyData = {

                content:
                    'Command failed.',

                flags:
                    MessageFlags.Ephemeral

            };

            if (
                interaction.replied ||
                interaction.deferred
            ) {

                await interaction.followUp(
                    replyData
                );

            } else {

                await interaction.reply(
                    replyData
                );

            }

        }

    }
);

client.login(process.env.DISCORD_TOKEN);