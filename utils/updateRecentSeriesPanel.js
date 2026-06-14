const {
    EmbedBuilder
} = require('discord.js');

const bookService =
    require('../services/bookservice');
const configService =
    require('../services/configservice');

module.exports =
    async client => {

        const config =
            await configService
                .getLibraryMessages();

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
                2
            );

        const embeds =
            books.map(book =>

                new EmbedBuilder()

                    .setTitle(
                        `📚 ${book.series}`
                    )

                    .setURL(
                        book.novelUpdatesUrl ||
                        null
                    )

                    .setDescription(
                        (book.synopsis || '')
                            .slice(0, 250)
                        + '...'
                    )

                    .addFields({
                        name: 'Author',
                        value: book.author
                    })

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