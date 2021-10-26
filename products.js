var mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    alt:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})

module.exports=mongoose.model('Products',productSchema)