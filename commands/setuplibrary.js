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
        if (
            !interaction.member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {

            return interaction.reply({

                content:
                    'Administrator required.',

                flags:
                    MessageFlags.Ephemeral

            });

        }

        // const existing =
        //     await configService
        //         .getLibraryMessages(
        //             interaction.guild.id
        //         );

        // if (existing) {

        //     return interaction.editReply({

        //         content:
        //             '❌ Library already configured.'

        //     });

        // }

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
            .saveLibraryMessages(

                interaction.guild.id,

                {

                    channelId:
                        interaction.channel.id,

                    recentMessageId:
                        recentMessage.id,

                    libraryMessageId:
                        libraryMessage.id

                }

            );


        await interaction.editReply({

            content:
                '✅ Library messages created.'

        });

        const updateRecentSeries =
            require('../utils/updateRecentSeriesPanel');

        const updateLibraryPanel =
            require('../utils/updateLibraryPanel');

        await updateRecentSeries(

            interaction.client,

            interaction.guild.id

        );

        await updateLibraryPanel(

            interaction.client,

            interaction.guild.id

        );
    }

};