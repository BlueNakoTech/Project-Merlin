const {
    EmbedBuilder
} = require('discord.js');

const bookService =
    require('../services/bookservice');
const configService =
    require('../services/configservice');

module.exports =
    async (
        client,
        guildId
    ) => {

        const config =
            await configService
                .getLibraryMessages(
                    guildId
                );

        if (!config) {
            return;
        }

        const channel =
            await client.channels.fetch(
                config.channelId
            );

        const message =
            await channel.messages.fetch(
                config.recentMessageId
            );

        const books =
            await bookService.getNewestSeries(
                3
            );
        books.reverse();

        const embeds =
            books.map(book =>

                new EmbedBuilder()

                    .setTitle(
                        `📚 ${book.series}`
                    )

                    .setURL(
                        book.novelUpdatesUrl || null
                    )

                    .setDescription(
                        book.synopsis
                            ? `"${book.synopsis.slice(0, 100)}..."`
                            : 'No synopsis available.'
                    )

                    .addFields(
                        {
                            name: '✍️ Author',
                            value: book.author,
                            inline: true
                        },
                        {
                            name: '🔗 More',
                            value: `[Novel Updates](${book.novelUpdatesUrl})`,
                            inline: true
                        }

                    )

                    .setThumbnail(
                        book.coverUrl
                    )

            );
        await message.edit({
            content:
                '# 📚 Recently Added Series',
            embeds
        });

    };