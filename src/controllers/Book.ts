import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from '../models/Book';

const createBook = (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        name
    });
    return book
        .save()
        .then((book) => res.status(201).json({ book }))
        .catch((error) => res.status(500).json({ error }));
};

const readBook = (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    return Book.findById(bookId)
        .then((book) => (book ? res.status(200).json({ book }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAllBook = (req: Request, res: Response, next: NextFunction) => {
    return Book.find()
        .then((books) => res.status(200).json({ books }))
        .catch((error) => res.status(500).json({ error }));
};

const UpdateBook = (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.bookId;

    return Book.findById(bookId)
        .then((book) => {
            if (book) {
                book.set(req.body);

                return book
                    .save()
                    .then((book) => res.status(201).json({ book }))
                    .catch((error) => res.status(500).json(error));
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

const DeleteBook = (req: Request, res: Response, next: NextFunction) => {
    const bookId = req.params.BookId;

    return Book.findByIdAndDelete(bookId)
        .then((book) => {
            book ? res.status(201).json({ message: 'delete' }) : res.status(404).json({ message: 'not found' });
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

export default { createBook, readBook, readAllBook, UpdateBook, DeleteBook };
