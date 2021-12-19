const express =  require('express')
const partnerRouter = express.Router()

partnerRouter.route('/partner')
.all((req, res, next) => { //catch all routing method. Any http req will trigger this method
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain') //send back plain text in response body
    next() //Pass control to the next available routing method
})

//No need for setHeader or statusCode bc we did this above
.get((req, res) => {
    res.end('Will send all the partners to you')//Sends message back to the client
})

.post((req, res) => {
    res.end(`Will add the the partners: ${req.body.name} with description: ${req.body.description}`)
})

.put((req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /partners')
})

.delete((req, res) => {
    res.end('Deleting all partners')
});


partnerRouter.route('/:partnerId')
.all((req, res, next) => { //catch all routing method. Any http req will trigger this method
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain') //send back plain text in response body
    next() //Pass control to the next available routing method
})

// Allow us to store whatever the client sends as part of the path after the / as a route param named campsiteId
.get((req, res) => {
    res.end(`Will send details of the partners: ${req.params.partnerId} to you`)
})

.post((req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})

.put((req, res) => {
    res.write(`Updating the partners: ${req.params.partnerId}\n`);
    res.end(`Will update the partners: ${req.body.name}
        with description: ${req.body.description}`);
})

.delete((req, res) => {
    res.end(`Deleting partners: ${req.params.partnerId}`);
});

module.exports = partnerRouter