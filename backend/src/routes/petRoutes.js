import express from 'express';
import mongoose from 'mongoose';
import { requireAuth, requireRole } from '../middleware/auth.js';
import Pet from '../models/Pet.js';
import {
  availableAgeGroups,
  buildPetQuery,
  createPaginationMeta,
  normalizePagination,
} from '../utils/petFilters.js';

const router = express.Router();

function mapPetPayload(body) {
  return {
    name: body.name?.trim(),
    species: body.species?.trim(),
    breed: body.breed?.trim(),
    age: Number(body.age),
    gender: body.gender,
    size: body.size,
    location: body.location?.trim(),
    adoptionStatus: body.adoptionStatus,
    imageUrl: body.imageUrl?.trim(),
    description: body.description?.trim(),
    energyLevel: body.energyLevel,
    goodWith: Array.isArray(body.goodWith)
      ? body.goodWith.map((item) => item.trim()).filter(Boolean)
      : [],
    vaccinated: Boolean(body.vaccinated),
    medicalNotes: body.medicalNotes?.trim() || '',
  };
}

function validatePetPayload(payload) {
  const requiredFields = [
    'name',
    'species',
    'breed',
    'gender',
    'size',
    'location',
    'adoptionStatus',
    'imageUrl',
    'description',
    'energyLevel',
  ];

  for (const field of requiredFields) {
    if (!payload[field]) {
      return `${field} is required`;
    }
  }

  if (!Number.isFinite(payload.age) || payload.age < 0) {
    return 'age must be a valid number';
  }

  return '';
}

router.get('/', async (req, res) => {
  const { page, limit, skip } = normalizePagination(req.query.page, req.query.limit);
  const query = buildPetQuery(req.query);

  const [items, totalItems, distinctSpecies, distinctBreeds] = await Promise.all([
    Pet.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Pet.countDocuments(query),
    Pet.distinct('species', { adoptionStatus: 'available' }),
    Pet.distinct('breed', { adoptionStatus: 'available' }),
  ]);

  res.json({
    items,
    pagination: createPaginationMeta({ page, limit, totalItems }),
    filters: {
      species: distinctSpecies.sort(),
      breeds: distinctBreeds.sort(),
      ageGroups: availableAgeGroups(),
    },
  });
});

router.get('/admin/all', requireAuth, requireRole('admin'), async (_req, res) => {
  const items = await Pet.find().sort({ createdAt: -1 }).lean();
  res.json({ items });
});

router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: 'Invalid pet id' });
    return;
  }

  const pet = await Pet.findOne({
    _id: req.params.id,
    adoptionStatus: 'available',
  }).lean();

  if (!pet) {
    res.status(404).json({ message: 'Pet not found' });
    return;
  }

  res.json({ item: pet });
});

router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const payload = mapPetPayload(req.body);
  const validationError = validatePetPayload(payload);

  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const item = await Pet.create(payload);
  res.status(201).json({ item });
});

router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: 'Invalid pet id' });
    return;
  }

  const payload = mapPetPayload(req.body);
  const validationError = validatePetPayload(payload);

  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const item = await Pet.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!item) {
    res.status(404).json({ message: 'Pet not found' });
    return;
  }

  res.json({ item });
});

router.patch('/:id/status', requireAuth, requireRole('admin'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: 'Invalid pet id' });
    return;
  }

  const { adoptionStatus } = req.body;

  if (!['available', 'pending', 'adopted'].includes(adoptionStatus)) {
    res.status(400).json({ message: 'Valid adoptionStatus is required' });
    return;
  }

  const item = await Pet.findByIdAndUpdate(
    req.params.id,
    { adoptionStatus },
    { new: true, runValidators: true },
  );

  if (!item) {
    res.status(404).json({ message: 'Pet not found' });
    return;
  }

  res.json({ item });
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: 'Invalid pet id' });
    return;
  }

  const item = await Pet.findByIdAndDelete(req.params.id);

  if (!item) {
    res.status(404).json({ message: 'Pet not found' });
    return;
  }

  res.status(204).send();
});

export default router;
