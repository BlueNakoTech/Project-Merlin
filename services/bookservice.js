const db = require('../firebase/firestore');

/**
 * Upload a new book
 */
async function uploadBook({
    title,
    author,
    description = '',
    tags = [],
    archiveMessage,
    uploadedBy
}) {

    // Check duplicate
    const duplicateSnapshot = await db
        .collection('books')
        .where('title', '==', title)
        .where('author', '==', author)
        .limit(1)
        .get();

    if (!duplicateSnapshot.empty) {
        throw new Error(
            `Book "${title}" by "${author}" already exists.`
        );
    }

    const bookData = {
        title,
        author,
        description,
        tags,

        storage: {
            guildId: archiveMessage.guildId,
            channelId: archiveMessage.channelId,
            messageId: archiveMessage.id,
            attachmentUrl:
                archiveMessage.attachments.first()?.url || null
        },

        uploadedBy,
        createdAt: new Date()
    };

    const docRef = await db
        .collection('books')
        .add(bookData);

    return {
        id: docRef.id,
        ...bookData
    };
}

/**
 * Get a book by Firestore ID
 */
async function getBookById(bookId) {

    const doc = await db
        .collection('books')
        .doc(bookId)
        .get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data()
    };
}

/**
 * Delete a book
 */
async function deleteBook(bookId) {

    const doc = await db
        .collection('books')
        .doc(bookId)
        .get();

    if (!doc.exists) {
        throw new Error('Book not found.');
    }

    await db
        .collection('books')
        .doc(bookId)
        .delete();

    return true;
}

/**
 * Search books by title
 */
async function searchBooks(searchTerm) {

    const snapshot = await db
        .collection('books')
        .get();

    const books = [];

    snapshot.forEach(doc => {

        const data = doc.data();

        if (
            data.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        ) {

            books.push({
                id: doc.id,
                ...data
            });

        }

    });

    return books;
}

/**
 * List all books
 */
async function listBooks() {

    const snapshot = await db
        .collection('books')
        .orderBy('createdAt', 'desc')
        .get();

    const books = [];

    snapshot.forEach(doc => {

        books.push({
            id: doc.id,
            ...doc.data()
        });

    });

    return books;
}

module.exports = {
    uploadBook,
    getBookById,
    deleteBook,
    searchBooks,
    listBooks
};