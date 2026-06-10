const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require('discord.js');

const bookService =
    require('../services/bookservice');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('librarypanel')
        .setDescription(
            'Create Merlin Library Panel'
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const seriesList =
            await bookService.getSeriesList();
        const seriesCount =
            seriesList.length;

        if (
            seriesList.length === 0
        ) {

            return interaction.reply({
                content:
                    'No books found.',
                flags: MessageFlags.Ephemeral
            });

        }

        const menu =
            new StringSelectMenuBuilder()

                .setCustomId(
                    'series_select'
                )

                .setPlaceholder(
                    'Select a series'
                )

                .addOptions(

                    seriesList
                        .slice(0, 25)
                        .map(series => ({

                            label:
                                series,

                            value:
                                series

                        }))

                );

        const row =
            new ActionRowBuilder()
                .addComponents(
                    menu
                );

        const embed =
            new EmbedBuilder()

                .setTitle(
                    '📚 Merlin Archive'
                )

                .setDescription(
                    [
                        'Welcome to the digital shelves of Merlin Archive.',
                        '',
                        'Browse available series and select a title to begin reading.',
                        '',
                        '📖 EPUB Library',
                        '🔍 Organized by Series & Volume',
                        '☁️ Cloud Hosted Downloads'
                    ].join('\n')
                );
        await interaction.reply({

            embeds: [embed],

            components: [row]

        });

    }

};