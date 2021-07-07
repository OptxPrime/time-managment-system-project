const mongoose = require('mongoose');

const timelogSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: new Date()
  },
  time: {
      type: Number,
      required: true
  },
  notes: {
      type: [String],
  },
  userId:{
      type: String,
      required: true
  }
});

module.exports = mongoose.model('Timelog', timelogSchema);
