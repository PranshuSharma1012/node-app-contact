const multer = require('multer')
const {contactListing  , addContact , checkFileType} = require('../function')


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

let multerMid = upload.single('image')

// save Contact funciton 
let saveContact = (req , res) => {
    multerMid(req , res , async (error) => {
        req.flash('contactData' , req.body)

        if (error) {
            req.flash('error' , error)
            console.log(` video error : ${error}`);
            console.log(res.redirect)            
            return res.redirect('/addContact')
            
            return false
        }
        else{                
            let contactData = req.body 
                
            if(req.file) {
                contactData['image'] = req.file.filename         
                let result = await addContact(contactData , req)                    
                if (result) {
                    req.flash('success' , "contact created successfully!")    
                    return res.redirect('/contactListing')
                } 
                else{
                    req.flash('error' , 'something went wrong please try again')
                    res.redirect('back')
                    return false
                }  
            }
            else{
                req.flash('error' , {'image' : ['Image is required..']} )
                res.redirect('back')  
                return false                  
            }
            
        }
    })
}

// Contacat listing
let contactList = async (req ,res) => {

    let error = {}
    let data = []
    let contactList = await contactListing()
    

    if (Array.isArray(contactList)) {
        data = contactList     
    }
    else{
        error = contactList
    }

    res.render('pages/contactListing' , {data , error})
}

module.exports = {
    saveContact,
    contactList
}