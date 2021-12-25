const express =  require('express')
const Promotion = require('../models/promotion')

const promotionRouter = express.Router()

promotionRouter.route('/')

//No need for setHeader or statusCode bc we did this above
.get((req, res, next) => {
    Promotion.find() //Queries the database for all the documents in the campsite model
    .then( promotions =>{ //accesses the results from the find method 
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(promotions) //sends json data to the client in the response stream and will automatically close it. So res.end is not needed
    })
    .catch(err => next(err)) //passes error to express
})

.post((req, res, next) => {
    Promotion.create(req.body) //Create new campsite from the info on request body. It will also check the data to make sure it fits the Schema 
    .then(promotion => {
        console.log('Promotion Created', promotion)
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(promotion)
    })
    .catch(err => next(err))
})

.put((req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /promotions')
})

.delete((req, res,next) => {
    Promotion.deleteMany()
    //reponse object tells us how many documents we have deleted 
    .then(response => {
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(response)
    })
    .catch(err => next(err))
});


promotionRouter.route('/:promotionId')

// Allow us to store whatever the client sends as part of the path after the / as a route param named campsiteId
.get((req, res, next) => {
    Promotion.findById(req.params.promotionId) //Getting parsed from the HTTP request from whatever the user typed in 
    .then(promotion => {
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(promotion)
    })
    .catch(err => next(err))
})

.post((req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
})

.put((req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, { new: true }) //To get back info from updated document as a result of this operation
    //Once document is sent back, execute below code 
    .then(promotion => {
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(promotion)
    })
    .catch(err => next(err))
})

.delete((req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(response => {
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(response)
    })
    .catch(err => next(err))
})

module.exports = promotionRouter