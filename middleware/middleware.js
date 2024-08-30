var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

let authMiddleware = (req , res , next) => {

    if(localStorage.getItem('access_token')){
        next()
        return false
        // exit()
    }
    
    res.redirect('/login')
    return false
    // exit()
}

module.exports = {
    authMiddleware
}