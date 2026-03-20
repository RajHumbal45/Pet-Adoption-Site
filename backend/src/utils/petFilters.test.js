import test from 'node:test';
import assert from 'node:assert/strict';
import {
  availableAgeGroups,
  buildPetQuery,
  createPaginationMeta,
  normalizePagination,
} from './petFilters.js';

test('normalizePagination applies defaults and bounds', () => {
  assert.deepEqual(normalizePagination(undefined, undefined), {
    page: 1,
    limit: 6,
    skip: 0,
  });

  assert.deepEqual(normalizePagination('0', '100'), {
    page: 1,
    limit: 24,
    skip: 0,
  });
});

test('buildPetQuery includes search and filters', () => {
  assert.deepEqual(
    buildPetQuery({
      search: 'lab',
      species: 'Dog',
      breed: 'Labrador',
      ageGroup: 'adult',
    }),
    {
      adoptionStatus: 'available',
      $or: [
        { name: { $regex: 'lab', $options: 'i' } },
        { breed: { $regex: 'lab', $options: 'i' } },
      ],
      species: 'Dog',
      breed: 'Labrador',
      age: { $gte: 3, $lte: 7 },
    },
  );
});

test('createPaginationMeta reports navigation state', () => {
  assert.deepEqual(createPaginationMeta({ page: 2, limit: 6, totalItems: 17 }), {
    page: 2,
    limit: 6,
    totalItems: 17,
    totalPages: 3,
    hasPreviousPage: true,
    hasNextPage: true,
  });
});

test('availableAgeGroups stays stable for the listing UI', () => {
  assert.deepEqual(availableAgeGroups(), ['young', 'adult', 'senior']);
});

