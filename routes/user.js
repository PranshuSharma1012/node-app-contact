const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const {authMiddleware} = require('../middleware/middleware')

router.get('/register' , userController.userRegister)

router.post('/submit' , userController.submit)

router.get('/listing', userController.userListing)

router.get('/home' , authMiddleware , userController.home)

router.get('/login', userController.login)

router.post('/login', userController.checkLogin)

router.get('/logout' , userController.logout)

module.exports = router