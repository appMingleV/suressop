import { Router } from "express";

import {addCategory,editCategory,deleteCategory,singleCategory,getAllCategories} from '../controller/adminController/categoryContoller.js'
import {vedorList,singleVendor,vedorChangeStatus} from '../controller/adminController/adminController.js'
import {addSubCategory,editSubCategory,deleteSubCategory,singleSubCategory,getAllSubCategories,subCategeriesByCategories} from '../controller/adminController/subcategoryController.js'
import {addSlider,allSlider,deleteSlider} from '../controller/adminController/sliderController.js'

import {compaignAdd,getCampaign,updateCampaign,deleteCampaign} from '../controller/adminController/campaignController.js'
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
        const uniqueSuffix ='subCate' +Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload1 = multer({ storage:storage1 });
const singleImageSubCategory=upload1.single('image');
//sub categories CRUD--->
routes.post('/admin/subcategory',singleImageSubCategory,addSubCategory);
routes.put('/admin/subcategory/:subCategoryId',singleImageSubCategory,editSubCategory);
routes.get('/admin/subcategory/:subcategoryId',singleSubCategory);
routes.get('/admin/subcategory',getAllSubCategories);
routes.delete('/admin/subategory/:subcategoryId',deleteSubCategory);
routes.get('/admin/subategory/category/:categoryId',subCategeriesByCategories);

//vendor list-->
routes.get('/admin/vendor/:query',vedorList)
routes.get('/admin/vendorSingle/:vendorId',singleVendor)
routes.put('/admin/vendorStatus/:vendorId',vedorChangeStatus)




//slider-->
const storage2=multer.diskStorage({
    destination:(req,file,cb)=>{
     cb(null,'uploads/sliders/');
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix ='slider' +Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})

const upload2=multer({storage:storage2});
const singleImage2=upload2.single('image');
routes.post('/admin/sliders',singleImage2,addSlider);
routes.get('/admin/sliders',allSlider);
routes.delete('/admin/sliders/:sliderId',deleteSlider);


const storage3=multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/campaign/'); // Folder for storing uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix ='campaign' +Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})

const upload3=multer({ storage:storage3 });
const campaignImage=upload3.single('image');
routes.post('/admin/campaign/page/:page/location/:location',campaignImage,compaignAdd)
routes.put('/admin/campaign/:campaignId',campaignImage,updateCampaign)
routes.delete('/admin/campaign/:campaignId',deleteCampaign)
routes.get('/admin/campaign/page/:page/location/:location',getCampaign)




export default routes;