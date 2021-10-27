// REQUIRED
const { urlencoded } = require('express')
const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const cookieParser=require('cookie-parser')
var session=require('express-session')
var flash=require('connect-flash')
var Product=require('./products')
const PORT=process.env.PORT || 8080
var MongoStore=require('connect-mongo')
const products = require('./products')
var nodemailer = require('nodemailer');
const crypto=require('crypto')

// DATABASE CONNECTION
mongoose.connect('mongodb://localhost:27017/HealthandGenStore', {useNewUrlParser:true, useUnifiedTopology:true})

// USER SIGNUP SCHEMA
const registerSchema=new mongoose.Schema({
    fname: {
        type:String,
        required:true,
        index:true,
    },
    lname: {
        type:String,
        required:true,
        index:true
    },
    email: {
        type:String,
        required:true,
        index:{
            unique:true
        },
    },
    password: {
        type:String,
        required:true,
    },
    contact: {
        type:Number,
        required:true,
    },
    city: {
        type:String,
        required:true,
    },
    pcode: {
        type:Number,
        required:true,
    }
})

const userRegister=mongoose.model('userRegister',registerSchema)

// USER LOGIN SCHEMA
const loginSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
})
const userLogin=mongoose.model('userLogin',loginSchema)

// USER FORGOT PASSWORD SCHEMA
const forgotSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    }
})
const forgot=mongoose.model('forgot',forgotSchema)

// USER PASSWORD CHANGE SCHEMA
const changeSchema=new mongoose.Schema({
    oldPassword:{
        type:String,
        required:true,
    },
    newPassword:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true,
    }
})
const change=mongoose.model('change',changeSchema)

// USER PASSWORD FORGET - RESET SCHEMA
const resetSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    newPassword:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true,
    }
})
const reset=mongoose.model('reset',resetSchema)

// MESSAGE SCHEMA
const messageSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
})
const message=mongoose.model('message',messageSchema)

// ITEM SEARCH SCHEMA
const searchSchema=new mongoose.Schema({
    search: {
        type:String,
        required:true,
    }
})
const search=mongoose.model('search',searchSchema)

// ITEM BUY SCHEMA
const buySchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userRegister'
    },
    firstname:{
        type:String,
        ref:'userRegister'
    },
    lastname:{
        type:String,
        ref:'userRegister'
    },
    contact: {
        type:Number,
        required:true,
    },
    image:{
        type:String,
        required:true
    },
    alt:{
        type:String,
        required:true
    },
    itemId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
    },
    itemname:{
        type:String,
        ref:'products'
    },
    itemprice:{
        type:Number,
        ref:'products'
    },
    quantity:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:Number,
        ref:'products'
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pcode: {
        type:Number,
        required:true,
    },
    paymentMode:{
        type:String,
        required:true
    },
    date:{
        type:String
    },
    status:{
        type:String,
        default:'Pending'
    },
    dateTime:{
        type:Date,
        timezone:'+05:00'
    }
})
const buyItem=mongoose.model('buyItem',buySchema)

// TOKEN SCHEMA FOR PASSWORD FORGET
const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});
const token=mongoose.model('token',tokenSchema)


// APP
const app=express()

// USE
app.use('/static',express.static('static'))
app.use(urlencoded({extended: false}))
app.use(session({
    secret: '5892f8cd4422aa296bb0c9ebac1743be5b6c557b',
    resave: false,
    saveUninitialized: false ,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    store:MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false',
        dbName:'website',
        collectionName:'sessions'
    })
  }))
app.use(flash())
app.use(cookieParser())

