
import { Router } from 'express'
import multer from 'multer';
import {compaignAdd,getCampaign,updateCampaign,deleteCampaign} from '../controller/adminController/campaignController.js'


const  routes=Router();

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

routes.post('/page/:page/location/:location',campaignImage,compaignAdd)

routes.put('/:campaignId',campaignImage,updateCampaign)

routes.delete('/:campaignId',deleteCampaign)

routes.get('/page/:page/location/:location',getCampaign)



export default routes;