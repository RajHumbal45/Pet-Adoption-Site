import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    species: {
      type: String,
      required: true,
      trim: true,
    },
    breed: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    size: {
      type: String,
      enum: ['Small', 'Medium', 'Large'],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    adoptionStatus: {
      type: String,
      enum: ['available', 'pending', 'adopted'],
      default: 'available',
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 600,
    },
    energyLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      required: true,
    },
    goodWith: {
      type: [String],
      default: [],
    },
    vaccinated: {
      type: Boolean,
      default: true,
    },
    medicalNotes: {
      type: String,
      trim: true,
      default: '',
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  },
);

petSchema.index({ name: 'text', breed: 'text' });

const Pet = mongoose.model('Pet', petSchema);

export default Pet;
