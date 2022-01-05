const cors = require('cors')

const whitelist = ('http://localhost:3000', 'https://localhost:3443')
const corsOptionsDelegate = (req, callback) => {
    let corsOptions
    console.log(req.header('Origin'))
    
    //Checking if an origin can be found in a whitelist and if it is not negative 1(since indexOf returns a number) then we allow the request to be accepted
    if (whitelist.indexOf(req.header('Origin')) !== -1){
        corsOptions = {origin: true}
    } else {
        corsOptions = {origin: false}
    }
    callback(null, corsOptions)
}

//Calling cors function imported earlier. When we call this it returns a middleware function that allows cors for all origins 
exports.cors = cors()

//returns middleware function and checks to see if incoming request belongs to the whitelisted origins like above. And if it does it will allow origin. 
exports.corsWithOptions = cors(corsOptionsDelegate)