//this is wrappper function to handle the async errors

// 1-this is promise approach
const asyncHadler=(requesthandler)=>{
    (req,res,next)=>{
        Promise.resolve(requesthandler(req,res,next)).catch((err) => next(err))
    }
}

export {asyncHadler}


//2-this is try catech block approach

// export default asyncHandler;
// const asyncHandler=(fn)=>async(req,res,next)=>{
// try{
//     await fn(req,res,next)
// }catch(error){
// res.status(error.code||500).json({
//     success:false,
//     message:error.message
// })
// }
// }