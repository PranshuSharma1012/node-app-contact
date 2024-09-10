const express = require('express')
const router = express.Router()
const contactController = require('../controllers/contactController')
const {authMiddleware} = require('../middleware/middleware')
const multer = require('multer')
const {checkFileType} = require('../function.js')

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
        checkFileType(req , file, cb);
    }
})

router.get('/addContact', authMiddleware , contactController.add)

router.post('/submitContact',upload.single('image'), contactController.saveContact)

router.get('/contactListing/:page?',authMiddleware , contactController.contactList)

router.get('/contact/delete/:id' , contactController.contactDelete)

router.get('/getcontact/:id' , contactController.getContact)

module.exports = router
