import mongoose from 'mongoose';

const adoptionApplicationSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
      trim: true,
      default: '',
      maxlength: 400,
    },
  },
  {
    timestamps: true,
  },
);

adoptionApplicationSchema.index({ pet: 1, applicant: 1, status: 1 });

const AdoptionApplication = mongoose.model(
  'AdoptionApplication',
  adoptionApplicationSchema,
);

export default AdoptionApplication;

