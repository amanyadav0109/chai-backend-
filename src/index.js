
import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({
    path:"./env"
})

connectDB()







//this is affix  approach 1
/*
const app=express()
(async() => {
try{
   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
   // Listen for error events
   app.on("error",(error)=>{
    console.error("Failed to connect to the database",error);
    throw error
    
   })
   app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
   })
}catch(error){
    console.error("Error connecting to the database", error);   
}
})();
*/