
export const addSubCategory = (req, res) => {
    try {
        const { sub_category_name, category_id } = req.body;

        if (req.file) {
            return res.status(200).json({
                status: "error",
                message: "Please provide image",
                error: err.message
            })
        } else if (sub_category_name == undefined) {
            return res.status(200).json({
                status: "error",
                message: "Please provide sub_category_name",
                error: err.message
            })
        } else if (category_id == undefined) {
            return res.status(200).json({
                status: "error",
                message: "Please provide category_id",
                error: err.message
            })
        }
        const queryAddSubCategory = `INSERT INTO sub_categories (sub_category_name,image,category_id) VALUES (?,?,?)`;
        const values = [sub_category_name, req.file.filename, category_id];
        pool.query(queryAddSubCategory, values, (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Something went wrong while adding subcategory",
                    error: err.message
                })
            }
            return res.status(200).json({
                status: "success",
                message: "Subcategory added successfully"
            })
        })
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Something went wrong while adding subcategory",
            error: err.message
        })
    }
}