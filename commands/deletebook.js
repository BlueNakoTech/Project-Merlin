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
                'deletebook'
            )

            .setDescription(
                'Delete a book'
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

        await bookService
            .deleteBook(
                bookId
            );

        await updateRecentSeries(
            interaction.client
        );

        await updateLibraryPanel(
            interaction.client
        );

        await interaction.reply({

            content:
                `✅ Deleted ${bookId}`

        });

    }

};