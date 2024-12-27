import { Router } from "express";
import {applyCouponsTotalAmount,getALLTotalCouponsTotalAmount,getALLCategoryCoupons,applyCategoryCoupon,getALLSubCategoryCoupons,applySubCategoryCoupon} from '../controller/adminController/couponsController.js'

const routes=Router();


//total amount of routes-->
routes.get('/totalAmount/allCoupons',getALLTotalCouponsTotalAmount)
routes.post('/totalAmount/applyCoupons',applyCouponsTotalAmount)

//category coupon routes--->
routes.get('/all/coupons/category/:categoryId',getALLCategoryCoupons);
routes.post('/applyCoupons/category/:categoryId',applyCategoryCoupon);

//category coupon routes-->
routes.get('/all/coupons/category/:categoryId/subcategory/:subCategoryId',getALLSubCategoryCoupons);
routes.post('/applyCoupons/category/:categoryId/subcategory/:subCategoryId',applySubCategoryCoupon);




export default routes;