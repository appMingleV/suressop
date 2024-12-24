import pool from "../../config/db.js";

export const addCouponTotalAmount=async(req,res)=>{
    try{
      const {precentageDis,couponCode,validAt,couponDiscri,status}=req.body;
      const queryAddCoupon=`INSERT INTO coupons_total_amount (percentage_dis,coupon_code,valid_at,coupon_descri,status) VALUES (?,?,?,?,?)`;
      const values=[precentageDis,couponCode,validAt,couponDiscri,status];
     
     const addedCoupon=await queryPromise(queryAddCoupon,values);
      if(!addedCoupon) return res.status(500).json({
            status:"failed",
            message:"Failed to add coupon"
        })
        return res.status(200).json({
            status:"success",
            message:"Coupon added successfully",
        })

    }catch(err){
        return res.status(500).json({
            status:"error",
            message:"Something went wrong while trying to add coupon",
            error:err.message
        })
    }
}


export const deleteCouponTotalAmount=async(req,res)=>{
    try{
        const {couponId}=req.params;
        const queryDeleteCoupon=`DELETE FROM coupons_total_amount WHERE id=?`;
        const values=[couponId];
       
     const deletedCoupon=await queryPromise(queryDeleteCoupon,values);
     if(!deletedCoupon){
        return res.status(400).json({
            status:"failed",
            message:"Coupon not found"
        })
     }
     return res.status(200).json({
            status:"success",
            message:"Coupon deleted successfully",
        })

    }catch(err){
        return res.status(500).json({
            status:"error",
            message:"Something went wrong while trying to delete coupon",
            error:err.message
        })
    }
}

export const getALLTotalCouponsTotalAmount =async(req,res)=>{
    try{
      const queryGetCoupon=`SELECT * FROM coupons_total_amount WHERE status="active"`;
      const allCoupons=await queryPromise(queryGetCoupon);
      if(allCoupons.length==0){
        return res.status(400).json({
            status:"failed",
            message:"No active coupons found"
        })
      }
      return res.status(200).json(
        {
            status:"success",
            message:"Active coupons fetched successfully",
            data:allCoupons
        })

    }catch(err){
        return res.status(500).json({
            status:"error",
            message:"Something went wrong while trying to fetch coupons",
            error:err.message
        })
    }
}


export const applyCouponsTotalAmount=async(req,res)=>{
    try{
        const {couponCode,totalAmount} = req.body;
        const queryFind=`SELECT percentage_dis FROM coupons_total_amount WHERE coupon_code=? AND status="active"`
        const values=[couponCode];

        const couponDetails=await queryPromise(queryFind,values);
        if(couponDetails.length==0){
            return res.status(400).json({
                status:"failed",
                message:"Coupon  inactive"
            })
        }
        const {percentage_dis}=couponDetails[0];
        const discountAmount=(totalAmount*percentage_dis)/100;
        const finalAmount=totalAmount-discountAmount;

        return res.status(200).json({
            status:"success",
            message:"Coupon applied successfully",
            data:{
                finalAmount,
                discountAmount
            }
        })


    }catch(err){
        return res.status(500).json({
            status:"error",
            message:"Something went wrong while trying to apply coupon",
            error:err.message
        })
    }
}



//category coupons-->

export const addCategoryCoupon=async(req,res)=>{
    try{
        const {categoryId}=req.params;
        const {couponCode,precentageDis,validAt,couponDiscri,status}=req.body;
        const queryAddCoupon=`INSERT INTO coupons_cate (category_id,percentage_dis,coupon_code,valid_at,coupon_descri,status) VALUES (?,?,?,?,?,?)`;
        const values=[categoryId,precentageDis,couponCode,validAt,couponDiscri,status];
        const addedCoupon=await queryPromise(queryAddCoupon,values);
        if(!addedCoupon) return res.status(500).json({
            status:"failed",
            message:"Failed to add category coupon"
        })
        return res.status(200).json({
            status:"success",
            message:"Category coupon added successfully",
        })
    }catch(err){
        return res.status(500).json({
            status:"error",
            message:"Something went wrong while trying to add category coupon",
            error:err.message
        })
    }
}



