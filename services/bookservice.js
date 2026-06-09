const db = require('../firebase/firestore');

function extractGoogleDriveId(url) {

    let match = url.match(/\/d\/([^/]+)/);

    if (match) {
        return match[1];
    }

    match = url.match(/[?&]id=([^&]+)/);

    if (match) {
        return match[1];
    }

    return null;
}

async function generateBookId() {

    const counterRef =
        db.collection('system')
            .doc('bookCounter');

    const counterDoc =
        await counterRef.get();

    let nextNumber = 1;

    if (counterDoc.exists) {

        nextNumber =
            counterDoc.data().value + 1;

    }

    await counterRef.set({
        value: nextNumber
    });

    return `MER-${String(nextNumber).padStart(6, '0')}`;
}

async function addBook({
    series,
    volume,
    title,
    author,
    synopsis,
    url,
    coverUrl,
    uploadedBy
}) {

    if (!url.includes('drive.google.com')) {
        throw new Error(
            'Only Google Drive URLs are allowed.'
        );
    }

    const driveFileId =
        extractGoogleDriveId(url);

    if (!driveFileId) {
        throw new Error(
            'Invalid Google Drive URL.'
        );
    }

    const duplicate =
        await db.collection('books')
            .where('series', '==', series)
            .where('volume', '==', volume)
            .limit(1)
            .get();

    if (!duplicate.empty) {
        throw new Error(
            `${series} Volume ${volume} already exists.`
        );
    }

    const bookId =
        await generateBookId();

    const bookData = {

        bookId,

        series,

        volume,

        volumeLabel: `Volume ${volume}`,

        title,

        author,

        synopsis,

        coverUrl,

        driveUrl: url,

        driveFileId,

        uploadedBy,

        createdAt: new Date()

    };

    await db
        .collection('books')
        .doc(bookId)
        .set(bookData);

    return bookData;
}

async function getBook(bookId) {

    const doc =
        await db.collection('books')
            .doc(bookId)
            .get();

    if (!doc.exists) {
        throw new Error(
            'Book not found.'
        );
    }

    return doc.data();
}

module.exports = {
    addBook,
    getBook
};