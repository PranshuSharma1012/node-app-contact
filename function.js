const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const axios = require('axios')
const path = require('path')
const {user} = require('./model/user')

let register = async (data, req) => {
    try {
        // const newObj = new user(data)

        let response = await axios.post("http://127.0.0.1:8000/api/user/register", data)
        let result = await response.data
        
        if(result.is_success){
            req.flash('success' , "Registration SuccessFul !")
            console.log('registration successful!')
            return 'true'
        }
        else{
            req.flash('validationError' , result.error)
            console.log(result.error);
            
            return 'false 2'
        }
    }
    catch (error) {
        req.flash('error', error)
        return 'false 1'
    }

}

let listing = async (req, res) => {

    try {

        let response = await axios.get("http://127.0.0.1:8000/api/users/get")

        if (response.data.is_success) {
            return response.data.users
        }

        return response.data.message

    }
    catch (error) {
        return error
    }
}

let validateLogin = async (data) => {

    try {
        let response = await axios.post("http://127.0.0.1:8000/api/login", data)
        if (response.data.is_success) {         
            return response.data
        }
        return response.data.error
    }
    catch (error) {
        return error
    }
}

let addContact = async(contactData , req) => {
    const headers = {
        'Authorization' : 'Bearer '+localStorage.getItem('access_token'),
        'Content-Type' : 'application/json'
    }
    try{
        let response = await axios.post('http://127.0.0.1:8000/api/addContact' , contactData , {headers:headers})
        let result = await response.data

        console.log(result);        
        if(result.is_success){
            req.flash('success' , "Contact Inserter Successfully !")
            // console.log('Contact Inserter Successfully!')
            return true
        }
        else{
            req.flash('error' , result.error)
            // console.log(result.error);
            
            return false 
        }
        
    }
    catch(error){
        req.flash('error' ,error )
        return false
               
    }
}


let contactListing = async (start , end) => {
    const headers = {
        'Authorization' : 'Bearer '+localStorage.getItem('access_token'),
        'Content-Type' : 'application/json'
    }
    try{
        let response = await axios.post('http://127.0.0.1:8000/api/contact/get' , {start , end} , {headers:headers})
        // console.log(response);
        let result = await response.data.contacts

        if (response.data.is_success) {
            return result           
        }
        return response.data.message
    }
    catch(error){
        console.log(`Error from catch ${error}`);        
    }
}

let deleteContact = async (id , res) => {  
    const headers = {
        'Authorization' : 'Bearer '+localStorage.getItem('access_token'),
        'Content-Type' : 'application/json'
    }
    try{
        let response = await axios.post('http://127.0.0.1:8000/api/deleteContact' , {id} , {headers:headers})
        console.log(response)

        if (response.data.is_success) {
            return true           
        }
        else{
            return false
        }
    }
    catch(error){
        console.log(`Error from catch : ${error}`);        
    }
}

function checkFileType(req , file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
        return cb(null, true);
    } else {  
        req.fileValidationError ='Error: Images only! (jpeg, jpg, png, gif)'
        return cb(null , false , req.fileValidationError);
    }
}

let pagination = (total , limit = 5 , page = 1) => {

    if (total && limit && page) {
        let noOfPages = Math.ceil(total/limit)
        let start = (page - 1) * limit
        let end = start + limit
    
        return {noOfPages , start , end}
        
    }
    return false
}

let totalContacts = async () => {
    const headers = {
        'Authorization' : 'Bearer '+localStorage.getItem('access_token'),
        'Content-Type' : 'application/json'
    }
    try{
        let response = await axios.post('http://127.0.0.1:8000/api/contact/count' , {} , {headers:headers})
        let result = await response.data

        if (response.data.is_success) {
            return result.total
        }
        return false
        
    }
    catch(error){
        console.log(`Error from catch ${error}`);        
    }
}

let getContactData = async (id) => {
    const headers = {
        'Authorization' : 'Bearer '+localStorage.getItem('access_token'),
        'Content-Type' : 'application/json'
    }
    try{
        let response = await axios.post('http://127.0.0.1:8000/api/getContactData' , {id} , {headers:headers})

        if (response.is_success = true) {
            return response.data.contact
        }
        return false
        // console.log(response.data.contact)        
    }
    catch(error){
        console.log(`error from catch ${error}`)        
    }
}


module.exports = {
    register,
    listing,
    validateLogin,
    addContact,
    contactListing,
    checkFileType,
    deleteContact,
    totalContacts,
    pagination,
    getContactData
}

// errors, logout , edit , contact add , delete , edit