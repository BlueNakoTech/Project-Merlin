const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags
} = require('discord.js');

const bookService =
    require('../services/bookservice');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('addbook')
        .setDescription('Add a book')

        .addStringOption(option =>
            option
                .setName('series')
                .setDescription('Series name')
                .setRequired(true))

        .addIntegerOption(option =>
            option
                .setName('volume')
                .setDescription('Volume number')
                .setRequired(true))

        .addStringOption(option =>
            option
                .setName('url')
                .setDescription('Google Drive URL')
                .setRequired(true))

        .addAttachmentOption(option =>
            option
                .setName('cover')
                .setDescription('Book cover image')
                .setRequired(true))

        .addStringOption(option =>
            option
                .setName('title')
                .setDescription('Volume title')
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName('synopsis')
                .setDescription('Book synopsis')
                .setRequired(false))

        .addStringOption(option =>
            option
                .setName('author')
                .setDescription('Book author')
                .setRequired(false))


        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        try {

            const series =
                interaction.options.getString('series');

            const volume =
                interaction.options.getInteger('volume');

            let title =
                interaction.options.getString('title');

            let author =
                interaction.options.getString('author');

            const url =
                interaction.options.getString('url');

            let synopsis =
                interaction.options.getString('synopsis');

            let cover =
                interaction.options.getAttachment('cover');

            if (volume === 1) {

                if (!author) {
                    throw new Error(
                        'Author is required for Volume 1.'
                    );
                }

                if (!synopsis) {
                    throw new Error(
                        'Synopsis is required for Volume 1.'
                    );
                }

                if (!cover) {
                    throw new Error(
                        'Cover image is required for Volume 1.'
                    );
                }

            } else {

                const seriesInfo =
                    await bookService.getSeriesInfo(
                        series
                    );

                if (!seriesInfo) {

                    throw new Error(
                        `Volume 1 of "${series}" must exist first.`
                    );

                }

                author =
                    seriesInfo.author;

                synopsis =
                    seriesInfo.synopsis;

                if (!title) {

                    title =
                        `Volume ${volume}`;

                }

            }


            if (
                cover &&
                !cover.contentType?.startsWith(
                    'image/'
                )
            ) {
                throw new Error(
                    'Cover must be an image.'
                );
            }

            const book =

                await bookService.addBook({
                    series,
                    volume,
                    title,
                    author,
                    synopsis,
                    url,
                    coverUrl:
                        cover?.url ||
                        (
                            await bookService.getSeriesInfo(
                                series
                            )
                        ).coverUrl,
                    uploadedBy: interaction.user.id
                });

            await interaction.reply({

                content:
                    `✅ Book Added\n\n` +
                    `ID: ${book.bookId}\n` +
                    `Title: ${book.title}\n` +
                    `Author: ${book.author}`,

                flags:
                    MessageFlags.Ephemeral

            });

        } catch (error) {

            console.error(error);

            await interaction.reply({

                content:
                    `❌ ${error.message}`,

                flags:
                    MessageFlags.Ephemeral

            });

        }

    }

};