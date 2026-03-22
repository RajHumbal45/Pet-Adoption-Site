import express from 'express';
import mongoose from 'mongoose';
import Pet from '../models/Pet.js';
import {
  availableAgeGroups,
  buildPetQuery,
  createPaginationMeta,
  normalizePagination,
} from '../utils/petFilters.js';

const router = express.Router();

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

export default router;
