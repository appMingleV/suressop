import pool from "../../config/db.js";

export const shopDetails =(req,res)=>{
    try{      
     const {vendorId}=req.params;
     const queryShopDetails=`SELECT storeName,userName,storeCategory,storeAddress,BusinessContact,logo,banner FROM vendorStoreDetails WHERE vendor_id=?`;
     const value=[vendorId];
     pool.query(queryShopDetails,value,(err,result)=>{
        if(err){
            return res.status(500).json({
                status:"error",
                message:"Something went wrong while trying to fetch shop details",
                error:err.message
            })
        }
        if(shopDetails.length==0)return  res.status(400).json({
            status:"failed",
            message:"No shop found for this vendor"
        })
        return res.status(200).json({
            status:"success",
            message:"Shop details fetched successfully",
            data:result[0]
        })
     })
    }catch(err)
    {
        return res.status(500).json({
            status:"error",
            message:"Something went wrong while trying to fetch shop details",
            error:err.message
        })
    }
}




