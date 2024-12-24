import { Router } from "express";
import {applyCouponsTotalAmount,getALLTotalCouponsTotalAmount,getALLCategoryCoupons,applyCategoryCoupon} from '../controller/adminController/couponsController.js'

const routes=Router();


//total amount of routes-->
routes.get('/totalAmount/allCoupons',getALLTotalCouponsTotalAmount)
routes.post('/totalAmount/applyCoupons',applyCouponsTotalAmount)

//category coupon routes--->
routes.get('/all/coupons/category/:categoryId',getALLCategoryCoupons);
routes.post('/applyCoupons/category/:categoryId',applyCategoryCoupon);

//category coupon routes-->
routes.get('')




export default routes;