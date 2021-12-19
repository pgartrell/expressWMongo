const express =  require('express')
const campsiteRouter = express.Router()

//Chain all methods with same path together. removing the word "app" from methods and '/campsites' from .route() because it is already defined in the route in server.js
campsiteRouter.route('/')


.all((req, res, next) => { //catch all routing method. Any http req will trigger this method
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain') //send back plain text in response body
    next() //Pass control to the next available routing method
})

//No need for setHeader or statusCode bc we did this above
.get((req, res) => {
    res.end('Will send all the campsites to you')//Sends message back to the client
})

.post((req, res) => {
    res.end(`Will add the the campsite: ${req.body.name} with description: ${req.body.description}`)
})

.put((req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /campsites')
})

.delete((req, res) => {
    res.end('Deleting all campsites')
});

campsiteRouter.route('/:campsiteId')

.all((req, res, next) => { //catch all routing method. Any http req will trigger this method
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain') //send back plain text in response body
    next() //Pass control to the next available routing method
})

// Allow us to store whatever the client sends as part of the path after the / as a route param named campsiteId
.get((req, res) => {
    res.end(`Will send details of the campsite: ${req.params.campsiteId} to you`)
})

.post((req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})

.put((req, res) => {
    res.write(`Updating the campsite: ${req.params.campsiteId}\n`);
    res.end(`Will update the campsite: ${req.body.name}
        with description: ${req.body.description}`);
})

.delete((req, res) => {
    res.end(`Deleting campsite: ${req.params.campsiteId}`);
});



module.exports = campsiteRouter