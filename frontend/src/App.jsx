function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Project Setup</p>
        <h1>Pet Adoption Management System</h1>
        <p className="intro">
          Base workspace is ready for visitor browsing, user adoption flows, and admin
          management features.
        </p>
        <div className="status-grid">
          <article>
            <h2>Frontend</h2>
            <p>Vite, React, Axios, ESLint, and Vitest are configured.</p>
          </article>
          <article>
            <h2>Backend</h2>
            <p>Express API scaffolded with environment-based configuration.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default App;

