const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib');
const check = require('../libs/checkLib');
const multer = require('multer');
var Regex = require("regex");

//router = express.Router();

/* Models */
const IssueModel = mongoose.model('Issue');

// Multer File upload settings
// const DIR = '../public/';


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, DIR);
//     },
//     filename: (req, file, cb) => {
//       const fileName = file.originalname.toLowerCase().split(' ').join('-');
//       cb(null, fileName)
//     }
//   });

// // Multer Mime Type Validation size limit is 15MB
// var upload = multer({
//     storage: storage,
//     limits: {
//       fileSize: 1024 * 1024 * 15
//     },
//     fileFilter: (req, file, cb) => {
//       if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//         cb(null, true);
//       } else {
//         cb(null, false);
//         return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//       }
//     }
//   });


let createIssue = (req, res) =>{

    //upload.single('attachment');
    const url = req.protocol + '://' + req.get('host');
    const issue = new IssueModel({
        issueId: shortid.generate(),
      title: req.body.title,
      description: req.body.description,
      assignee: req.body.assignee,
      watcher: req.body.watcher,
      timeOfCreation: time.now(),
      status: "in-progress",
      reporter: req.body.reporter,
      comments: req.body.comments,
      attachment: url + '/public/' + req.file.filename
    });



    issue.save().then(result => {
      console.log(result);
      res.status(201).json({
        message: "Issue Created successfully!",
        issueCreated: {
            issueId: result.issueId,
            title: result.title,
            description: result.description,
            assignee: result.assignee,
            watcher: result.watcher,
            timeOfCreation: result.timeOfCreation,
            status: result.status,
            reporter: result.reporter,
            comments: result.comments,
            attachment: result.attachment
        }
      })
    }).catch(err => {
      console.log(err),
        res.status(500).json({
          error: err
        });
    })

} 

// GET All User
 let getAllIssues=(req,res)=>{
    IssueModel.find().then(data => {
        res.status(200).json({
          message: "Issues retrieved successfully!",
          issues: data
        });
      });
      
 } 
  
  
  // GET User
  let getAnIssue=(req,res)=>{
    IssueModel.findById(req.params.issueId).then(data => {
        if (data) {
          res.status(200).json(post);
        } else {
          res.status(404).json({
            message: "Issue not found!"
          });
        }
      }); 
 } 

let getIssuesOfUser=(req,res)=>{
IssueModel.find({assignee:req.params.userName},function(err,data){
  if(err) res.send(err);
  res.send(data);
}
  );

  
}

let getIssueById=(req,res)=>{
  IssueModel.find({issueId:req.params.issueId},function(err,data){
    if(err) res.send(err);
    res.send(data);
  }
    );
}

let searchIssues=(req,res)=>{
  let searchString=req.params.searchString;
  console.log(searchString);
  var re = new RegExp(searchString, 'i');
  console.log(re);
  IssueModel.find({title:re},function(err,data){
    if(err) res.send(err);
    res.send(data);
  });
}




 module.exports = {

    createIssue: createIssue,
    getAllIssues: getAllIssues,
    getAnIssue: getAnIssue,
    getIssuesOfUser:getIssuesOfUser,
    searchIssues:searchIssues,
    getIssueById:getIssueById

}// end exports