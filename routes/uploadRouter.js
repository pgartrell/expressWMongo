const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');

//Multer provides default values for below, but we added our own
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images') //Saving it to the images file so it can be accessed from the outside world
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname) //So the name of the file on the server is the same on the client side. Otherwise it will give a random string 
    }
})

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {//Checks to see if the file extension is not one of these imageFile extensions
        return cb(new Error('You can upload only image files!'), false) //false says to reject the file upload
        }
        cb(null, true)//At this point of the block we know the file extenseion is like one of the above, null means no error
        
    }

const upload = multer({storage: storage, fileFilter: imageFileFilter}) //configured to store uploads

const uploadRouter = express.Router()

uploadRouter.route('/') //To handle the http requests

.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403
    res.end('GET operation not supported on /imageUpload')
})

//Means we are expecting single upload of a file called imageFile
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file); //contains a bunch of different information about the file sending back to the client
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /imageUpload')
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403
    res.end('DELETE operation not supported on /imageUpload')
})



module.exports = uploadRouter