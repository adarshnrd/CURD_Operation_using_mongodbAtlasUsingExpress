import express from 'express';
import controller from '../controllers/Book';

const router = express.Router();

router.post('/create', controller.createBook);
router.get('/get/:bookId', controller.readBook);
router.get('/get/', controller.readAllBook);
router.patch('/update/:bookId', controller.UpdateBook);
router.delete('/delete/:bookId', controller.DeleteBook);

export = router;
