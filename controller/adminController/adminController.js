import nodemailer from 'nodemailer';
import pool from '../../config/db.js'

export const vedorList = (req, res) => {
    try {
        const { query } = req.params;
        const arrQuery = ["pending", "reject", "suspended", "accept", "all"];
        if (arrQuery.indexOf(query) == -1) {
            return res.status(400).json({
                status: "failed",
                message: "Invalid query parameter, provides correct parameters"
            })
        } else if (query == "all") {

            const qeuryVendorList = `SELECT id,ownerName,gender,dob,mobile,email,address,status FROM Vendor`;
            pool.query(qeuryVendorList, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        status: "error",
                        message: "Something went wrong while trying to fetch vendor list",
                        error: err.message
                    })
                }
                if (result.length)
                    return res.status(200).json({
                        status: "success",
                        message: "vendor list  successfully retrieved",
                        data: result
                    })
            })
        } else {

            const queryVendorList = `SELECT id,ownerName,gender,dob,mobile,email,address,status FROM Vendor WHERE status=?`;
            const values = [query.charAt(0).toUpperCase() + query.slice(1)];
            pool.query(queryVendorList, values, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        status: "error",
                        message: "Something went wrong while trying to fetch vendor list",
                        error: err.message
                    })
                }
                if (result.length === 0) {
                    return res.status(404).json({
                        status: "failed",
                        message: "No vendor found matching the criteria",
                    })
                }
                return res.status(200).json({
                    status: "success",
                    message: "Vendor list fetched successfully",
                    data: result
                })
            })
        }

    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Something went wrong while trying to fetch vendor list",
            error: err.message
        })
    }

}


export const singleVendor = (req, res) => {
    try {
        const { vendorId } = req.params;
        const queryVendorDetails = `SELECT ownerName,gender,dob,mobile,email,address,status FROM Vendor WHERE id=?`;
        const value = [vendorId]
        pool.query(queryVendorDetails, value, (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Something went wrong while trying to fetch vendor details",
                    error: err.message
                })
            }
            if (result.length == 0) {
                return res.status(400).json({
                    status: "failed",
                    message: "No vendor found",
                })
            }
            const queryVendorShopDetails = `SELECT * FROM vendorStoreDetails WHERE vendor_id=?`
            const value1 = [vendorId];
            pool.query(queryVendorShopDetails, value1, (err, result1) => {
                if (err) {
                    return res.status(500).json({
                        status: "error",
                        message: "Something went wrong while trying to fetch vendor shop details",
                        error: err.message
                    })
                }
                const queryVendorKYCDetails = `SELECT * FROM VendorKYCDetails WHERE vendor_id=?`;
                const value2 = [vendorId];
                pool.query(queryVendorKYCDetails, value2, (err, result2) => {
                    if (err) {
                        return res.status(500).json({
                            status: "error",
                            message: "Something went wrong while trying to fetch vendor KYC details",
                            error: err.message
                        })
                    }
                    return res.status(200).json({
                        status: "success",
                        message: "Vendor details fetched successfully",
                        vendor: result[0],
                        vendorStoreDetails: result1[0],
                        vendorKYCDetails: result2[0]
                    })
                })
            })

        })

    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Something went wrong while trying to change vendor status",
            error: err.message
        })
    }
}


