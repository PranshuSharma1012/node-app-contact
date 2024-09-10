const exp = require('constants')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const { log } = require('console')
const axios = require('axios')
const {authMiddleware} = require('./middleware/middleware')

const {errorHandler} = require('./middleware/errorMiddleware')

const {contactListing ,register , listing , validateLogin , addContact , checkFileType,deleteContact} = require('./function')
const multer = require('multer')
const {port} = require('./config')
const contactController = require('./controllers/contactController')
const userController = require('./controllers/userController')
const contactRoutes = require('./routes/contacts')
const userRoutes = require('./routes/user')



var LocalStorage = require('node-localstorage').LocalStorage;
// console.log(LocalStorage);
localStorage = new LocalStorage('./scratch');

require('./connection')
// const port = 3000
const app = express()

app.set('view engine', 'ejs')

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))

app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

app.use('/jquery/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.use(express.static('public'))

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'pranshu',
    saveUninitialized: true,
    resave: true
}));


app.use(flash());

app.use('/contact' , contactRoutes)
app.use('/user' , userRoutes)




var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}--${file.originalname}`);
    //   cb(null, file.originalname)
    },
    onError: function(error , next){
        next(error)      
    }
})

var upload = multer({ 
    storage: storage,
    limits: { fileSize: 1000000},
    fileFilter: function(req, file, cb) {
        checkFileType(req , file, cb);
    }
})


// ++++++++++++++++++++++++ My Work Below ++++++++++++++++++++++++++++
app.get('/profile' , (req , res) => {
    res.render('/pages/home')
})


// app.get('/test' , (req ,res , next) => {

//     console.log(req.flash('error'));
    
//     res.send('test page')

//     // try{

//         // let a = 1
//         // let b = 0
//         // let c = a/b

//         // console.log(c())       
        
//         // throw new Error('there is an error')
//     // }
//     // catch(e){
//     //     next(e)
//     // }

// })


app.use(errorHandler)

app.listen(port, function (error) {
    if (!error) {
        console.log(`server running on port no. ${port}`);

    }
})

























// app.get('/register', userController.userRegister)

// app.get('/register', (req, res) => {

//     let errors = req.flash('validationError')[0] || {}
//     let data = req.flash('data')[0] || {}

//     if(errors.length){
//         errors = JSON.parse(errors);                    
//     }

//     return res.render('pages/index', { errors, data })
// })

// app.post('/submit', userController.submit)
// app.post('/submit', async (req, res) => {
//     let data = req.body
//     req.flash('data', data)
    
//     let result = await register(data, req)  

//     if (result) {
//         return res.redirect(`/login`)
//     }

//     return res.redirect('back')

// })

// app.get('/listing', userController.userListing)
// app.get('/listing', async (req, res) => {

//     let error = {}
//     let data = []
//     let user_list = await listing()

//     if (Array.isArray(user_list)) {
//         data = user_list
//     }
//     else {
//         error = user_list
//     }

//     return res.render('pages/listing', { data, error })

// })

// app.get('/home' , authMiddleware , userController.home)
// app.get('/home' , authMiddleware , (req , res) => {

//     return res.render('pages/home')

// })

// app.get('/login', userController.login)
// app.get('/login', (req, res) => {

//     let msg = req.flash('success')[0] || {}

//     console.log(msg);    

//     res.render('pages/login' , {msg})
// })

// app.post('/login', userController.checkLogin)
// app.post('/login', async (req, res) => {

//     let data = req.body
//     let result = await validateLogin(data)
//     // console.log(result)    
//     if (result.is_success) {

//         console.log(result.access_token)        

//         localStorage.setItem('access_token' , result.access_token)
        
//         return res.redirect('/home')
//     }
//     res.redirect('/login')  

// })

// app.get('/logout' , userController.logout)

// app.get('/logout' , async (req , res) => {
//     const headers = {
//         'Authorization': 'Bearer '+localStorage.getItem('access_token')
//     }
//     try{
//         let response = await axios.post("http://127.0.0.1:8000/api/logout" ,{}, {headers : headers})
//         if (response.data.is_success) {
//             localStorage.removeItem('access_token')            
//             return res.redirect('/login')
//         }
//         else{
//             console.log('Failed to logout')            
//         }
//     }
//     catch(error){
//         console.log(` error from laravel : ${error}`)        
//     }
// })

// app.get('/addContact', authMiddleware , contactController.add)
// app.get('/addContact', authMiddleware ,
//     (req , res ) => {

//     let errors = req.flash('error')[0] || {}
//     let contactData = req.flash('contactData')[0] || {}

//     if(errors.length){
//         errors = JSON.parse(errors);                    
//     }

//     console.log(errors);
    
    
//     return res.render('pages/addContact' , {errors, contactData })
// })

// let multerMid = upload.single('image')

// ================= Contacts ====================== 

// app.post('/submitContact', contactController.saveContact)

// app.post('/submitContact' , (req , res) => {         
    // multerMid(req , res , async (error) => {
    //     req.flash('contactData' , req.body)

    //     if (error) {
    //         req.flash('error' , error)
    //         res.redirect('back')
    //     }
    //     else{                
    //         let contactData = req.body 
                
    //         if(req.file) {
    //             contactData['image'] = req.file.filename         
    //             let result = await addContact(contactData , req)                    
    //             if (result) {
    //                 req.flash('success' , "contact created successfully!")    
    //                 return res.redirect('/contactListing')
    //             } 
    //             else{
    //                 req.flash('error' , 'something went wrong please try again')
    //                 res.redirect('back')
    //                 }  
    //         }
    //         else{
    //             req.flash('error' , {'image' : ['Image is required..']} )
    //             res.redirect('back')                    
    //         }
            
    //     }
    // })
// })

// app.get('/contactListing/:page?',authMiddleware , contactController.contactList)
// app.get('/contactListing',authMiddleware , async (req ,res) => {

//     let error = {}
//     let data = []
//     let contactList = await contactListing()
    

//     if (Array.isArray(contactList)) {
//         data = contactList     
//     }
//     else{
//         error = contactList
//     }

//     res.render('pages/contactListing' , {data , error})
// })

// app.get('/contact/delete/:id' , contactController.contactDelete)

// app.get('/contact/delete/:id' , (req , res) => {
//     let id = req.params.id
//     let result = deleteContact(id);


// })



// function validate(data) {
//     let error = {}
//     // name
//     if (typeof data.name !== 'string' || data.name.trim() === '') {
//         error.name = 'Not A valid Name '
//     }
//     else if (data.name.length < 3 || data.name.length > 20) {
//         error.name = 'Name Must be between 3 to 20 characters'
//     }
//     // email 
//     if (typeof data.email !== 'string' || data.email.trim() === '') {
//         error.email = 'Not A valid email '
//     }
//     else if (data.email.length < 3 || data.email.length > 20) {
//         error.email = 'email Must be between 3 to 20 characters'
//     }

//     // pasword
//     if (typeof data.password !== 'string' || data.password.trim() === '') {

//         error.password = 'Not A valid password '
//     }
//     else if (data.password.length < 3 || data.password.length > 20) {
//         error.password = 'password Must be between 3 to 20 characters'
//     }

//     // phone

//     //  ++++++++++++++++++ Not working +++++++++++++++++++

//     if (!checkNumber(data.phone)) {
//         error.phone = 'Phone number contain only numbers.'
//     }
//     else if (data.phone.length < 10 || data.phone.length > 10) {
//         error.phone = 'phone number Must be 10 characters'
//     }


//     // city
//     if (typeof data.city !== 'string' || data.city.trim() === '') {
//         error.city = 'Not A valid city name'
//     }

//     return error
// }

// function checkNumber(str) {
//     for (let i = 0; i < str.length; i++) {
//         if (str[i] < '0' || str[i] > '9') {
//             return false;
//         }
//     }
//     return true;
// }


