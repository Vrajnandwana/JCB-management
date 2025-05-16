import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true },
  logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DailyLog' }],
  totalAmount: Number,
  generatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Bill', billSchema);
