const {
    SlashCommandBuilder,
    PermissionFlagsBits
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
                'editbook'
            )

            .setDescription(
                'Edit a book'
            )

            .addStringOption(
                option =>
                    option
                        .setName(
                            'bookid'
                        )
                        .setDescription(
                            'Book ID'
                        )
                        .setRequired(
                            true
                        )
            )

            .addStringOption(
                option =>
                    option
                        .setName(
                            'title'
                        )
                        .setDescription(
                            'New title'
                        )
            )

            .addStringOption(
                option =>
                    option
                        .setName(
                            'author'
                        )
                        .setDescription(
                            'New author'
                        )
            )

            .addStringOption(
                option =>
                    option
                        .setName(
                            'synopsis'
                        )
                        .setDescription(
                            'New synopsis'
                        )
            )

            .addStringOption(
                option =>
                    option
                        .setName(
                            'novelupdates'
                        )
                        .setDescription(
                            'Novel Updates URL'
                        )
            )

            .addStringOption(
                option =>
                    option
                        .setName(
                            'url'
                        )
                        .setDescription(
                            'Google Drive URL'
                        )
            )

            .addAttachmentOption(
                option =>
                    option
                        .setName(
                            'cover'
                        )
                        .setDescription(
                            'New cover'
                        )
            )

            .setDefaultMemberPermissions(
                PermissionFlagsBits.Administrator
            ),

    async execute(
        interaction
    ) {

        const bookId =
            interaction.options.getString(
                'bookid'
            );

        const updates =
            {};

        const title =
            interaction.options.getString(
                'title'
            );

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

        const driveUrl =
            interaction.options.getString(
                'url'
            );

        if (title)
            updates.title =
                title;

        if (author)
            updates.author =
                author;

        if (synopsis)
            updates.synopsis =
                synopsis;

        if (novelUpdatesUrl)
            updates.novelUpdatesUrl =
                novelUpdatesUrl;

        if (driveUrl)
            updates.driveUrl =
                driveUrl;

        if (
            Object.keys(
                updates
            ).length === 0
        ) {

            return interaction.reply({

                content:
                    'Nothing to update.'

            });

        }

        await bookService
            .updateBook(
                bookId,
                updates
            );

        await updateRecentSeries(
            interaction.client
        );

        await updateLibraryPanel(
            interaction.client
        );

        await interaction.reply({

            content:
                `✅ Updated ${bookId}`

        });

    }

};