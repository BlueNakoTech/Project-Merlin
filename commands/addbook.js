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
                .setName('author')
                .setDescription('Book author')
                .setRequired(true))

        .addStringOption(option =>
            option
                .setName('url')
                .setDescription('Google Drive URL')
                .setRequired(true))

        .addStringOption(option =>
            option
                .setName('synopsis')
                .setDescription('Book synopsis')
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

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        try {

            const series =
                interaction.options.getString('series');

            const volume =
                interaction.options.getInteger('volume');

            const title =
                interaction.options.getString('title');

            const author =
                interaction.options.getString('author');

            const url =
                interaction.options.getString('url');

            const synopsis =
                interaction.options.getString('synopsis');

            const cover =
                interaction.options.getAttachment('cover');

            if (
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
                    coverUrl: cover.url,
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