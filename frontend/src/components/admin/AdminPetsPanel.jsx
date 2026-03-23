import PropTypes from 'prop-types';

function AdminPetsPanel({
  adminState,
  onCreate,
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
      <div className="section-head">
        <div>
          <p className="panel-label">Admin Pets</p>
          <h2>Manage pets</h2>
        </div>
        <button className="primary-button" type="button" onClick={onCreate}>
          Add pet
        </button>
      </div>

      <p className="application-copy">
        View the current pet listings below. Use add to create a new listing, or edit any
        existing pet.
      </p>

      <div className="admin-list">
        {adminState.loading ? <p className="application-copy">Loading pets...</p> : null}
        {adminState.items.map((pet) => (
          <article className="admin-item" key={pet._id}>
            <div className="admin-item-copy">
              <div className="admin-item-head">
                <h3>{pet.name}</h3>
                <span className={`status-pill ${pet.adoptionStatus}`}>{pet.adoptionStatus}</span>
              </div>
              <p>
                {pet.breed} - {pet.location}
              </p>
              <p className="admin-subtle">
                {pet.species} • {pet.age} years • {pet.size}
              </p>
            </div>
            <div className="admin-actions admin-pet-controls">
              <label className="status-select">
                <span>Status</span>
                <select
                  value={pet.adoptionStatus}
                  onChange={(event) => onStatusChange(pet._id, event.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="adopted">Adopted</option>
                </select>
              </label>
              <button className="secondary-button admin-action-button" type="button" onClick={() => onEdit(pet)}>
                Edit
              </button>
              <button
                className="secondary-button danger-button admin-action-button"
                type="button"
                onClick={() => onDelete(pet._id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {adminState.isFormOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={onReset}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pet-form-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-header">
              <div>
                <p className="panel-label">Pet Form</p>
                <h2 id="pet-form-title">{adminState.editingId ? 'Edit pet' : 'Add pet'}</h2>
              </div>
              <button className="icon-button" type="button" onClick={onReset}>
                Close
              </button>
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

              <div className="modal-actions admin-field-wide">
                <button className="secondary-button" type="button" onClick={onReset}>
                  Cancel
                </button>
                <button className="primary-button" type="submit" disabled={adminState.saving}>
                  {adminState.saving
                    ? 'Saving...'
                    : adminState.editingId
                      ? 'Update pet'
                      : 'Create pet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
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
    isFormOpen: PropTypes.bool.isRequired,
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
  onCreate: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default AdminPetsPanel;
