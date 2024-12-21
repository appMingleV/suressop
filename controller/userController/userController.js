

export const addReview=(req,res)=>{
    try{
    

    }catch(err){
        return res.status(500).json({
            status:"error",
            message:"Something went wrong while trying to add review",
            error:err.message
        })
    }
}