export const deleteCategoryCoupon=async(req,res)=>{
    try{
     const {couponsId}=req.params;
     const queryDeleteCoupon=`DELETE FROM coupons_cate WHERE id=?`;
     const values=[couponsId];
     const deletedCoupon=await queryPromise(queryDeleteCoupon,values);
     if(!deletedCoupon){
        return res.status(400).json({
            status:"failed",
            message:"Coupon not found"
        })
     }

     return res.status(200).json({
            status:"success",
            message:"Coupon deleted successfully",
        })

    }catch(err){
       return res.status(500).json({
        status:"error",
        message:"Something went wrong while trying to delete category coupon",
        error:err.message
       })
    }

}



export const getALLCategoryCoupons =async(req,res)=>{
    try{
        const {categoryId}=req.params;
        const queryGetCoupon=`SELECT * FROM coupons_cate WHERE status="active" AND category_id=?`;
        const values=[categoryId];
        const allCoupons=await queryPromise(queryGetCoupon);
        if(allCoupons.length==0){
            return res.status(400).json({
                status:"failed",
                message:"No active category coupons found"
            })
        }
        return res.status(200).json(
            {
                status:"success",
                message:"Active category coupons fetched successfully",
                data:allCoupons
            })
    }catch(err){
        return res.status(500).json({
            status:"error",
            message:"Something went wrong while trying to fetch category coupons",
            error:err.message
        })
    }
}


export const applyCategoryCoupon=async(req,res)=>{
    try{
        const {couponCode,productAmount}=req.body;
        const {categoryId}=req.params;
        const queryAppyCoupon=`SELECT percentage_dis FROM coupons_cate WHERE  category_id=? AND coupon_code=? AND status="active"`
        const values=[categoryId,couponCode];
        const couponDetails=await queryPromise(queryAppyCoupon,values);
        if(couponDetails.length==0){
            return res.status(400).json({
                status:"failed",
                message:"Coupon inactive"
            })
        }
        const {percentage_dis}=couponDetails[0];
        const discountAmount=(productAmount*percentage_dis)/100;
        const finalAmount=productAmount-discountAmount;
        return res.status(200).json(
            {
                status:"success",
                message:"Coupon applied successfully",
                data:{
                    finalAmount,
                    discountAmount
                }
            })
    }catch(err){
        return res.status(500).json({
            status:"error",
            message:"Something went wrong while trying to apply category coupon",
            error:err.message
        })
    }
}
 

export const addSubCategoryCoupon=async(req,res)=>{
    try{
     const {categoryId,subCategoryId} = req.params
     const {precentageDis,couponCode,validAt,couponDiscri,status}=req.body;
     const queryAddCouopon=`INSERT INTO coupons_sub (percentage_dis,coupon_code,valid_at,category_id,sub_category_id,coupon_descri,status) VALUES (?,?,?,?,?,?,?)`
     const values=[precentageDis,couponCode,validAt,categoryId,subCategoryId,couponDiscri,status];
     const addedCoupon=await queryPromise(queryAddCouopon,values);
     if(!addedCoupon) return res.status(500).json({
            status:"failed",
            message:"Failed to add subcategory coupon"
        })

        return res.status(200).json({
            status:"success",
            message:"Subcategory coupon added successfully",
        })
    }catch(err){
        return res.status(500).json({
            status:"error",
            message:"Something went wrong while trying to add subcategory coupon",
            error:err.message
        })
    }
}


export const deleteSubCategoryCoupon=async(req,res)=>{
    try{
        const {couponsId}=req.params;
        const queryDeleteCoupon=`DELETE FROM coupons_sub WHERE id=?`;
        const values=[couponsId];
        const deletedCoupon=await queryPromise(queryDeleteCoupon,values);
        if(!deletedCoupon){
            return res.status(400).json({
                status:"failed",
                message:"Coupon not found"
            })
        }
        return res.status(200).json({
            status:"success",
            message:"Coupon deleted successfully",
        })

    }catch(err){
        return res.status(500).json({
            status:"error",
            message:"Something went wrong while trying to delete subcategory coupon",
            error:err.message
        })
    
}
}


export const getALLSubCategoryCoupons =async(req,res)=>{
    try{

        const {categoryId,subCategoryId}=req.params;
    }catch(err){
        return res.status(500).json({
            status:"error",
            message:"Something went wrong while trying to fetch subcategory coupons",
            error:err.message
        })
    }
}
const queryPromise=(query,value=[])=>{
    return new Promise((resolve,reject)=>{
        pool.query(query,value,(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
}