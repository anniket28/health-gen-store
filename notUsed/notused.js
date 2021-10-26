// const expresslayout=require('express-ejs-layouts')
// var Cart=require('./cart')

// const cartItemsSchema=new mongoose.Schema({
//     user:{
//         type:String,
//         ref:'userRegister'
//     },
//     cart:{
//         type:Object,
//         required:true
//     },
//     // productName:{
//     //     type:String,
//     //     ref:'products'
//     // },
//     totalQty:{
//         type:Number
//     }
// })
// const cartItem=mongoose.model('cartItem',cartItemsSchema)

// if(!req.session.cart){
//     return res.render('products.ejs',{product:products, message:req.flash('message'),successCart:req.flash('successCart'),totalQty:null})
// }   

// if(!req.session.cart){
//     return res.render('physio.ejs',{product:products, message:req.flash('message'),successCart:req.flash('successCart'),totalQty:null})
// }

// var cart=new Cart(req.session.cart)
// var cart=new Cart(req.session.cart)
// if(!req.session.cart){
//     return res.render('cardio.ejs',{product:products, message:req.flash('message'),successCart:req.flash('successCart'),totalQty:null})
// }
// var cart=new Cart(req.session.cart)
// if(!req.session.cart){
//     return res.render('wheelchair.ejs',{product:products, message:req.flash('message'),successCart:req.flash('successCart'),totalQty:null})
// }
// var cart=new Cart(req.session.cart)
// if(!req.session.cart){
//     return res.render('general.ejs',{product:products, message:req.flash('message'),successCart:req.flash('successCart'),totalQty:null})
// }
// if(!req.session.cart){
//     return res.render('radio.ejs',{product:products, message:req.flash('message'),successCart:req.flash('successCart'),totalQty:null})
// }
// const cartAdd = function(req,res){
//     var productId=req.params.id
//     // console.log(productId) 
//     var cart=new Cart(req.session.cart ? req.session.cart : {} )
//     Product.findById(productId,function(err,product){
//         if(err){
//             return res.redirect('/products')
//         }
//         cart.add(product,product.id)
//         req.session.cart=cart
        // cartqty=req.session.cart.totalQty
        // console.log(product.price)
        // console.log(req.session.cart)
        // console.log(req.session.cart.items)
        // console.log(cart)
        // console.log(req.session.email)
        // console.log(productId)
        // console.log(product.name)
        // var cartI=new cartItem({
        //     user:req.session.email,
        //     cart:req.session.cart,
        //     totalQty:req.session.cart.totalQty
        // })
        // cartI.save().then(()=>{
//         req.flash('successCart','Added to cart successfully.')
//         res.redirect('/products')
//         // })
//     })
// }
// app.get('/addToCart/:id',cartAdd)
// if(!req.session.cart){
//     return res.render('buyNow.ejs',{product:products, message:req.flash('message'),successCart:req.flash('successCart'),totalQty:null,mage:products.image,alt:products.alt,name:products.name,title:products.title,categ:products.category,description:products.description,price:products.price,id:products.id})
// }  
// var cart=new Cart(req.session.cart)
// if(!req.session.cart){
//     // console.log(orders.length)
//     if(orders.length==0){
//         // console.log('empty')
//         return res.render('myorders.ejs',{product:null,order:null,totalQty:null})
//     }
//     else{
//         // console.log('something')
//         return res.render('myorders.ejs',{product:null,order:orders,totalQty:null})
//     }
// }   
// var cart=new Cart(req.session.cart)

// app.get('/myCart',(req,res)=>{
//     if(req.session.email){
//         if(!req.session.cart){
//             return res.render('mycart.ejs',{product:null})
//         }   
//         var cart=new Cart(req.session.cart)
//         res.status(200).render('myCart.ejs',{product:cart.generateArray(),totalPrice:cart.totalPrice,totalQty:cart.totalQty})
//         // {cartQty:req.session.cart.totalQty}
//     }
//     else{
//         req.flash('messagea','You need to login first.')
//         res.redirect('/login')
//     }
    
// })

// CONTACT NUMBER CHANGE REQUEST
// app.post('/contact',async(req,res)=>{
//     var bodyp=req.body
//     var userp=await userRegister.findOne({email:req.session.email})
//     await userRegister.updateOne({email:req.session.email},{$set:{contact:bodyp.contact}})
//     var userp=await userRegister.findOne({email:req.session.email})
//     req.flash('successCont','Contact Number changed successfully.')
//     res.redirect('/settings')
// })

// // CITY CHANGE REQUEST
// app.post('/city',async(req,res)=>{
//     var bodycity=req.body
//     console.log(req.session.email)
//     var userpcity=await userRegister.findOne({email:req.session.email})
//     console.log(userpcity)
//     id=userpcity.id
//     console.log(id)
//     await userRegister.updateOne({id:id},{$set:{city:bodycity.city}})
//     req.flash('successCity','Your City Name changed successfully.')
//     res.redirect('/settings')
// })