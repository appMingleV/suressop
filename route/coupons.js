import { Router } from "express";
import {addCouponTotalAmount,deleteCouponTotalAmount,addCategoryCoupon,deleteCategoryCoupon} from '../controller/adminController/couponsController.js'
const routes=Router();

//total amount of routes-->
routes.post('/totalAmount',addCouponTotalAmount);
routes.delete('/totalAmount/:couponId',deleteCouponTotalAmount)



//category Coupons of routes-->
routes.post('/category/:categoryId',addCategoryCoupon);
routes.delete('/category/:couponId',deleteCategoryCoupon)


//sub category Coupons of routes-->
routes.post('/')



export default routes;