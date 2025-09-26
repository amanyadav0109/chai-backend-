import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoose,{Schema} from "mongoose";
const videoSchema=new Schema(
    {
       videoFile:{
        type:String, //cloudinary url
        required:true,
       },
        thumbnails:{
        type:String, 
        required:true,
       },
        tittle:{
        type:String,
        required:true,
       },
        Description:{
        type:String,
        required:true,
       },
       duration:{
        type:Number,//cloudinary url
        required:true,
       },
         views:{
        type:Number,
        default:0
       },
         isPublished:{
            type:Boolean,
            default:true
         },
         Owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
         }
     },
     {timestamps:true}
)
videoSchema.plugin(mongooseAggregatePaginate);
export const Video=mongoose.model("Video",videoSchema);