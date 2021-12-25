const express =  require('express')
const Campsite = require('../models/campsite')

const campsiteRouter = express.Router()

//Chain all methods with same path together. removing the word "app" from methods and '/campsites' from .route() because it is already defined in the route in server.js
campsiteRouter.route('/')

.get((req, res, next) => {
    Campsite.find() //Queries the database for all the documents in the campsite model
    .then( campsites =>{ //accesses the results from the find method 
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(campsites) //sends json data to the client in the response stream and will automatically close it. So res.end is not needed
    })
    .catch(err => next(err)) //passes error to express
})

.post((req, res, next) => {
    Campsite.create(req.body) //Create new campsite from the info on request body. It will also check the data to make sure it fits the Schema 
    .then(campsite => {
        console.log('Campsite Created', campsite)
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(campsite)
    })
    .catch(err => next(err))
})

.put((req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /campsites')
})

.delete((req, res,next) => {
    Campsite.deleteMany()
    //reponse object tells us how many documents we have deleted 
    .then(response => {
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(response)
    })
    .catch(err => next(err))
});

campsiteRouter.route('/:campsiteId')

// Allow us to store whatever the client sends as part of the path after the / as a route param named campsiteId
.get((req, res, next) => {
    Campsite.findById(req.params.campsiteId) //Getting parsed from the HTTP request from whatever the user typed in 
    .then(campsite => {
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(campsite)
    })
    .catch(err => next(err))
})

.post((req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})

.put((req, res, next) => {
    Campsite.findByIdAndUpdate(req.params.campsiteId, {
        $set: req.body
    }, { new: true }) //To get back info from updated document as a result of this operation
    //Once document is sent back, execute below code 
    .then(campsite => {
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(campsite)
    })
    .catch(err => next(err))
})

.delete((req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(response)
    })
    .catch(err => next(err))
})

campsiteRouter.route('/:campsiteId/comments')
.get((req, res, next) => {
    Campsite.findById(req.params.campsiteId) //We do findById and not find because it is looking for a single campsites comment 
    .then( campsite =>{ //accesses the results from the find method 
        if (campsite) { //Accessing just the comments information inside the campsite object
            res.statusCode = 200
            res.header('Content-Type', 'application/json')
            res.json(campsite.comments) //sends json data to the client in the response stream and will automatically close it. So res.end is not needed
        } else {
            err = new Error(`Campsite ${req.params.campsiteId} not found`)
            err.status = 404
            return next(err)
        }
    })
    .catch(err => next(err)) //passes error to express
})

.post((req, res, next) => {
    Campsite.findById(req.params.campsiteId) //We do findById and not find because it is looking for a single campsites comment 
    .then( campsite =>{ //accesses the results from the find method 
        if (campsite) { //Accessing just the comments information inside the campsite object
            campsite.comments.push(req.body)//Creating new campsite info from the info on the request body. Also checks to make sure it matches the Schema
            campsite.save() //saving to the MongoDB Database
            .then(campsite => {
                res.statusCode = 200
                res.header('Content-Type', 'application/json')
                res.json(campsite) //sends json data to the client in the response stream and will automatically close it. So res.end is not needed
            })
            .catch(err => next(err))
        } else {
            err = new Error(`Campsite ${req.params.campsiteId} not found`)
            err.status = 404
            return next(err)
        }
    })
    .catch(err => next(err))
})

.put((req, res) => {
    res.statusCode = 403
    res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments`)
})

.delete((req, res,next) => {
    Campsite.findById(req.params.campsiteId) //We do findById and not find because it is looking for a single campsites comment 
    .then( campsite =>{ //accesses the results from the find method 
        if (campsite) { //Accessing just the comments information inside the campsite object
            //This for loop is going through each comment and removing it 
            for (let i = (campsite.comments.length-1); i>=0; i--){
                campsite.comments.id(campsite.comments[i]._id).remove()
            }
            campsite.save() //saving to the MongoDB Database
            .then(campsite => {
                res.statusCode = 200
                res.header('Content-Type', 'application/json')
                res.json(campsite) //sends json data to the client in the response stream and will automatically close it. So res.end is not needed
            })
            .catch(err => next(err))
        } else {
            err = new Error(`Campsite ${req.params.campsiteId} not found`)
            err.status = 404
            return next(err)
        }
    })
    .catch(err => next(err))
});

campsiteRouter.route('/:campsiteId/comments/:commentId')
.get((req, res, next) => {
    Campsite.findById(req.params.campsiteId) //We do findById and not find because it is looking for a single campsites comment 
    .then( campsite =>{ //accesses the results from the find method 
        if (campsite && campsite.comments.id(req.params.commentId)) { //Accessing just the comments information inside the campsite object
            res.statusCode = 200
            res.header('Content-Type', 'application/json')
            res.json(campsite.comments.id(req.params.commentId)) //sends json data to the client in the response stream and will automatically close it. So res.end is not needed
        //This is if the value of the campsite was truthy but the value of the comment was not
        } else if(!campsite) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`)
            err.status = 404
            return next(err)
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`)
            err.status = 404
            return next(err)
        } 
    })
    .catch(err => next(err)) //passes error to express
})

.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`);
})

.put((req, res, next) => {
    Campsite.findById(req.params.campsiteId) //We do findById and not find because it is looking for a single campsites comment 
    .then( campsite =>{ //accesses the results from the find method 
        if (campsite && campsite.comments.id(req.params.commentId)) { //Accessing just the comments information inside the campsite object
            if(req.body.rating) {
                campsite.comments.id(req.params.commentId).rating = req.body.rating
            }
            if(req.body.text) {
                campsite.comments.id(req.params.commentId).text = req.body.text //if text gets passed in, update it
            }
            campsite.save()
                .then(campsite => {
                    res.statusCode = 200
                    res.header('Content-Type', 'application/json')
                    res.json(campsite)
                })
                .catch(err => next(err))
        //This is if the value of the campsite was truthy but the value of the comment was not
        } else if(!campsite) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`)
            err.status = 404
            return next(err)
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`)
            err.status = 404
            return next(err)
        } 
    })
    .catch(err => next(err)) //passes error to express
})

.delete((req, res,next) => {
    Campsite.findById(req.params.campsiteId) //We do findById and not find because it is looking for a single campsites comment 
    .then( campsite =>{ //accesses the results from the find method 
        if (campsite && campsite.comments.id(req.params.commentId)) { //Accessing just the comments information inside the campsite object
            campsite.comments.id(req.params.commentId).remove()
            campsite.save()
                .then(campsite => {
                    res.statusCode = 200
                    res.header('Content-Type', 'application/json')
                    res.json(campsite)
                })
                .catch(err => next(err))
        //This is if the value of the campsite was truthy but the value of the comment was not
        } else if(!campsite) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`)
            err.status = 404
            return next(err)
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`)
            err.status = 404
            return next(err)
        } 
    })
    .catch(err => next(err))
});


module.exports = campsiteRouter










