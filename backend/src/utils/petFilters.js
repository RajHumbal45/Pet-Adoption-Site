const AGE_GROUPS = {
  young: { min: 0, max: 2 },
  adult: { min: 3, max: 7 },
  senior: { min: 8, max: Number.POSITIVE_INFINITY },
};

export function normalizePagination(pageValue, limitValue) {
  const page = Math.max(Number.parseInt(pageValue || '1', 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(limitValue || '6', 10) || 6, 1), 24);

  return { page, limit, skip: (page - 1) * limit };
}

export function buildPetQuery({ search, species, breed, ageGroup }) {
  const query = {
    adoptionStatus: 'available',
  };

  if (search?.trim()) {
    query.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { breed: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  if (species?.trim()) {
    query.species = species.trim();
  }

  if (breed?.trim()) {
    query.breed = breed.trim();
  }

  if (ageGroup && AGE_GROUPS[ageGroup]) {
    const { min, max } = AGE_GROUPS[ageGroup];
    query.age = max === Number.POSITIVE_INFINITY ? { $gte: min } : { $gte: min, $lte: max };
  }

  return query;
}

export function createPaginationMeta({ page, limit, totalItems }) {
  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}

export function availableAgeGroups() {
  return Object.keys(AGE_GROUPS);
}