// SET
app.set('view-engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.set("port",PORT);
// app.set('trust proxy', 1)

// HOME PAGE
app.get('/',(req,res)=>{
    res.status(200).render('index.ejs')
})

// ABOUT US PAGE
app.get('/aboutus',(req,res)=>{
    res.status(200).render('aboutus.ejs')
})

// LOGIN PAGE
app.get('/login',(req,res)=>{
    res.status(200).render('login.ejs',{errorp:req.flash('errorp'),erroru:req.flash('erroru'),messagea:req.flash('messagea'),success:req.flash('success'),successp:req.flash('successp')})
})

// CHECK FOR USER LOGIN
const logincheck= async(req,res)=>{
    var bodyl=req.body
    var userl=await userRegister.findOne({email:bodyl.email})
    if(userl){
        const validPassword=await bcrypt.compare(bodyl.password,userl.password)
        if(validPassword){
            sess=req.session
            sess.email=userl.email
            req.flash('message','Login Successful.')
            res.redirect('/products')
        }
        else{
            req.flash('errorp','Invalid Password')
            res.redirect('/login')
        }
    }
    else{
        req.flash('erroru','User with this Email does not exist.')
        res.redirect('/login')
    }
}
app.post('/loginuser',logincheck)

// SIGN UP PAGE
app.get('/signup',(req,res)=>{
    res.status(200).render('signup.ejs',{errore:req.flash('errore')})
})

// CHECK FOR USER SIGN UP
app.post('/userRegister',async(req,res)=>{
    const bodyr=req.body
    const userr=await userRegister.findOne({email:bodyr.email})
    if(userr==null){
        try {
            req.body.password=await bcrypt.hashSync(req.body.password,10)
            const data=new userRegister(req.body)
            data.save().then(()=>{
                req.flash('success','Registration Successful. You can Login now.')
                res.redirect('/login')
            })
        } 
        catch (error) {
            res.redirect('/signup')
        }
    }
    else{
        req.flash('errore','Email already exists.')
        res.redirect('/signup')
    }
})

// FORGOT PASSWORD VERIFICATION PAGE
app.get('/forgotPassVerify',(req,res)=>{
    res.status(200).render('forgotPassVerify.ejs',{successlink:req.flash('successlink')})
})

// FORGOT PASSWORD PAGE
app.get('/forgotPassword',(req,res)=>{
    res.status(200).render('forgotPass.ejs',{errorem:req.flash('errorem')})
})

// CHECK FOR FORGOT PASSWORD
app.post('/forgotp',async(req,res)=>{
    const bodye=req.body
    const usere=await userRegister.findOne({email:bodye.email})
    userid=usere.id
    // console.log(userid)
    email=bodye.email
    if(usere==null){
        req.flash('errorem','User with this Email does not exist.')
        res.redirect('/forgotPassword')
    }
    else{
        var tok=await token.findOne({userId:userid})
        if(!tok){
            tok= await new token({
                userId:userid,
                token:crypto.randomBytes(32).toString('hex')
            }).save()
        }
        const link=`http://localhost:8000/passwordReset/${userid}/${tok.token}`

        // TRANSPORTER FOR NODEMAILER
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'healthandgenstore@gmail.com',
                pass: 'hjsfqwzdmkxokfeu'
            }
        });
        // SETTING MAIL OPTIONS
        var mailOptions = {
            from: 'healthandgenstore@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: link
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          req.flash('successlink','An email with password reset link has been sent to your email.')
          res.redirect('/forgotPassVerify')
    }
})

// FORGOT PASSWORD - PASSWORD RESET
app.get('/passwordReset/:userId/:token',async(req,res)=>{
    const user = await userRegister.findById(req.params.userId);
    var userid=req.params.userId
        if (!user) {
            return res.status(400).send("invalid link or expired");
        }
    const tok=await token.findOne({
        userId:userid,
        token:req.params.token
    })
    if(!tok){
        return res.status(400).send('<h2 style="text-align:center;font-size:30px">Invalid Link or Expired.</h2>')
    }
    res.render('changePassword.ejs',{errorn:req.flash('errorn')})
    await(token.findOneAndDelete({userId:userid}))
})

// FORGOT PASSWORD - PASSWORD RESET REQUEST
app.post('/reset',async(req,res)=>{
    var bodyreset=req.body
    var userreset=await userRegister.findOne({email:bodyreset.email})
    userId=userreset.id
    // console.log(userId)
    bodyreset.confirmPassword=await bcrypt.hashSync(req.body.confirmPassword,10)
    const confirmPassword=await bcrypt.compareSync(bodyreset.newPassword,bodyreset.confirmPassword)
    if(confirmPassword){
        bodyreset.confirmPassword=await bcrypt.hashSync(req.body.newPassword,10)
        await userRegister.updateOne({_id:userId},{$set:{password:bodyreset.confirmPassword}})
        req.flash('successp','Password Reset Successful. You can login now.')
        res.redirect('/login')
    }
    else{
        req.flash('errorn','New Password and Confirm Password do not match.')
        return res.render('changePassword.ejs',{errorn:req.flash('errorn')})
    }
})

// PRODUCTS PAGE
app.get('/products',(req,res)=>{
    if(req.session.email){
        Product.find(function(err,products){
            res.status(200).render('products.ejs',{product:products, message:req.flash('message')})
        })
    }
    else{
        req.flash('messagea','You need to login first.')
        res.redirect('/login')
    }
})

app.get('/searchProduct',(req,res)=>{
    if(req.session.email){
        res.statusMessage(200),render('searchDisplay.ejs')
    }
    else{
        req.flash('messagea','You need to login first.')
        res.redirect('/login')
    }
})

