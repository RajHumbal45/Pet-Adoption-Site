import AuthPanel from './components/auth/AuthPanel';
import { useAuth } from './hooks/useAuth';
import { useMyApplications } from './hooks/useMyApplications';
import PetListingPage from './pages/PetListingPage';

function App() {
  const { mode, setMode, formState, authState, updateField, submitAuth, logout } = useAuth();
  const { applicationState, refreshApplications } = useMyApplications(authState.user);

  return (
    <main className="app-shell">
      <section className="hero adoption-shell">
        <div className="hero-copy">
          <p className="eyebrow">Adoption Flow</p>
          <h1>Browse pets, sign in, and submit adoption requests from one workflow.</h1>
          <p className="intro">
            This branch combines public browsing, pet details, account access, and the
            first user application flow.
          </p>
        </div>
        <div className="hero-accent">
          <span>Signed-in status</span>
          <strong>{authState.user ? 'Ready' : 'Guest'}</strong>
        </div>
      </section>

      <section className="workspace-layout">
        <PetListingPage
          currentUser={authState.user}
          onApplicationCreated={refreshApplications}
        />
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
      </section>
    </main>
  );
}

export default App;
