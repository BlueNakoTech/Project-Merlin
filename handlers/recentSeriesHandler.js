const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const bookService =
    require('../services/bookservice');



module.exports =
    async interaction => {

        if (
            interaction.customId !==
            'recent_series_select'
        ) return;

        const series =
            interaction.values[0];

        const books =
            await bookService.getVolumes(
                series
            );

        if (!books.length) {
            return;
        }

        const seriesInfo =
            books[0];

        const embed =
            new EmbedBuilder()

                .setTitle(
                    `📚 ${seriesInfo.series}`
                )

                .setImage(
                    seriesInfo.coverUrl
                )

                .addFields(
                    {
                        name: 'Author',
                        value:
                            seriesInfo.author
                    },
                    {
                        name: 'Volumes',
                        value:
                            String(
                                books.length
                            ),
                        inline: true
                    },
                    {
                        name: 'Synopsis',
                        value:
                            seriesInfo.synopsis?.slice(
                                0,
                                1000
                            ) ||
                            'No synopsis.'
                    }
                );

        const rows = [];

        if (
            seriesInfo.novelUpdatesUrl
        ) {

            rows.push(

                new ActionRowBuilder()
                    .addComponents(

                        new ButtonBuilder()

                            .setLabel(
                                'Novel Updates'
                            )

                            .setStyle(
                                ButtonStyle.Link
                            )

                            .setURL(
                                seriesInfo.novelUpdatesUrl
                            )

                    )

            );

        }

        await interaction.reply({

            embeds: [embed],

            components: rows,

            ephemeral: true

        });

    };