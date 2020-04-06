const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const request = require("request")
/* Models */
const Auth = mongoose.model('Auth')

/* Const Library */
const logger = require('./../libs/loggerLib')
const responseLib = require('./../libs/responseLib')
const check = require('./../libs/checkLib')
const token = require('./../libs/tokenLib')

let isAuthorized = (req, res, next) => {
  

  if (req.params.authToken || req.query.authToken || req.body.authToken || req.header('authToken')) {
    Auth.findOne({authToken: req.header('authToken') || req.params.authToken || req.body.authToken || req.query.authToken}, (err, authDetails) => {
      if (err) {
        console.log(err)
        logger.error(err.message, 'AuthorizationMiddleware', 10)
        let apiResponse = responseLib.generate(true, 'Failed To Authorized', 500, null)
        res.send(apiResponse)
      } else if (check.isEmpty(authDetails)) {
        logger.error('No AuthorizationKey Is Present', 'AuthorizationMiddleware', 10)
        let apiResponse = responseLib.generate(true, 'Invalid Or Expired AuthorizationKey', 404, null)
        res.send(apiResponse)
      } else {
        token.verifyToken(authDetails.authToken,authDetails.tokenSecret,(err,decoded)=>{

            if(err){
                logger.error(err.message, 'Authorization Middleware', 10)
                let apiResponse = responseLib.generate(true, 'Failed To Authorized', 500, null)
                res.send(apiResponse)
            }
            else{
                
                req.user = {userId: decoded.data.userId}
                next()
            }


        });// end verify token
       
      }
    })
  } else {
    logger.error('AuthorizationToken Missing', 'AuthorizationMiddleware', 5)
    let apiResponse = responseLib.generate(true, 'AuthorizationToken Is Missing In Request', 400, null)
    res.send(apiResponse)
  }
}

let isAuthenticated = (req, res, next) => {
  console.log('--- inside isAuthorized function ---')

  if (req.params.apiKey || req.query.apiKey || req.body.apiKey || req.header('apiKey')) {
    let apiKey = req.params.apiKey || req.query.apiKey || req.body.apiKey || req.header('apiKey')
      let options = {
        method:'GET',
        uri:`https://gateways.edwisor.com/user-gateway/api/v1/user/project/auth?edProjectAuth=${apiKey}`
      }
      request(options,(err,response,body)=>{
       // console.log(body)
       if(err) {
         let apiResponse = responseLib.generate(true,'Failed To Validate Your Token',500, null)
           res.send(apiResponse)
       } else if(response.statusCode === 200) {
         body = JSON.parse(body)
          if(body.status === 200) {
              req.user = {fullName: `${body.data.firstName} ${body.data.lastName}`,firstName:body.data.firstName,lastName:body.data.lastName,email:body.data.email,mobileNumber: body.data.mobileNumber}
              next();
          } else {
            let apiResponse = responseLib.generate(true,'Expired Or Invalid Authentication Token',400, null)
              res.send(apiResponse)
          }
        } else {
            let apiResponse = responseLib.generate(true,'Could Not Fetch Token Details',400, null)
            res.send(apiResponse)
        }
      })

    } else {
    logger.error('Authentication Token Missing', 'Authentication Middleware', 5)
    let apiResponse = responseLib.generate(true, 'Authentication Token Is Missing In Request', 403, null)
    res.send(apiResponse)
  }
}

module.exports = {
  isAuthenticated: isAuthenticated,
  isAuthorized: isAuthorized
}
