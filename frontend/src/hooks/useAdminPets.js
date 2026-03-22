import { useEffect, useState } from 'react';
import api from '../api';

const initialFormState = {
  name: '',
  species: '',
  breed: '',
  age: '',
  gender: 'Male',
  size: 'Medium',
  location: '',
  adoptionStatus: 'available',
  imageUrl: '',
  description: '',
  energyLevel: 'Moderate',
  goodWith: '',
  vaccinated: true,
  medicalNotes: '',
};

function mapPetToForm(pet) {
  return {
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    age: String(pet.age),
    gender: pet.gender,
    size: pet.size,
    location: pet.location,
    adoptionStatus: pet.adoptionStatus,
    imageUrl: pet.imageUrl,
    description: pet.description,
    energyLevel: pet.energyLevel,
    goodWith: pet.goodWith.join(', '),
    vaccinated: pet.vaccinated,
    medicalNotes: pet.medicalNotes || '',
  };
}

function mapFormToPayload(formState) {
  return {
    ...formState,
    age: Number(formState.age),
    goodWith: formState.goodWith
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

export function useAdminPets(user) {
  const [adminState, setAdminState] = useState({
    items: [],
    loading: false,
    error: '',
    success: '',
    saving: false,
    editingId: '',
    formState: initialFormState,
  });

  useEffect(() => {
    let isActive = true;

    if (!user || user.role !== 'admin') {
      setAdminState((current) => ({
        ...current,
        items: [],
        loading: false,
        error: '',
        success: '',
        saving: false,
        editingId: '',
        formState: initialFormState,
      }));
      return undefined;
    }

    async function loadPets() {
      setAdminState((current) => ({
        ...current,
        loading: true,
        error: '',
      }));

      try {
        const { data } = await api.get('/pets/admin/all');

        if (!isActive) {
          return;
        }

        setAdminState((current) => ({
          ...current,
          items: data.items,
          loading: false,
          error: '',
        }));
      } catch (error) {
        if (!isActive) {
          return;
        }

        setAdminState((current) => ({
          ...current,
          items: [],
          loading: false,
          error: error.response?.data?.message || 'Unable to load admin pets.',
        }));
      }
    }

    loadPets();

    return () => {
      isActive = false;
    };
  }, [user]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setAdminState((current) => ({
      ...current,
      formState: {
        ...current.formState,
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  }

  function startEditing(pet) {
    setAdminState((current) => ({
      ...current,
      editingId: pet._id,
      success: '',
      error: '',
      formState: mapPetToForm(pet),
    }));
  }

  function resetForm() {
    setAdminState((current) => ({
      ...current,
      editingId: '',
      success: '',
      error: '',
      formState: initialFormState,
    }));
  }

  async function refreshPets() {
    const { data } = await api.get('/pets/admin/all');
    setAdminState((current) => ({
      ...current,
      items: data.items,
    }));
  }

  async function submitPet(event) {
    event.preventDefault();

    setAdminState((current) => ({
      ...current,
      saving: true,
      error: '',
      success: '',
    }));

    try {
      const payload = mapFormToPayload(adminState.formState);

      if (adminState.editingId) {
        await api.put(`/pets/${adminState.editingId}`, payload);
      } else {
        await api.post('/pets', payload);
      }

      await refreshPets();
      setAdminState((current) => ({
        ...current,
        saving: false,
        editingId: '',
        formState: initialFormState,
        success: adminState.editingId ? 'Pet updated.' : 'Pet created.',
      }));
    } catch (error) {
      setAdminState((current) => ({
        ...current,
        saving: false,
        error: error.response?.data?.message || 'Unable to save pet.',
      }));
    }
  }

  async function removePet(id) {
    try {
      await api.delete(`/pets/${id}`);
      await refreshPets();
      setAdminState((current) => ({
        ...current,
        success: 'Pet deleted.',
        error: '',
      }));
    } catch (error) {
      setAdminState((current) => ({
        ...current,
        error: error.response?.data?.message || 'Unable to delete pet.',
      }));
    }
  }

  async function updateStatus(id, adoptionStatus) {
    try {
      await api.patch(`/pets/${id}/status`, { adoptionStatus });
      await refreshPets();
      setAdminState((current) => ({
        ...current,
        success: 'Pet status updated.',
        error: '',
      }));
    } catch (error) {
      setAdminState((current) => ({
        ...current,
        error: error.response?.data?.message || 'Unable to update status.',
      }));
    }
  }

  return {
    adminState,
    updateField,
    startEditing,
    resetForm,
    submitPet,
    removePet,
    updateStatus,
  };
}

