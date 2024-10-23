const { nanoid } = require('nanoid');
const books = require('./books');
 
// digunakan agar API dapat menyimpan buku
const addBookHandler = (request, h) => {
    const {
        name, year, author, summary, publisher,
        pageCount, readPage, reading,
    } = request.payload;
 
    // apabila nama buku tidak diisi
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    // apabila readPage lebih besar dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    // apabila nama buku sudah ada
    const id = nanoid(16);
    const finished = readPage === pageCount;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
 
    // apabila nama buku belum ada
    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        insertedAt,
        updatedAt,
    };
 
    // // menambahkan buku baru
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
 
    // apabila berhasill ditambahkan
    if (isSuccess) {
        const response = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    // apabila gagal ditambahkan
    const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku",
    });
    response.code(400);
    return response;
};
 
// digunakan agar API dapat menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
    const {
        name, reading, finished
    } = request.query;
 
    // mengisi buku yang 
    let filteredBooks = books;
    if (name) {
        filteredBooks = filteredBooks.filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase())
        );
    }
 
    // apabila buku yang dibaca
    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.reading === (reading === '1'));
    }
 
    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.finished === (finished === '1'));
    }
 
    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};
 
// digunakan agar api bisa mendapatkan id 
const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const book = books.filter((book) => book.id === id)[0];

    if (book) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }
 
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};
 
// digunakan agar API dapat memperbarui buku
const editBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const {
        name, year, author, summary, publisher,
        pageCount, readPage, reading,
    } = request.payload;
 
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
 
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
 
    const index = books.findIndex((book) => book.id === id);
 
    if (index === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
 
    const finished = readPage === pageCount;
    const updatedAt = new Date().toISOString();
 
    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
    };
 
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
};
 
// digunakan agar api bisa menghapus buku
const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);
 
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: "success",
            message: "Buku berhasil dihapus",
        });
        response.code(200);
        return response;
    }
 
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
 
module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};