const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

const db =
    require('../firebase/firestore');

module.exports = {

    data:
        new SlashCommandBuilder()

            .setName('stats')

            .setDescription(
                'Show Merlin statistics'
            ),

    async execute(
        interaction
    ) {

        const snapshot =
            await db
                .collection('books')
                .get();

        const books =
            snapshot.docs.map(
                doc => doc.data()
            );

        const seriesCount =
            new Set(
                books.map(
                    b => b.series
                )
            ).size;

        const authorCount =
            new Set(
                books.map(
                    b => b.author
                )
            ).size;

        const embed =
            new EmbedBuilder()

                .setTitle(
                    '📚 Merlin Statistics'
                )

                .addFields(

                    {
                        name:
                            'Series',
                        value:
                            String(
                                seriesCount
                            ),
                        inline:
                            true
                    },

                    {
                        name:
                            'Volumes',
                        value:
                            String(
                                books.length
                            ),
                        inline:
                            true
                    },

                    {
                        name:
                            'Authors',
                        value:
                            String(
                                authorCount
                            ),
                        inline:
                            true
                    }

                );

        await interaction.reply({

            embeds: [embed]

        });

    }

};