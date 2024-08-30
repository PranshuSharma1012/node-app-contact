const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const axios = require('axios')
const path = require('path')

let register = async (data, req) => {
    try {
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
            console.log(result.error);
            
            return false 
        }
        
    }
    catch(error){
        req.flash('error' ,error )
        return false
               
    }
}


let contactListing = async (req , res) => {
    const headers = {
        'Authorization' : 'Bearer '+localStorage.getItem('access_token'),
        'Content-Type' : 'application/json'
    }
    try{
        let response = await axios.post('http://127.0.0.1:8000/api/contact/get' , {} , {headers:headers})
        let result = await response.data.contacts
        // console.log(` the result is : ${JSON.stringify(response.data.contacts)}`);

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

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {        
      return cb('Error: Images only! (jpeg, jpg, png, gif)');
    }
}


module.exports = {
    register,
    listing,
    validateLogin,
    addContact,
    contactListing,
    checkFileType,
    deleteContact
}

// errors, logout , edit , contact add , delete , edit