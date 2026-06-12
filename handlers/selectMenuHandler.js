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

            // Use first volume as series info
            const seriesInfo =
                books[0];

            const synopsisPreview =
                seriesInfo.synopsis?.length > 300
                    ? seriesInfo.synopsis.slice(0, 300) + '...'
                    : seriesInfo.synopsis || 'No synopsis available.';

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

            const row =
                new ActionRowBuilder()
                    .addComponents(
                        volumeMenu
                    );

            const embed =
                new EmbedBuilder()

                    .setTitle(
                        `📚 ${seriesInfo.series}`
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
                            name: '📖 Synopsis',
                            value: synopsisPreview
                        }
                    )

                    .setImage(
                        seriesInfo.coverUrl
                    );

            return interaction.reply({

                embeds: [embed],

                components: [row],

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
                        `${book.series} - Volume ${book.volume}`
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

                components: [
                    dropdownRow,
                    buttonRow
                ]

            });

        }

    };