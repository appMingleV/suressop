import pool from "../../config/db.js";

export const showProductsDetails = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const queryProductDetails = `SELECT id,name,featured_image,description FROM products WHERE vendor_id=?`;
        const value = [vendorId];
        const productData = await queryPromis(queryProductDetails, value);
        if (productData.length == 0) return res.status(200).json({
            status: "failed",
            message: "No products found"
        })
        
        const getFullProducts=await getMinConfig(productData);
        return res.status(200).json({
            status: "success",
            message: "Products fetched successfully",
            data: getFullProducts
        })
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Something went wrong while trying to fetch product details",
            error: err.message
        })
    }
}

const queryPromis = (query, value = []) => {
    return new Promise((resolve, reject) => {
        pool.query(query, value, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

export const getProductCategoriesSubCate=async(req,res)=>{
   try{
    const {categId,subCateId}=req.params;
    const queryProductDetails=`SELECT id,name,featured_image,description FROM products WHERE category_id=? AND sub_category_id=?`;
    const value=[categId,subCateId];
    const productData=await queryPromis(queryProductDetails,value);
    const getFullProductData=await getMinConfig(productData);

    return  res.status(200).json(
        {
            status:"success",
            message:"Products fetched successfully",
            data:getFullProductData
        })
   }catch(err){
    return  res.status(500).json({
        status:"error",
        message:"Something went wrong while trying to fetch product categories and subcategories",
        error:err.message
    })
   }
}


const getMinConfig=(productData)=>{
    return new Promise(async(resolve,reject)=>{
        for (let key of productData) {
            const queryProductDetails = `SELECT * FROM product_configurations WHERE sale_price = (SELECT MIN(sale_price) FROM product_configurations WHERE products=?); `
            const value=[key.id];
            const productConfig = await queryPromis(queryProductDetails, value);
             key.old_price=productConfig[0]?.old_price;
             key.sale_price=productConfig[0]?.sale_price;
        }
        resolve(productData);
    })
}
