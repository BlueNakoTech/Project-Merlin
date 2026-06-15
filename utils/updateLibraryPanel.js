const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require('discord.js');

const bookService =
    require('../services/bookservice');

const configService =
    require('../services/configservice');
const { content } = require('googleapis/build/src/apis/content');

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
                config.libraryMessageId
            );

        const series =
            await bookService.getAllSeries();



        const embed =
            new EmbedBuilder()

                .setTitle(
                    '📚 Merlin Archive'
                )

                .setDescription(
                    [
                        'Welcome to the digital shelves of Merlin Archive.',
                        '',
                        'Browse available series and select a title to begin reading.',
                        '',
                        `📖 Series Available: **${series.length}**`,
                        '',
                        // '📖 EPUB Library',
                        // '🔍 Organized by Series & Volume',
                        // '☁️ Cloud Hosted Downloads'
                    ].join('\n')
                );

        const menu =
            new StringSelectMenuBuilder()

                .setCustomId(
                    'series_select'
                )

                .setPlaceholder(
                    'Choose a series'
                )

                .addOptions(

                    series.map(item => ({

                        label:
                            item,

                        value:
                            item

                    }))

                );

        const row =
            new ActionRowBuilder()
                .addComponents(
                    menu
                );

        await message.edit({
            content:
                '# 📚 Library Catalog',

            embeds: [embed],

            components: [row]

        });

    };