const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

const bookService =
    require('../services/bookservice');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('book')
        .setDescription('View a book')

        .addStringOption(option =>
            option
                .setName('id')
                .setDescription('Book ID')
                .setRequired(true)
        ),

    async execute(interaction) {

        try {

            const bookId =
                interaction.options.getString('id');

            const book =
                await bookService.getBook(
                    bookId
                );

            const embed =
                new EmbedBuilder()

                    .setTitle(
                        `${book.title}`
                    )

                    .setDescription(
                        book.synopsis
                    )

                    .addFields(
                        {
                            name: 'Author',
                            value: book.author,
                            inline: true
                        },
                        {
                            name: 'Book ID',
                            value: book.bookId,
                            inline: true
                        }
                    )

                    .setImage(
                        book.coverUrl
                    )

                    .setFooter({
                        text:
                            'Project Merlin'
                    });

            await interaction.reply({

                embeds: [embed],

                content:
                    `📥 Download:\n${book.driveUrl}`

            });

        } catch (error) {

            console.error(error);

            await interaction.reply({

                content:
                    `❌ ${error.message}`,

                ephemeral: true

            });

        }

    }

};