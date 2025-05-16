import mongoose from 'mongoose';

const siteSchema = new mongoose.Schema(
  {
    siteName: { type: String, required: true },
    contractorName: { type: String, required: true },
    projectType: { type: String },
    phone: { type: String },
    location: { type: String },
    startDate: { type: Date },
    status: { type: String, default: 'Active' },
    machines: [
      {
        type: { type: String, required: true }, // JCB, Breaker, etc.
        hourlyRate: { type: Number, required: true },
      },
    ],
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

const Site = mongoose.model('Site', siteSchema);

export default Site;