// SEARCH BAR REQUEST
app.post('/searchItem',async(req,res)=>{
    if(req.session.email){
        var searchitem=req.body
        // var regex=new RegExp(searchitem.search)
        Product.find({description:{$regex:searchitem.search,$options:'$i'}},(err,products)=>{
            // console.log(products.length())
            if(products.length==0){
                res.status(200).render('searchDisplay.ejs',{product:null})
            }
            else{
                res.status(200).render('searchDisplay.ejs',{product:products})
            }
        })
    }
    else{
        req.flash('messagea','You need to login first.')
        res.redirect('/login')
    }
})

// PHYSIO PRODUCTS PAGE
app.get('/cat=physio',(req,res)=>{
    if(req.session.email){
        Product.find({category:'PHYSIO'},(err,products)=> {
            res.status(200).render('physio.ejs',{product:products})
        })
    }
    else{
        req.flash('messagea','You need to login first.')
        res.redirect('/login')
    }
})

// CARDIO PRODUCTS PAGE
app.get('/cat=cardio',(req,res)=>{
    if(req.session.email){
        Product.find({category:'CARDIO'},(err,products)=> {
            res.status(200).render('cardio.ejs',{product:products})
        })
    }
    else{
        req.flash('messagea','You need to login first.')
        res.redirect('/login')
    }
})

// WHEELCHAIR PRODUCTS PAGE
app.get('/cat=wheelchair',(req,res)=>{
    if(req.session.email){
        Product.find({category:'WHEELCHAIR'},(err,products)=> {
            res.status(200).render('wheelchair.ejs',{product:products})
        })
    }
    else{
        req.flash('messagea','You need to login first.')
        res.redirect('/login')
    }
})

// GENERAL PRODUCTS PAGE
app.get('/cat=general',(req,res)=>{
    if(req.session.email){
        Product.find({category:'GENERAL'},(err,products)=> {
            res.status(200).render('general.ejs',{product:products})
        })
    }
    else{
        req.flash('messagea','You need to login first.')
        res.redirect('/login')
    }
})

// RADIO PRODUCTS PAGE
app.get('/cat=radio',(req,res)=>{
    if(req.session.email){
        Product.find({category:'RADIO'},(err,products)=> {
            res.status(200).render('radio.ejs',{product:products})
        })
    }
    else{
        req.flash('messagea','You need to login first.')
        res.redirect('/login')
    }
})

// BUY NOW PAGE
app.get('/buyNow/:id',(req,res)=>{
    if(req.session.email){
        var productID=req.params.id
        var findProduct=Product.findById(productID,function(err,products) {
            if(err){
                return res.redirect('/products')
            }
            id=products.id
            image=products.image
            alt=products.alt
            name=products.name
            title=products.title
            categ=products.category
            description=products.description
            price=products.price
            res.render('buyNow.ejs',{image:products.image,alt:products.alt,name:products.name,title:products.title,categ:products.category,description:products.description,price:products.price,id:products.id})     
        })
    }
    else{
        req.flash('messagea','You need to login first.')
        res.redirect('/login')
    }
})

// MY PROFILE PAGE
app.get('/myProfile',async(req,res)=>{
    if(req.session.email){
        var userp=await userRegister.findOne({email:req.session.email})
        // console.log(userp)
        var userfname=userp.fname
        var userlname=userp.lname
        var email=userp.email
        var contact=userp.contact
        var city=userp.city
        var pincode=userp.pcode
        res.status(200).render('myProfile.ejs',{userfname:userp.fname,userlname:userp.lname,email:userp.email,contact:userp.contact,city:userp.city,pincode:userp.pcode})
    }
    else{
        req.flash('messagea','You need to login first.')
        res.redirect('/login')
    }
})

// MY ORDERS PAGE
app.get('/myOrders',async(req,res)=>{
    if(req.session.email){
        // console.log(req.session.email)
        var userfind = await userRegister.findOne({email:req.session.email})
        id=userfind.id
        // console.log(id)
        buyItem.find({user:id},(err,orders)=>{
            if(orders.length==0){
                res.render('myorders.ejs',{product:null,order:null,successBuyDetails:req.flash('successBuyDetails')})
            }
            else{
                res.status(200).render('myorders.ejs',{order:orders,successBuyDetails:req.flash('successBuyDetails')})
            }
        })
    }
    else{
        req.flash('messagea','You need to login first.')
        res.redirect('/login')
    }
})

// WRITE TO US
app.get('/writeToUs',(req,res)=>{
    if(req.session.email){
        res.status(200).render('writetous.ejs',{messageSent:req.flash('messageSent')})
    }
    else{
        req.flash('messagea','You need to login first.')
        res.redirect('/login')
    }
})

