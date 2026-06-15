const db =
    require('../firebase/firestore');

async function saveLibraryMessages(

    guildId,

    {

        channelId,

        recentMessageId,

        libraryMessageId

    }

) {

    await db
        .collection('system')
        .doc(guildId)
        .set({

            channelId,

            recentMessageId,

            libraryMessageId

        });

}

async function getLibraryMessages(
    guildId
) {

    const doc =
        await db
            .collection('system')
            .doc(guildId)
            .get();

    if (!doc.exists) {
        return null;
    }

    return doc.data();

}

module.exports = {

    saveLibraryMessages,

    getLibraryMessages

};