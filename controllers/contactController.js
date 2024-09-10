const multer = require('multer')

const {contactListing  , addContact , checkFileType, totalContacts , pagination, deleteContact , getContactData} = require('../function')



const {errorHandler} = require('../middleware/errorMiddleware')
const { error } = require('jquery')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        // cb(null, `${Date.now()}--${file.originalname}`);
        try {
        	cb(null, `${Date.now()}--${file.originalname}`);
		} catch(err) {
			cb(err)
		}
    },
    onError: function(error , next){
        next(error)      
    }
})

var upload = multer({ 
    storage: storage,
    limits: { fileSize: 1000000},
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
})

// let multerMid = upload.single('image')

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// add contact

let add = (req , res , next ) => {

    try{
        let errors = req.flash('error')[0] || {}
        let contactData = req.flash('contactData')[0] || {}
    
        if(errors.length){
            errors = JSON.parse(errors);                    
        }
        console.log(errors);   
        
        return res.render('pages/addContact' , {errors, contactData })

    }
    catch(e){
        next(e)
    }

}

// save Contact funciton 
let saveContact = async (req , res , next) => {

    try{
        req.flash('contactData' , req.body)

        if (req.fileValidationError) {
            req.flash('error' , {image:[req.fileValidationError]})
            console.log(` video error : ${req.fileValidationError}`);
            // console.log(res.redirect)            
            return res.redirect('/contact/addContact')
        }
        else{                
            let contactData = req.body 
                
            if(req.file) {
                contactData['image'] = req.file.filename         
                let result = await addContact(contactData , req)    
                
                console.log(result);
                
                
                if (result) {
                    req.flash('success' , "contact created successfully!")    
                    return res.redirect('/contact/contactListing')
                } 
                else{                    

                    throw new Error('something went wrong please try again')

                    // req.flash('error' , 'something went wrong please try again')
                    // res.redirect('back')
                    // return false
                }  
            }
            else{
                req.flash('error' , {'image' : ['Image is required..']} )
                res.redirect('back')  
                return false                  
            }
            
        }
    }
    catch(e){
        console.log('inside catch')
        
        next(e)
    }
    
}

// Contacat listing
let contactList = async (req ,res) => {

    let error = {}
    let data = []
    let total = await totalContacts()
    let page = req.params.page || 1
    if (totalContacts) {
        let paginationParams = await pagination(total , 5, page)
        // console.log(paginationParams)
        let contactList = await contactListing(paginationParams.start , paginationParams.end)

        // console.log(contactList)

        if (Array.isArray(contactList)) {
            data = contactList     
        }
        else{
            error = contactList
        }    
        res.render('pages/contactListing' , {data , error, 'totalPages':paginationParams.noOfPages})
    }  
}

// delete contact
let contactDelete =  (req , res) => {
    let id = req.params.id
    let result = deleteContact(id);
}

let getContact = async (req , res) => {
    let id = req.params.id
    let contact = await getContactData(id)

    console.log(contact);
    

    res.render('pages/contactProfile' , {contact})
}



module.exports = {
    saveContact,
    contactList,
    contactDelete,
    add,
    getContact
}