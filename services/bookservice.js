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

async function getSeriesList() {

    const snapshot =
        await db.collection('books').get();

    const seriesSet =
        new Set();

    snapshot.forEach(doc => {

        const book =
            doc.data();

        if (book.series) {
            seriesSet.add(book.series);
        }

    });

    return [...seriesSet].sort();

}

async function getVolumes(series) {

    const snapshot =
        await db.collection('books')
            .where(
                'series',
                '==',
                series
            )
            .get();

    const books = [];

    snapshot.forEach(doc => {
        books.push(doc.data());
    });

    books.sort(
        (a, b) =>
            a.volume - b.volume
    );

    return books;

}

async function getSeriesInfo(series) {

    const snapshot =
        await db.collection('books')
            .where('series', '==', series)
            .orderBy('volume')
            .limit(1)
            .get();

    if (snapshot.empty) {
        return null;
    }

    return snapshot.docs[0].data();

}
module.exports = {
    getSeriesInfo,
    addBook,
    getBook,
    getSeriesList,
    getVolumes
};