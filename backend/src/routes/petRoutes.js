import express from 'express';
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

export default router;