// MESSAGE SEND REQUEST
app.post('/message',async(req,res)=>{
    const msg=new message({
        name:req.body.name,
        email:req.body.email,
        message:req.body.message
    })
    msg.save().then(()=>{
        req.flash('messageSent','Thank You for writing to us. We will get back to you shortly.')
        res.redirect('/writeToUs')
    })
})

// BUY ITEM REQUEST
app.post('/buyItem/:id',async(req,res)=>{
    if(req.session.email){
        var productid=req.params.id
        var findProduct=Product.findById(productid,function(err,products){
            if(err){
                return res.redirect('/products')
            }
            id=products.id
            image=products.image
            alt=products.alt
            name=products.name
            title=products.title
            categ=products.category
            description=products.description
            price=products.price
            // console.log(price)
        })
        var userp=await userRegister.findOne({email:req.session.email})
        console.log(req.body.paymentMode)
        fname=userp.fname
        lname=userp.lname
        uid=userp.id
        // console.log(id)
        qty=req.body.quantity
        pri=price
        total=qty*pri
        var currentDate = new Date();
        var d= currentDate.getDate();
        var month = currentDate.getMonth();
        var year = currentDate.getFullYear();
        var dateString = d + "-" +(month + 1) + "-" + year;
        var order=new buyItem({
            user:uid,
            firstname:fname,
            lastname:lname,
            image:image,
            alt:alt,
            contact:req.body.contact,
            itemId:productid,
            itemname:name,
            itemprice:price,
            totalPrice:total,
            quantity:req.body.quantity,
            address:req.body.address,
            city:req.body.city,
            state:req.body.state,
            pcode:req.body.pcode,
            paymentMode:req.body.paymentMode,
            date:dateString,
            dateTime:new Date()
        })
        var usersee=await userRegister.findOne({_id:uid})
        email=usersee.email
        // console.log(email)

        if(req.body.paymentMode=='Cash_on_delivery'){
            // TRANSPORTER FOR NODEMAILER
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'healthandgenstore@gmail.com',
                    pass: 'hjsfqwzdmkxokfeu'
                }
            });
            // SETTING MAIL OPTIONS
            var mailOptions = {
                from: 'healthandgenstore@gmail.com',
                to: email,
                subject: 'Order Placed',
                text: `Your Order has been placed successfully and will be delivered to you soon. You can find out the details of your order below.\nProduct Name : ${name}\nProduct Price :${pri}\nQuantity : ${qty}\nTotal Price : ${total}\nOrder Placed on : ${dateString}\nMode of Payment : ${req.body.paymentMode}\n\nThank You for Shopping with Us.\nRegards Health&Gen Store.`
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        order.save().then(()=>{
            req.flash('successBuyDetails','Order Placed Successfully.')
            res.redirect('/myOrders')
        })
    }
    else{
        req.flash('messagea','You need to login first.')
        res.redirect('/login')
    } 
})

// SETTINGS PAGE
app.get('/settings',async(req,res)=>{
    if(req.session.email){
        res.status(200).render('settings.ejs',{successp:req.flash('successp'),errorn:req.flash('errorn'),erroro:req.flash('erroro'),successCont:req.flash('successCont'),successCity:req.flash('successCity')})
    }
    else{
        req.flash('messagea','You need to login first.')
        res.redirect('/login')
    }
})

// PASSWORD CHANGE REQUEST
app.post('/change',async(req,res)=>{
    var bodyreset=req.body
    var userreset=await userRegister.findOne({email:req.session.email})
    userId=userreset.id
    // console.log(userId)
    const checkPassword=await bcrypt.compareSync(bodyreset.oldPassword,userreset.password)
    if(checkPassword){
        bodyreset.confirmPassword=await bcrypt.hashSync(req.body.confirmPassword,10)
        const confirmPassword=await bcrypt.compareSync(bodyreset.newPassword,bodyreset.confirmPassword)
        if(confirmPassword){
            bodyreset.confirmPassword=await bcrypt.hashSync(req.body.newPassword,10)
            await userRegister.updateOne({_id:userId},{$set:{password:bodyreset.confirmPassword}})
            req.flash('successp','Password Changed Successfully.')
            res.redirect('/settings')
        }
        else{
            req.flash('errorn','New Password and Confirm Password do not match.')
            res.redirect('/settings')
        }
    }
    else{
        req.flash('erroro','Invalid Old Password.')
        res.redirect('/settings')
    }
})

// LOGOUT
const logout=(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/')
        }
    })
}
app.get('/logout',logout)

// APP RUN
app.listen(PORT,()=>{
    console.log(`Port at ${{PORT}}`)
})