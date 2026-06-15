const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags
} = require('discord.js');

const bookService =
    require('../services/bookservice');

const updateRecentSeries =
    require('../utils/updateRecentSeriesPanel');

const updateLibraryPanel =
    require('../utils/updateLibraryPanel');

module.exports = {

    data:
        new SlashCommandBuilder()

            .setName(
                'editseries'
            )

            .setDescription(
                'Edit an entire series'
            )

            .addStringOption(option =>
                option
                    .setName(
                        'bookid'
                    )
                    .setDescription(
                        'Any book ID from the series'
                    )
                    .setRequired(true)
            )

            .addStringOption(option =>
                option
                    .setName(
                        'author'
                    )
                    .setDescription(
                        'New author'
                    )
            )

            .addStringOption(option =>
                option
                    .setName(
                        'synopsis'
                    )
                    .setDescription(
                        'New synopsis'
                    )
            )

            .addStringOption(option =>
                option
                    .setName(
                        'novelupdates'
                    )
                    .setDescription(
                        'New Novel Updates URL'
                    )
            )

            .setDefaultMemberPermissions(
                PermissionFlagsBits.Administrator
            ),

    async execute(
        interaction
    ) {

        await interaction.deferReply({

            flags:
                MessageFlags.Ephemeral

        });

        try {

            const bookId =
                interaction.options.getString(
                    'bookid'
                );

            const book =
                await bookService.getBook(
                    bookId
                );

            if (!book) {

                return interaction.editReply({

                    content:
                        '❌ Book not found.'

                });

            }

            const updates =
                {};

            const author =
                interaction.options.getString(
                    'author'
                );

            const synopsis =
                interaction.options.getString(
                    'synopsis'
                );

            const novelUpdatesUrl =
                interaction.options.getString(
                    'novelupdates'
                );

            if (author) {
                updates.author =
                    author;
            }

            if (synopsis) {
                updates.synopsis =
                    synopsis;
            }

            if (novelUpdatesUrl) {
                updates.novelUpdatesUrl =
                    novelUpdatesUrl;
            }

            if (
                Object.keys(
                    updates
                ).length === 0
            ) {

                return interaction.editReply({

                    content:
                        '❌ Nothing to update.'

                });

            }

            await bookService
                .updateSeries(
                    book.series,
                    updates
                );

            await updateRecentSeries(
                interaction.client
            );

            await updateLibraryPanel(
                interaction.client
            );

            await interaction.editReply({

                content:
                    `✅ Updated series "${book.series}"`

            });

        } catch (error) {

            console.error(error);

            await interaction.editReply({

                content:
                    `❌ ${error.message}`

            });

        }

    }

};