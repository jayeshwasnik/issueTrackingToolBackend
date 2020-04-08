const mongoose = require('mongoose')
const Schema = mongoose.Schema
const time = require('../libs/timeLib')

const issueSchema = new Schema({
  issueId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  assignee: {
    type: String
  },
  watcher: {
    type: String
  },    
  timeOfCreation: {
    type: Date,
    default: time.now()
  },
  status: {
    type: String,
    default:'in-progress'
  },
  reporter: {
    type: String
  },
  comments: {
    type: String
  },
  //added this for attachments not sure
  attachment: 
    { type:String }


})

module.exports = mongoose.model('Issue', issueSchema)