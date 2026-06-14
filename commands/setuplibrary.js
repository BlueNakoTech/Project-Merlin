const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags
} = require('discord.js');

const configService =
    require('../services/configservice');

module.exports = {

    data: new SlashCommandBuilder()

        .setName('setuplibrary')

        .setDescription(
            'Create library messages'
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        const channel =
            interaction.channel;

        const recentMessage =
            await channel.send({
                content:
                    '📚 Recent Series Loading...'
            });

        const libraryMessage =
            await channel.send({
                content:
                    '📚 Library Loading...'
            });

        await configService
            .saveLibraryMessages({

                channelId:
                    interaction.channel.id,

                recentMessageId:
                    recentMessage.id,

                libraryMessageId:
                    libraryMessage.id

            });
        await interaction.editReply({

            content:
                '✅ Library messages created.'

        });

        const updateRecentSeries =
            require('../utils/updateRecentSeriesPanel');

        const updateLibraryPanel =
            require('../utils/updateLibraryPanel');

        await updateRecentSeries(
            interaction.client
        );

        await updateLibraryPanel(
            interaction.client
        );
    }

};