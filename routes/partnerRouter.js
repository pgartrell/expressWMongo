const express =  require('express')
const Partner = require('../models/partner')
const authenticate = require('../authenticate')

const partnerRouter = express.Router()

partnerRouter.route('/')

//No need for setHeader or statusCode bc we did this above
.get((req, res, next) => {
    Partner.find() //Queries the database for all the documents in the campsite model
    .then( partners =>{ //accesses the results from the find method 
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(partners) //sends json data to the client in the response stream and will automatically close it. So res.end is not needed
    })
    .catch(err => next(err)) //passes error to express
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Partner.create(req.body) //Create new campsite from the info on request body. It will also check the data to make sure it fits the Schema 
    .then(partner => {
        console.log('Partner Created', partner)
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(partner)
    })
    .catch(err => next(err))
})

.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /partners')
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res,next) => {
    Partner.deleteMany()
    //reponse object tells us how many documents we have deleted 
    .then(response => {
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(response)
    })
    .catch(err => next(err))
});



partnerRouter.route('/:partnerId')

// Allow us to store whatever the client sends as part of the path after the / as a route param named campsiteId
.get((req, res, next) => {
    Partner.findById(req.params.partnerId) //Getting parsed from the HTTP request from whatever the user typed in 
    .then(partner => {
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(partner)
    })
    .catch(err => next(err))
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Partner.findByIdAndUpdate(req.params.partnerId, {
        $set: req.body
    }, { new: true }) //To get back info from updated document as a result of this operation
    //Once document is sent back, execute below code 
    .then(partner => {
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(partner)
    })
    .catch(err => next(err))
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response => {
        res.statusCode = 200
        res.header('Content-Type', 'application/json')
        res.json(response)
    })
    .catch(err => next(err))
})

module.exports = partnerRouter