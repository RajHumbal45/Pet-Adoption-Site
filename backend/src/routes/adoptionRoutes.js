import express from 'express';
import mongoose from 'mongoose';
import { requireAuth, requireRole } from '../middleware/auth.js';
import AdoptionApplication from '../models/AdoptionApplication.js';
import Pet from '../models/Pet.js';

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  const { petId, message } = req.body;

  if (!mongoose.isValidObjectId(petId)) {
    res.status(400).json({ message: 'Valid pet id is required' });
    return;
  }

  const pet = await Pet.findOne({
    _id: petId,
    adoptionStatus: 'available',
  });

  if (!pet) {
    res.status(404).json({ message: 'This pet is no longer available for adoption' });
    return;
  }

  const existingApplication = await AdoptionApplication.findOne({
    pet: petId,
    applicant: req.user.id,
    status: { $in: ['pending', 'approved'] },
  });

  if (existingApplication) {
    res.status(409).json({ message: 'You already have an active application for this pet' });
    return;
  }

  const application = await AdoptionApplication.create({
    pet: petId,
    applicant: req.user.id,
    message: (message || '').trim(),
  });

  const populatedApplication = await AdoptionApplication.findById(application._id)
    .populate('pet', 'name species breed imageUrl location')
    .lean();

  res.status(201).json({
    item: populatedApplication,
    message: `Application submitted for ${pet.name}.`,
  });
});

router.get('/me', requireAuth, async (req, res) => {
  const items = await AdoptionApplication.find({ applicant: req.user.id })
    .populate('pet', 'name species breed imageUrl location')
    .sort({ createdAt: -1 })
    .lean();

  res.json({ items });
});

router.get('/admin/all', requireAuth, requireRole('admin'), async (_req, res) => {
  const items = await AdoptionApplication.find()
    .populate('pet', 'name species breed imageUrl location adoptionStatus')
    .populate('applicant', 'name email role')
    .sort({ createdAt: -1 })
    .lean();

  res.json({ items });
});

router.patch('/:id/status', requireAuth, requireRole('admin'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: 'Invalid application id' });
    return;
  }

  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    res.status(400).json({ message: 'Status must be approved or rejected' });
    return;
  }

  const application = await AdoptionApplication.findById(req.params.id);

  if (!application) {
    res.status(404).json({ message: 'Application not found' });
    return;
  }

  application.status = status;
  await application.save();

  if (status === 'approved') {
    await Pet.findByIdAndUpdate(application.pet, { adoptionStatus: 'adopted' });
    await AdoptionApplication.updateMany(
      {
        _id: { $ne: application._id },
        pet: application.pet,
        status: 'pending',
      },
      { status: 'rejected' },
    );
  }

  if (status === 'rejected') {
    const approvedForPet = await AdoptionApplication.exists({
      pet: application.pet,
      status: 'approved',
    });

    if (!approvedForPet) {
      await Pet.findByIdAndUpdate(application.pet, { adoptionStatus: 'available' });
    }
  }

  const item = await AdoptionApplication.findById(application._id)
    .populate('pet', 'name species breed imageUrl location adoptionStatus')
    .populate('applicant', 'name email role')
    .lean();

  res.json({
    item,
    message: `Application ${status}.`,
  });
});

export default router;
