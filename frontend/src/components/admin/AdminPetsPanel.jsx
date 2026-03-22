import PropTypes from 'prop-types';

function AdminPetsPanel({
  adminState,
  onFieldChange,
  onSubmit,
  onEdit,
  onReset,
  onDelete,
  onStatusChange,
}) {
  const { formState } = adminState;

  return (
    <section className="admin-card">
      <div className="admin-header">
        <div>
          <p className="panel-label">Admin Pets</p>
          <h2>{adminState.editingId ? 'Edit pet' : 'Add pet'}</h2>
        </div>
        {adminState.editingId ? (
          <button className="secondary-button" type="button" onClick={onReset}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Name
          <input name="name" value={formState.name} onChange={onFieldChange} required />
        </label>
        <label>
          Species
          <input name="species" value={formState.species} onChange={onFieldChange} required />
        </label>
        <label>
          Breed
          <input name="breed" value={formState.breed} onChange={onFieldChange} required />
        </label>
        <label>
          Age
          <input name="age" type="number" min="0" value={formState.age} onChange={onFieldChange} required />
        </label>
        <label>
          Gender
          <select name="gender" value={formState.gender} onChange={onFieldChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label>
          Size
          <select name="size" value={formState.size} onChange={onFieldChange}>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </label>
        <label>
          Location
          <input name="location" value={formState.location} onChange={onFieldChange} required />
        </label>
        <label>
          Status
          <select name="adoptionStatus" value={formState.adoptionStatus} onChange={onFieldChange}>
            <option value="available">available</option>
            <option value="pending">pending</option>
            <option value="adopted">adopted</option>
          </select>
        </label>
        <label className="admin-field-wide">
          Image URL
          <input name="imageUrl" value={formState.imageUrl} onChange={onFieldChange} required />
        </label>
        <label className="admin-field-wide">
          Description
          <textarea name="description" value={formState.description} onChange={onFieldChange} rows="4" required />
        </label>
        <label>
          Energy
          <select name="energyLevel" value={formState.energyLevel} onChange={onFieldChange}>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </select>
        </label>
        <label className="admin-field-wide">
          Good With
          <input
            name="goodWith"
            value={formState.goodWith}
            onChange={onFieldChange}
            placeholder="Children, Apartments"
          />
        </label>
        <label className="admin-field-wide">
          Medical Notes
          <textarea name="medicalNotes" value={formState.medicalNotes} onChange={onFieldChange} rows="3" />
        </label>
        <label className="checkbox-row">
          <input
            name="vaccinated"
            type="checkbox"
            checked={formState.vaccinated}
            onChange={onFieldChange}
          />
          Vaccinated
        </label>

        {adminState.error ? <p className="notice error admin-field-wide">{adminState.error}</p> : null}
        {adminState.success ? <p className="notice success admin-field-wide">{adminState.success}</p> : null}

        <button className="primary-button admin-field-wide" type="submit" disabled={adminState.saving}>
          {adminState.saving
            ? 'Saving...'
            : adminState.editingId
              ? 'Update pet'
              : 'Create pet'}
        </button>
      </form>

      <div className="admin-list">
        {adminState.loading ? <p className="application-copy">Loading pets...</p> : null}
        {adminState.items.map((pet) => (
          <article className="admin-item" key={pet._id}>
            <div>
              <h3>{pet.name}</h3>
              <p>
                {pet.breed} · {pet.location}
              </p>
            </div>
            <div className="admin-actions">
              <select
                value={pet.adoptionStatus}
                onChange={(event) => onStatusChange(pet._id, event.target.value)}
              >
                <option value="available">available</option>
                <option value="pending">pending</option>
                <option value="adopted">adopted</option>
              </select>
              <button className="secondary-button" type="button" onClick={() => onEdit(pet)}>
                Edit
              </button>
              <button className="secondary-button danger-button" type="button" onClick={() => onDelete(pet._id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

AdminPetsPanel.propTypes = {
  adminState: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired,
    saving: PropTypes.bool.isRequired,
    editingId: PropTypes.string.isRequired,
    formState: PropTypes.shape({
      name: PropTypes.string.isRequired,
      species: PropTypes.string.isRequired,
      breed: PropTypes.string.isRequired,
      age: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      adoptionStatus: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      energyLevel: PropTypes.string.isRequired,
      goodWith: PropTypes.string.isRequired,
      vaccinated: PropTypes.bool.isRequired,
      medicalNotes: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default AdminPetsPanel;

