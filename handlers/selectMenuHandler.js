const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags
} = require('discord.js');

const bookService =
    require('../services/bookservice');

module.exports =
    async interaction => {

        // ======================
        // SERIES DROPDOWN
        // ======================

        if (
            interaction.customId ===
            'series_select'
        ) {

            const series =
                interaction.values[0];

            const books =
                await bookService.getVolumes(
                    series
                );

            if (!books.length) {

                return interaction.reply({
                    content:
                        'Series not found.',
                    flags: MessageFlags.Ephemeral
                });

            }

            function formatSynopsis(text) {

                const sentences =
                    text.split('. ');

                let result = '';

                for (let i = 0; i < sentences.length; i++) {

                    result += sentences[i];

                    if (!sentences[i].endsWith('.')) {
                        result += '.';
                    }

                    if ((i + 1) % 2 === 0) {
                        result += '\n\n';
                    } else {
                        result += ' ';
                    }

                }

                return result.trim();

            }

            // Use first volume as series info
            const seriesInfo =
                books[0];

            const synopsisPreview =
                formatSynopsis(
                    seriesInfo.synopsis ||
                    'No synopsis available.'
                );

            const volumeMenu =
                new StringSelectMenuBuilder()

                    .setCustomId(
                        'volume_select'
                    )

                    .setPlaceholder(
                        'Select a volume'
                    )

                    .addOptions(

                        books.map(book => ({

                            label:
                                `Volume ${book.volume}`,

                            value:
                                book.bookId

                        }))

                    );

            const dropdownRow =
                new ActionRowBuilder()
                    .addComponents(
                        volumeMenu
                    );

            const components =
                [dropdownRow];

            if (seriesInfo.novelUpdatesUrl) {

                const novelUpdatesButton =
                    new ButtonBuilder()

                        .setLabel(
                            'Novel Updates'
                        )

                        .setStyle(
                            ButtonStyle.Link
                        )

                        .setURL(
                            seriesInfo.novelUpdatesUrl
                        );



            }

            const embed =
                new EmbedBuilder()

                    .setTitle(
                        `📚 \\|\\| ${seriesInfo.series} \\|\\|`
                    )
                    .setURL(seriesInfo.novelUpdatesUrl)
                    .setDescription(
                        synopsisPreview)
                    .setThumbnail(
                        seriesInfo.coverUrl
                    )

                    .addFields(
                        {
                            name: '✍️ Author',
                            value: seriesInfo.author
                        },
                        {
                            name: '📚 Available Volumes',
                            value: String(books.length),
                            inline: true
                        },
                        {
                            name: '🔗 Links',
                            value: `[Novel Updates](${seriesInfo.novelUpdatesUrl})`
                        }

                    );



            return interaction.reply({

                embeds: [embed],

                components,

                flags: MessageFlags.Ephemeral
            });

        }

        // ======================
        // VOLUME DROPDOWN
        // ======================

        if (
            interaction.customId ===
            'volume_select'
        ) {

            const bookId =
                interaction.values[0];

            const book =
                await bookService.getBook(
                    bookId
                );

            // Get all volumes from same series
            const books =
                await bookService.getVolumes(
                    book.series
                );

            const volumeMenu =
                new StringSelectMenuBuilder()

                    .setCustomId(
                        'volume_select'
                    )

                    .setPlaceholder(
                        `Current: Volume ${book.volume}`
                    )

                    .addOptions(

                        books.map(volume => ({

                            label:
                                `Volume ${volume.volume}`,

                            value:
                                volume.bookId,

                            default:
                                volume.bookId ===
                                book.bookId

                        }))

                    );

            const downloadButton =
                new ButtonBuilder()

                    .setLabel(
                        `Download Volume ${book.volume}`
                    )

                    .setStyle(
                        ButtonStyle.Link
                    )

                    .setURL(
                        book.driveUrl
                    );

            const dropdownRow =
                new ActionRowBuilder()
                    .addComponents(
                        volumeMenu
                    );

            const buttonRow =
                new ActionRowBuilder()
                    .addComponents(
                        downloadButton
                    );

            const embed =
                new EmbedBuilder()

                    .setTitle(
                        `${book.series}`
                    )

                    .setDescription(
                        book.title ||
                        `Volume ${book.volume}`
                    )

                    .addFields(
                        {
                            name: 'Author',
                            value: book.author
                        }
                    )

                    .setImage(
                        book.coverUrl
                    );

            return interaction.update({

                embeds: [embed],

                components: (() => {

                    const rows = [];

                    // if (book.novelUpdatesUrl) {

                    //     rows.push(
                    //         new ActionRowBuilder()
                    //             .addComponents(
                    //                 new ButtonBuilder()
                    //                     .setLabel(
                    //                         'Novel Updates'
                    //                     )
                    //                     .setStyle(
                    //                         ButtonStyle.Link
                    //                     )

                    //             )
                    //     );

                    // }

                    rows.push(dropdownRow);
                    rows.push(buttonRow);

                    return rows;

                })()

            });

        }

    };