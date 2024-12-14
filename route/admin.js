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




const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/categories/subcategories/'); // Folder for storing uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix ='category' +Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload1 = multer({ storage });
const singleImageSubCategory=upload1.single('image');
//sub categories CRUD--->
routes.post('/admin/subcategory',singleImageSubCategory,addCategory);
routes.put('/admin/subcategory/:subcategoryId',singleImageSubCategory,editCategory);
routes.get('/admin/subcategory/:subcategoryId',singleCategory);
routes.get('/admin/subcategory',getAllCategories);
routes.delete('/admin/subategory/:subcategoryId',deleteCategory);

export default routes;