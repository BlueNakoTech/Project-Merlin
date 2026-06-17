const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    MessageFlags,
    EmbedBuilder
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

        .addStringOption(option =>
            option
                .setName('novelupdates')
                .setDescription(
                    'Novel Updates URL'
                )
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName('translator')
                .setDescription(
                    'Translator or translation group'
                )
                .setRequired(false))

        .addStringOption(option =>
            option
                .setName('translator_url')
                .setDescription(
                    'Translator website or social media'
                )
                .setRequired(false))


        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        await interaction.deferReply({
            flags: MessageFlags.Ephemeral
        });

        try {

            const series =
                interaction.options.getString('series');

            const volume =
                interaction.options.getInteger('volume');

            let title =
                interaction.options.getString('title');

            let author =
                interaction.options.getString('author');

            let translator =
                interaction.options.getString(
                    'translator'
                );

            let translatorUrl =
                interaction.options.getString(
                    'translator_url'
                );

            const url =
                interaction.options.getString('url');

            let synopsis =
                interaction.options.getString('synopsis');

            const cover =
                interaction.options.getAttachment('cover');
            let novelUpdatesUrl =
                interaction.options.getString(
                    'novelupdates'
                );
            if (
                novelUpdatesUrl &&
                !novelUpdatesUrl.includes(
                    'novelupdates.com'
                )
            ) {

                throw new Error(
                    'Novel Updates URL must come from novelupdates.com'
                );

            }

            let coverUrl = null;

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

                if (
                    !cover.contentType?.startsWith(
                        'image/'
                    )
                ) {
                    throw new Error(
                        'Cover must be an image.'
                    );
                }

                const coverChannel =
                    await interaction.client.channels.fetch(
                        process.env.COVER_CHANNEL_ID
                    );

                const archiveMessage =
                    await coverChannel.send({
                        content:
                            `${series} Volume ${volume}`,
                        files: [cover.url]
                    });

                coverUrl =
                    archiveMessage
                        .attachments
                        .first()
                        ?.url;

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

                novelUpdatesUrl =
                    novelUpdatesUrl ||
                    seriesInfo.novelUpdatesUrl;

                author =
                    seriesInfo.author;

                synopsis =
                    seriesInfo.synopsis;
                translator =
                    translator ||
                    seriesInfo.translator;

                translatorUrl =
                    translatorUrl ||
                    seriesInfo.translatorUrl;

                if (cover) {

                    if (
                        !cover.contentType?.startsWith(
                            'image/'
                        )
                    ) {
                        throw new Error(
                            'Cover must be an image.'
                        );
                    }

                    const coverChannel =
                        await interaction.client.channels.fetch(
                            process.env.COVER_CHANNEL_ID
                        );

                    const archiveMessage =
                        await coverChannel.send({
                            content:
                                `${series} Volume ${volume}`,
                            files: [cover.url]
                        });

                    coverUrl =
                        archiveMessage
                            .attachments
                            .first()
                            ?.url;

                } else {

                    // Fallback to Volume 1 cover
                    coverUrl =
                        seriesInfo.coverUrl;

                }

            }

            const book =
                await bookService.addBook({

                    series,

                    volume,

                    title,

                    author,

                    synopsis,

                    url,

                    translator,

                    translatorUrl,

                    coverUrl,

                    novelUpdatesUrl,

                    uploadedBy:
                        interaction.user.id

                });

            const updateRecentSeries =
                require('../utils/updateRecentSeriesPanel');

            const updateLibraryPanel =
                require('../utils/updateLibraryPanel');

            if (volume === 1) {

                await updateRecentSeries(
                    interaction.client
                );

                await updateLibraryPanel(
                    interaction.client
                );

            }

            await interaction.editReply({

                content:
                    `✅ Book Added\n\n` +
                    `ID: ${book.bookId}\n` +
                    `Series: ${book.series}\n` +
                    `Volume: ${book.volume}`,

                flags:
                    MessageFlags.Ephemeral

            });



            const logEmbed =
                new EmbedBuilder()

                    .setTitle('📚 Book Added')

                    .setDescription(
                        `**${book.series}** Volume ${book.volume}`
                    )

                    .addFields(
                        {
                            name: 'Book ID',
                            value: book.bookId,
                            inline: true
                        },
                        {
                            name: 'Author',
                            value: book.author,
                            inline: true
                        },
                        {
                            name: 'Uploader',
                            value:
                                `<@${interaction.user.id}>`,
                            inline: true
                        },
                        {
                            name: 'Google Drive',
                            value:
                                `[Open Book](${book.driveUrl})`
                        }
                    )

                    .setThumbnail(
                        book.coverUrl
                    )

                    .setTimestamp();

            try {

                const logChannel =
                    await interaction.client.channels.fetch(
                        process.env.LOG_CHANNEL_ID
                    );

                await logChannel.send({
                    embeds: [logEmbed]
                });

            } catch (logError) {

                console.error(
                    'Failed to write log:',
                    logError
                );

            }

        } catch (error) {

            console.error(error);

            await interaction.editReply({

                content:
                    `❌ ${error.message}`,

                flags:
                    MessageFlags.Ephemeral

            });

        }



    }

};