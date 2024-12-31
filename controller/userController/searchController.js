
import pool from "../../config/db.js";
export const searchResult = async (req, res) => {
    try {
      
        const  searchTerm  = req.query.q;
       
        if (!searchTerm) {
            return res.status(400).json({
                status: "error",
                message: "search value is empty",
            })
        }
        const searchQuery = `
        SELECT * 
        FROM products 
        WHERE name REGEXP  ? OR description REGEXP  ? OR brand_name REGEXP ?
    `;

 
        
        const searchData = await queryPromise(searchQuery,[searchTerm,searchTerm,searchTerm]);
       
        if (searchData.length == 0) return res.status(400).json({
            status: "failed",
            message: "No products found matching the search term",
        })
        return res.status(200).json({
            status: "success",
            message: "Products fetched successfully",
            data: searchData,
        })

    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Something went wrong while trying to search",
            error: err.message
        })
    }
}



const queryPromise = (query, value = []) => {
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