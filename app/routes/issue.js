const express = require('express');
const router = express.Router();
const issueController = require("./../../app/controllers/issueController");
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth')
const multer = require('multer');


module.exports.setRouter = (app) => {

    
    let issueUrl=`${appConfig.apiVersion}/issue`;
// Multer File upload settings
const DIR = './public/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});


// Multer Mime Type Validation
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 15
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" ||file.mimetype=="text/txt") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});


//for creating new issue
app.post(`${issueUrl}/create-issue`,upload.single('attachment'),issueController.createIssue);
/**
* @apiGroup issue
* @apiVersion  1.0.0
* @api {post} /api/v1/issue/create-issue to create-issue.
*
* @apiParam {string} userId userId of the user. (auth headers) (required)
*
* @apiSuccess {object} myResponse shows error status, message, http status code, result.
* 
* @apiSuccessExample {object} Success-Response:
 {
    "error": false,
    "message": "Logged Out Successfully",
    "status": 200,
    "data": null

}
*/

app.get(`${issueUrl}/getAllIssues`, auth.isAuthorized, issueController.getAllIssues);
/**
* @apiGroup issue
* @apiVersion  1.0.0
* @api {get} /api/v1/issue/getAllIssues to getAllIssues.
*
* @apiParam {string} userId userId of the user. (auth headers) (required)
*
* @apiSuccess {object} myResponse shows error status, message, http status code, result.
* 
* @apiSuccessExample {object} Success-Response:
 {
    "error": false,
    "message": "Logged Out Successfully",
    "status": 200,
    "data": null

}
*/

app.get(`${issueUrl}/:issueId`, auth.isAuthorized, issueController.getAnIssue);
/**
* @apiGroup issue
* @apiVersion  1.0.0
* @api {get} /api/v1/issue/:issueId to get an issue.
*
* @apiParam {string} userId userId of the user. (auth headers) (required)
*
* @apiSuccess {object} myResponse shows error status, message, http status code, result.
* 
* @apiSuccessExample {object} Success-Response:
 {
    "error": false,
    "message": "Logged Out Successfully",
    "status": 200,
    "data": null

}
*/


}