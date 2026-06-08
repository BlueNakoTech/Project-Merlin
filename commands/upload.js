const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

const bookService =
    require('../services/bookservice');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('upload')
        .setDescription('Upload an EPUB book')

        .addStringOption(option =>
            option
                .setName('title')
                .setDescription('Book title')
                .setRequired(true))

        .addStringOption(option =>
            option
                .setName('author')
                .setDescription('Book author')
                .setRequired(true))

        .addAttachmentOption(option =>
            option
                .setName('file')
                .setDescription('EPUB file')
                .setRequired(true))

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        try {

            const title =
                interaction.options.getString('title');

            const author =
                interaction.options.getString('author');

            const attachment =
                interaction.options.getAttachment('file');

            if (
                !attachment.name
                    .toLowerCase()
                    .endsWith('.epub')
            ) {

                return interaction.reply({
                    content:
                        'Only EPUB files are allowed.',
                    flags: messageFlags.Ephemeral
                });

            }

            const archiveChannel =
                await interaction.client.channels.fetch(
                    process.env.ARCHIVE_CHANNEL_ID
                );

            const archiveMessage =
                await archiveChannel.send({
                    content:
                        `📚 ${title} - ${author}`,
                    files: [attachment.url]
                });

            const book =
                await bookService.uploadBook({
                    title,
                    author,
                    archiveMessage,
                    uploadedBy:
                        interaction.user.id
                });

            await interaction.reply({
                content:
                    `✅ Book uploaded.\nID: ${book.id}`,
                flags: messageFlags.Ephemeral

            });

        } catch (error) {

            console.error(error);

            await interaction.reply({
                content:
                    `❌ ${error.message}`,
                flags: messageFlags.Ephemeral
            });

        }

    }

};