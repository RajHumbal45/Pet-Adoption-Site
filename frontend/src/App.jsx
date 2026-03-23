import { useState } from 'react';
import AdminApplicationsPanel from './components/admin/AdminApplicationsPanel';
import AdminPetsPanel from './components/admin/AdminPetsPanel';
import AuthPanel from './components/auth/AuthPanel';
import ToastViewport from './components/ui/ToastViewport';
import UserDashboard from './components/dashboard/UserDashboard';
import { useAdminApplications } from './hooks/useAdminApplications';
import { useAdminPets } from './hooks/useAdminPets';
import { useAuth } from './hooks/useAuth';
import { useMyApplications } from './hooks/useMyApplications';
import { useToastQueue, useToastSignal } from './hooks/useToastQueue';
import PetListingPage from './pages/PetListingPage';

function App() {
  const [adminTab, setAdminTab] = useState('pets');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { mode, setMode, formState, authState, updateField, submitAuth, logout } = useAuth();
  const { applicationState, refreshApplications } = useMyApplications(authState.user);
  const {
    adminState,
    openCreateForm,
    updateField: updateAdminField,
    startEditing,
    resetForm,
    submitPet,
    removePet,
    updateStatus,
  } = useAdminPets(authState.user);
  const { adminApplicationsState, reviewApplication } = useAdminApplications(authState.user);
  const isAdmin = authState.user?.role === 'admin';
  const { toasts, pushToast, dismissToast } = useToastQueue();
  const profileLabel = authState.user ? authState.user.name : 'Guest';
  const profileRole = isAdmin ? 'Shelter Admin' : authState.user ? 'Pet Adopter' : 'Browsing only';
  const profileMeta = authState.user ? authState.user.email : 'Sign in to apply and track requests';
  const profileInitials = authState.user
    ? authState.user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : 'G';

  useToastSignal(authState.error, 'error', pushToast);
  useToastSignal(authState.success, 'success', pushToast);
  useToastSignal(adminState.error, 'error', pushToast);
  useToastSignal(adminState.success, 'success', pushToast);
  useToastSignal(adminApplicationsState.error, 'error', pushToast);
  useToastSignal(adminApplicationsState.success, 'success', pushToast);
  useToastSignal(applicationState.error, 'error', pushToast);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <p className="eyebrow">Pet Adoption</p>
          <div>
            <h1 className="brand-title">Pet Adoption Management</h1>
            <p className="brand-subtitle">
              Browse pets, track requests, and manage applications in one place.
            </p>
          </div>
        </div>

        <div className="topbar-actions">
          {authState.user ? (
            <button
              className="profile-trigger"
              type="button"
              aria-haspopup="dialog"
              aria-expanded={isProfileOpen}
              onClick={() => setIsProfileOpen(true)}
            >
              <span className="profile-avatar" aria-hidden="true">{profileInitials}</span>
              <span className="profile-trigger-copy">
                <strong>{profileLabel}</strong>
                <small>{profileRole}</small>
              </span>
            </button>
          ) : (
            <div className="guest-indicator">
              <span className="profile-avatar" aria-hidden="true">G</span>
              <span className="profile-trigger-copy">
                <strong>Guest</strong>
                <small>Browse available pets</small>
              </span>
            </div>
          )}
        </div>
      </header>

      {authState.user && isProfileOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsProfileOpen(false)}>
          <section
            className="modal-card profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="profile-modal-head">
              <div className="profile-modal-identity">
                <span className="profile-avatar profile-avatar-large" aria-hidden="true">
                  {profileInitials}
                </span>
                <div>
                  <p className="panel-label">Profile</p>
                  <h2 id="profile-modal-title">{profileLabel}</h2>
                  <p className="application-copy">{profileRole}</p>
                </div>
              </div>
              <button className="icon-button" type="button" onClick={() => setIsProfileOpen(false)}>
                Close
              </button>
            </div>

            <div className="profile-modal-grid">
              <div>
                <span>Name</span>
                <strong>{authState.user.name}</strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{profileMeta}</strong>
              </div>
              <div>
                <span>Access</span>
                <strong>{authState.user.role}</strong>
              </div>
              <div>
                <span>Workspace</span>
                <strong>{isAdmin ? 'Admin panel' : 'User dashboard'}</strong>
              </div>
            </div>

            <div className="profile-modal-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setIsProfileOpen(false)}
              >
                Done
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
              >
                Logout
              </button>
            </div>
          </section>
        </div>
      ) : null}

      <section className={`workspace-layout${isAdmin || authState.user ? ' admin-layout' : ''}`}>
        <div className="main-stack">
          {authState.user && !isAdmin ? (
            <UserDashboard
              user={authState.user}
              applications={applicationState}
            />
          ) : null}

          {!isAdmin ? (
            <PetListingPage
              currentUser={authState.user}
              onApplicationCreated={refreshApplications}
              onToast={pushToast}
            />
          ) : null}

          {isAdmin ? (
            <section className="admin-workspace">
              <div className="admin-shell">
                <div className="admin-tabs-header">
                  <div>
                    <p className="panel-label">Admin Panel</p>
                    <h2>Manage shelter activity</h2>
                    <p className="application-copy">
                      Switch between pet listings and adoption requests.
                    </p>
                  </div>
                  <div className="admin-tab-summary">
                    <div>
                      <span>Pets</span>
                      <strong>{adminState.items.length}</strong>
                    </div>
                    <div>
                      <span>Applications</span>
                      <strong>{adminApplicationsState.items.length}</strong>
                    </div>
                  </div>
                </div>

                <div className="admin-tab-bar" role="tablist" aria-label="Admin sections">
                  <button
                    className={`admin-tab${adminTab === 'pets' ? ' active' : ''}`}
                    type="button"
                    role="tab"
                    aria-selected={adminTab === 'pets'}
                    onClick={() => setAdminTab('pets')}
                  >
                    Manage Pets
                  </button>
                  <button
                    className={`admin-tab${adminTab === 'applications' ? ' active' : ''}`}
                    type="button"
                    role="tab"
                    aria-selected={adminTab === 'applications'}
                    onClick={() => setAdminTab('applications')}
                  >
                    Review Applications
                  </button>
                </div>

                {adminTab === 'pets' ? (
                  <AdminPetsPanel
                    adminState={adminState}
                    onCreate={openCreateForm}
                    onFieldChange={updateAdminField}
                    onSubmit={submitPet}
                    onEdit={startEditing}
                    onReset={resetForm}
                    onDelete={removePet}
                    onStatusChange={updateStatus}
                  />
                ) : (
                  <AdminApplicationsPanel
                    applicationState={adminApplicationsState}
                    onReview={reviewApplication}
                  />
                )}
              </div>
            </section>
          ) : null}
        </div>

        {!isAdmin && !authState.user ? (
          <div className="sidebar-stack">
            <AuthPanel
              mode={mode}
              onModeChange={setMode}
              formState={formState}
              authState={authState}
              onFieldChange={updateField}
              onSubmit={submitAuth}
              onLogout={logout}
              applications={applicationState}
            />
          </div>
        ) : null}
      </section>

      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}

export default App;
