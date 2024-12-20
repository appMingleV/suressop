import pool from "../../config/db.js";

export const shopDetails = (req, res) => {
    try {
        const { storeId } = req.params;
        const queryShopDetails = `SELECT storeName,userName,storeCategory,storeAddress,BusinessContact,logo,banner,vendor_id FROM vendorStoreDetails WHERE id=?`;
        const value = [storeId];
        pool.query(queryShopDetails, value, (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Something went wrong while trying to fetch shop details",
                    error: err.message
                })
            }
            if (result.length == 0) return res.status(400).json({
                status: "failed",
                message: "No shop found for this vendor"
            })
            return res.status(200).json({
                status: "success",
                message: "Shop details fetched successfully",
                data: result[0]
            })
        })
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Something went wrong while trying to fetch shop details",
            error: err.message
        })
    }
}

export const allStores=async (req,res)=>{
    try{
      const queryAllShops=`SELECT id FROM Vendor WHERE status="Accept" `;
      const allDetails=await queryPromis(queryAllShops);
       
      if(allDetails.length==0)return res.status(200).json({
        status: "failed",
        message: "No stores found"
      })
      const shopDetailsObj=[];
      
      for(let key of allDetails) {
        const queryShopDetails=`SELECT * FROM vendorStoreDetails WHERE vendor_id=?`;
        const  value=[key.id];
        const shopDetails=await queryPromis(queryShopDetails,value);
        shopDetailsObj.push(shopDetails[0]);
      }


      return res.status(200).json({
        status: "success",
        message: "All stores fetched successfully",
        data: shopDetailsObj
      })
    }catch(err){
        return res.status(500).json({
            status: "error",
            message: "Something went wrong while trying to fetch all stores",
            error: err.message
        })
    }
}

export const editShopDetails = async(req, res) => {
    try {
        const { vendorId } = req.params;
        const {businessContact, shopAddress } = req.body;
        const {logo,banner}=req.files
        //check existing vendor then
        const queryCheckUser=`SELECT CASE 
           WHEN EXISTS (SELECT 1 FROM Vendor WHERE id = ${vendorId}) THEN 'Present'
           ELSE 'Not Present'
       END AS status`
        const checkUser=await queryPromis(queryCheckUser,[vendorId]);
        if(checkUser[0].status==='Not Present')return res.status(404).json({
                status: "failed",
                message: "Vendor not found"
            })
        

        const queryEditShopDetails = `UPDATE vendorStoreDetails SET logo=?,banner=?,businessContact=?,storeAddress=? WHERE vendor_id=?`;
        const values = [logo[0].filename, banner[0].filename, businessContact, shopAddress, vendorId];
        const updateCheck=await queryPromis(queryEditShopDetails, values);

        if(updateCheck.affectedRows===0) return res.status(400).json({
                status: "failed",
                message: "No shop found for this vendor"
            })

        return res.status(200).json({
            status: "success",
            message: "Shop details edited successfully"
        })
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Something went wrong while trying to edit shop details",
            error: err.message
        })
    }
}

const queryPromis = (query, value = [])=>{
    return new Promise((resolve, reject) => {
        pool.query(query, value, (err, result) => {
            if (err) reject(err);
            resolve(result)
        })
    })
}