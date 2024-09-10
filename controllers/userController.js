const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const { log } = require('console')
const axios = require('axios')
const {register , listing , validateLogin  , checkFileType, } = require('../function')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

let userRegister = (req, res) => {

    let errors = req.flash('validationError')[0] || {}
    let data = req.flash('data')[0] || {}

    if(errors.length){
        errors = JSON.parse(errors);                    
    }

    return res.render('pages/index', { errors, data })
}

let submit = async (req, res) => {
    let data = req.body
    req.flash('data', data)
    
    let result = await register(data, req)  

    if (result) {
        return res.redirect(`/user/login`)
    }

    return res.redirect('back')

}

let userListing = async (req, res) => {

    let error = {}
    let data = []
    let user_list = await listing()

    if (Array.isArray(user_list)) {
        data = user_list
    }
    else {
        error = user_list
    }

    return res.render('pages/listing', { data, error })

}

let home = (req , res) => {

    return res.render('pages/home')

}

let login = (req, res) => {

    let msg = req.flash('success')[0] || {}

    console.log(msg);    

    res.render('pages/login' , {msg})
}

let checkLogin = async (req, res) => {

    let data = req.body
    let result = await validateLogin(data)
    // console.log(result)    
    if (result.is_success) {

        console.log(result.access_token)        

        localStorage.setItem('access_token' , result.access_token)
        
        return res.redirect('/user/home')
    }
    res.redirect('/user/login')  

}

let logout = async (req , res) => {

    const headers = {
        'Authorization': 'Bearer '+localStorage.getItem('access_token')
    }
    try{
        let response = await axios.post("http://127.0.0.1:8000/api/logout" ,{}, {headers : headers})
        if (response.data.is_success) {
            localStorage.removeItem('access_token')            
            return res.redirect('/user/login')
        }
        else{
            console.log('Failed to logout')            
        }
    }
    catch(error){
        console.log(` error from laravel : ${error}`)        
    }
}

module.exports = {
    userRegister,
    submit,
    userListing,
    home,
    login,
    checkLogin,
    logout
}