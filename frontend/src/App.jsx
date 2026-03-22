import AdminApplicationsPanel from './components/admin/AdminApplicationsPanel';
import AdminPetsPanel from './components/admin/AdminPetsPanel';
import AuthPanel from './components/auth/AuthPanel';
import UserDashboard from './components/dashboard/UserDashboard';
import { useAdminApplications } from './hooks/useAdminApplications';
import { useAdminPets } from './hooks/useAdminPets';
import { useAuth } from './hooks/useAuth';
import { useMyApplications } from './hooks/useMyApplications';
import PetListingPage from './pages/PetListingPage';

function App() {
  const { mode, setMode, formState, authState, updateField, submitAuth, logout } = useAuth();
  const { applicationState, refreshApplications } = useMyApplications(authState.user);
  const {
    adminState,
    updateField: updateAdminField,
    startEditing,
    resetForm,
    submitPet,
    removePet,
    updateStatus,
  } = useAdminPets(authState.user);
  const { adminApplicationsState, reviewApplication } = useAdminApplications(authState.user);

  return (
    <main className="app-shell">
      <section className="workspace-layout">
        <div className="main-stack">
          {authState.user ? (
            <UserDashboard
              user={authState.user}
              applications={applicationState}
              onLogout={logout}
            />
          ) : (
            <section className="hero adoption-shell">
              <div className="hero-copy">
                <p className="eyebrow">Adoption Flow</p>
                <h1>Browse pets, sign in, and submit adoption requests from one workflow.</h1>
                <p className="intro">
                  Visitors can browse, while registered users can apply to adopt and
                  monitor their application history from a dedicated dashboard.
                </p>
              </div>
              <div className="hero-accent">
                <span>Signed-in status</span>
                <strong>Guest</strong>
              </div>
            </section>
          )}

          <PetListingPage
            currentUser={authState.user}
            onApplicationCreated={refreshApplications}
          />
        </div>

        <div className="sidebar-stack">
          {!authState.user || authState.user.role === 'admin' ? (
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
          ) : null}

          {authState.user?.role === 'admin' ? (
            <>
              <AdminPetsPanel
                adminState={adminState}
                onFieldChange={updateAdminField}
                onSubmit={submitPet}
                onEdit={startEditing}
                onReset={resetForm}
                onDelete={removePet}
                onStatusChange={updateStatus}
              />
              <AdminApplicationsPanel
                applicationState={adminApplicationsState}
                onReview={reviewApplication}
              />
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default App;