//admin can access dashboard for vendor--->
export const vedorChangeStatus = (req, res) => {
    try {
        const { vendorId } = req.params
        const { status } = req.body;

        if (status == "Accept") {
            const querUpdateStatus = `UPDATE Vendor SET status=? WHERE id=?`;
            const value = [status, vendorId];
            pool.query(querUpdateStatus, value, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        status: "error",
                        message: "Something went wrong while trying to accept vendor",
                        error: err.message
                    })
                }
                if (result.length === 0) {
                    return res.status(400).json({
                        status: "failed",
                        message: "Vendor not found"
                    })
                }
                return res.status(200).json({
                    status: "success",
                    message: "Vendor accepted successfully"
                })
            })
        } else {
            const { description } = req.body;
            const queryVendor = `SELECT email FROM Vendor WHERE id=?`;
            const value = [vendorId];
            pool.query(queryVendor, value, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        status: "error",
                        message: "Something went wrong while trying to fetch vendor email",
                        error: err.message
                    })
                }
                if (result.length === 0) {
                    return res.status(400).json({
                        status: "failed",
                        message: "Vendor not found"
                    })
                }
                const { email } = result[0];
                const queryUpdateStatus = `UPDATE Vendor SET status=? WHERE id=?`
                const value = [status, vendorId];
                pool.query(queryUpdateStatus, value, async (err, status) => {
                    if (err) {
                        return res.status(500).json({
                            status: "error",
                            message: "Something went wrong while trying to update vendor status",
                            error: err.message
                        })
                    }
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        secure: true,
                        port: 465,
                        auth: {
                            user: 'vanshdeep703@gmail.com',
                            pass: 'ylql ugtz pouo qihs', // Use an app password for Gmail
                        }
                    })

                    const mailConfig = {
                        from: 'vanshdeep703@gmail.com',
                        to: email,
                        subject: 'Vendor Status Update',
                        text: `Your vendor status has been updated. Current status: ${status}. ${description}`
                    }
                    await transporter.sendMail(mailConfig);
                    return res.status(200).json({
                        status: "success",
                        message: "Vendor status updated successfully and email sent to vendor"
                    })
                })
            })
        }
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Something went wrong while trying to change vendor status",
            error: err.message
        })
    }
}


//order particullar vendor--->

export const vendorOrderList = async (req, res) => {
    try {
        console.log("vendor is order list")
        const { vendorId } = req.params;
        const queryVendorOrder = `SELECT * FROM  order_items WHERE vendor_id=?`;
        const values = [vendorId];
        const orderItems = await queryPromises(queryVendorOrder, values)
        if (orderItems.length == 0) {
            return res.status(400).json({
                status: "failed",
                message: "No vendor order found"
            })
        }
  
     
        let orderDetails=[]
        for (let i = 0; i < orderItems.length; i++) {
            const productId = orderItems[i].product_id;
            const orderId=orderItems[i].order_id;
            const queryProductDetail = `SELECT name,featured_image FROM products WHERE id=?`
            const value1 = [productId];
            const getProductData=await queryPromises(queryProductDetail,value1);
            const queryStatus=`SELECT payment_status,payment_type FROM orders_cart WHERE id=?`;
            const value2=[orderId];
            const orderStatus=await queryPromises(queryStatus,value2);
            const order={
                orderId:orderId,
                productName:getProductData[0]?.name||"not available",
                productImage:getProductData[0]?.featured_image||"not available",
                totalAmount:orderItems[i]?.total_price,
                size:orderItems[i]?.size||"not available",
                color:orderItems[i]?.color||"not available",
                status:orderStatus[0]?.payment_status||"not available",
                paymentType:orderStatus[0]?.payment_type||"not available"
            }
            orderDetails.push(order)
        }

        return res.json({
            status: "success",
            message: "Vendor order list fetched successfully",
            data: orderDetails
        })

    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Something went wrong while trying to fetch vendor order list",
            error: err.message
        })
    }
}

//get all users-->
export const getAllUsers=async (req,res)=>{
       try{
      const queryAllUser=`SELECT COUNT(*) AS total_entities FROM tbl_users`
      const totalEntities=await queryPromises(queryAllUser);
      if(totalEntities.length==0)return res.status(400).json({
        status: "failed",
        message: "No users found"
      })
      
      return res.status(200).json({ 
        status: "success",
        message: "All users fetched successfully",
        data: totalEntities[0].total_entities
      })

       }catch(err){
        return res.status(500).json({
            status: "error",
            message: "Something went wrong while trying to fetch all users",
            error: err.message
        })
       }
}



const queryPromises = (query, value = []) => {
    return new Promise((resolve, reject) => {
        pool.query(query, value, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}