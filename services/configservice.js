const db =
    require('../firebase/firestore');

async function saveLibraryMessages({

    channelId,

    recentMessageId,

    libraryMessageId

}) {

    await db
        .collection('system')
        .doc('library')
        .set({

            channelId,

            recentMessageId,

            libraryMessageId

        });

}

async function getLibraryMessages() {

    const doc =
        await db
            .collection('system')
            .doc('library')
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