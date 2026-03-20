import PropTypes from 'prop-types';
import { ageGroupOptions } from '../../hooks/usePets';

function PetFilters({ filters, filterOptions, onChange }) {
  return (
    <section className="filter-bar" aria-label="Pet filters">
      <label>
        Search by name or breed
        <input
          name="search"
          value={filters.search}
          onChange={onChange}
          placeholder="Try Labrador or Luna"
        />
      </label>

      <label>
        Species
        <select name="species" value={filters.species} onChange={onChange}>
          <option value="">All species</option>
          {filterOptions.species.map((species) => (
            <option key={species} value={species}>
              {species}
            </option>
          ))}
        </select>
      </label>

      <label>
        Breed
        <select name="breed" value={filters.breed} onChange={onChange}>
          <option value="">All breeds</option>
          {filterOptions.breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </label>

      <label>
        Age
        <select name="ageGroup" value={filters.ageGroup} onChange={onChange}>
          {ageGroupOptions.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}

PetFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    breed: PropTypes.string.isRequired,
    ageGroup: PropTypes.string.isRequired,
  }).isRequired,
  filterOptions: PropTypes.shape({
    species: PropTypes.arrayOf(PropTypes.string).isRequired,
    breeds: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PetFilters;
