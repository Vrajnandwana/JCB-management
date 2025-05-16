// models/DailyLog.js
import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema({
  siteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    required: true
  },
  machineType: {
    type: String,
    required: true
  },
  hoursUsed: {
    type: Number,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const DailyLog = mongoose.model('DailyLog', dailyLogSchema);
export default DailyLog;
