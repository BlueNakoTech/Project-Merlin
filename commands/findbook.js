const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    MessageFlags
} = require('discord.js');

const db =
    require('../firebase/firestore');

module.exports = {

    data:
        new SlashCommandBuilder()

            .setName('findbook')

            .setDescription(
                'Find books by keyword'
            )

            .addStringOption(option =>
                option
                    .setName('query')
                    .setDescription(
                        'Series keyword'
                    )
                    .setRequired(true)
            )

            .setDefaultMemberPermissions(
                PermissionFlagsBits.Administrator
            ),

    async execute(
        interaction
    ) {

        const query =
            interaction.options
                .getString('query')
                .toLowerCase();

        const snapshot =
            await db
                .collection('books')
                .get();

        const books =
            snapshot.docs
                .map(doc => doc.data());

        const matchingBooks =
            books.filter(book =>

                book.series
                    ?.toLowerCase()
                    .includes(query)

            );

        if (
            matchingBooks.length === 0
        ) {

            return interaction.reply({

                content:
                    `❌ No series found matching "${query}"`,

                flags:
                    MessageFlags.Ephemeral

            });

        }

        // Group by series
        const seriesMap =
            new Map();

        for (
            const book of matchingBooks
        ) {

            if (
                !seriesMap.has(
                    book.series
                )
            ) {

                seriesMap.set(
                    book.series,
                    []
                );

            }

            seriesMap
                .get(book.series)
                .push(book);

        }

        const embed =
            new EmbedBuilder()

                .setTitle(
                    `📚 Search Results`
                );

        let description =
            '';

        for (
            const [
                series,
                volumes
            ] of seriesMap
        ) {

            volumes.sort(
                (a, b) =>
                    a.volume -
                    b.volume
            );

            description +=
                `## ${series}\n`;

            description +=
                volumes
                    .map(book =>

                        `\`${book.bookId}\` • Vol ${book.volume}` +

                        (
                            book.title
                                ? ` • ${book.title}`
                                : ''
                        )

                    )
                    .join('\n');

            description +=
                '\n\n';

        }

        if (
            description.length >
            4000
        ) {

            description =
                description.slice(
                    0,
                    3900
                ) +
                '\n...';

        }

        embed.setDescription(
            description
        );

        await interaction.reply({

            embeds: [embed],

            flags:
                MessageFlags.Ephemeral

        });

    }

};