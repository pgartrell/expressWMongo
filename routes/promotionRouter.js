const express =  require('express')
const promotionRouter = express.Router()

promotionRouter.route('/')
.all((req, res, next) => { //catch all routing method. Any http req will trigger this method
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain') //send back plain text in response body
    next() //Pass control to the next available routing method
})

//No need for setHeader or statusCode bc we did this above
.get((req, res) => {
    res.end('Will send all the promotions to you')//Sends message back to the client
})

.post((req, res) => {
    res.end(`Will add the the promotions: ${req.body.name} with description: ${req.body.description}`)
})

.put((req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /promotions')
})

.delete((req, res) => {
    res.end('Deleting all promotions')
});


promotionRouter.route('/:promotionId')
.all((req, res, next) => { //catch all routing method. Any http req will trigger this method
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain') //send back plain text in response body
    next() //Pass control to the next available routing method
})

// Allow us to store whatever the client sends as part of the path after the / as a route param named campsiteId
.get((req, res) => {
    res.end(`Will send details of the promotions: ${req.params.promotionId} to you`)
})

.post((req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
})

.put((req, res) => {
    res.write(`Updating the promotions: ${req.params.promotionId}\n`);
    res.end(`Will update the promotions: ${req.body.name}
        with description: ${req.body.description}`);
})

.delete((req, res) => {
    res.end(`Deleting promotions: ${req.params.promotionId}`);
});

module.exports = promotionRouter