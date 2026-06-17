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
                            'translator'
                        )
                        .setDescription(
                            'Translator or translation group'
                        )
            )

            .addStringOption(
                option =>
                    option
                        .setName(
                            'translator_url'
                        )
                        .setDescription(
                            'Translator website or social media'
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

        const translator =
            interaction.options.getString(
                'translator'
            );

        const translatorUrl =
            interaction.options.getString(
                'translator_url'
            );

        const driveUrl =
            interaction.options.getString(
                'url'
            );
        const cover =
            interaction.options.getAttachment(
                'cover'
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

        if (translator)
            updates.translator =
                translator;

        if (translatorUrl)
            updates.translatorUrl =
                translatorUrl;

        if (cover)
            updates.coverUrl =
                archiveMessage
                    .attachments
                    .first()
                    ?.url;

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

        if (
            updates.coverUrl ||
            updates.title ||
            updates.author ||
            updates.novelUpdatesUrl
        ) {

            await updateRecentSeries(
                interaction.client
            );

            await updateLibraryPanel(
                interaction.client
            );

        }

        await interaction.reply({

            content:
                `✅ Updated ${bookId}`

        });

    }

};