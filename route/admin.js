import { Router } from "express";

import {addCategory,editCategory,deleteCategory,singleCategory,getAllCategories} from '../controller/adminController/categoryContoller.js'
import multer from "multer";

const routes=Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/categories/'); // Folder for storing uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix ='category' +Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });
const singleImage=upload.single('image');
routes.get('/',);
routes.post('/admin/category',singleImage,addCategory);
routes.put('/admin/category/:categoryId',singleImage,editCategory);
routes.get('/admin/category/:categoryId',singleCategory);
routes.get('/admin/category',getAllCategories);
routes.delete('/admin/category/:categoryId',deleteCategory);

export default routes;