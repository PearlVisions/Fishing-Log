import { Link } from "react-router-dom";

function Home() {
  return (
    <section>
      <div className="page-heading">
        <h2>Fishing Log</h2>
        <p>Fishing trips, catches, locations and equipment.</p>
      </div>

      <div className="dashboard-grid">
        <Link className="dashboard-card" to="/trips">
          <h3>Fishing trips</h3>
          <p>Create and manage fishing trips.</p>
        </Link>

        <Link className="dashboard-card" to="/catches">
          <h3>Catches</h3>
          <p>Record and review catches.</p>
        </Link>

        <Link className="dashboard-card" to="/locations">
          <h3>Locations</h3>
          <p>Manage fishing waters and areas.</p>
        </Link>

        <Link className="dashboard-card" to="/lures">
          <h3>Lures</h3>
          <p>Manage your lure collection.</p>
        </Link>

        <Link className="dashboard-card" to="/species">
          <h3>Fish species</h3>
          <p>Manage fish species.</p>
        </Link>
      </div>
    </section>
  );
}

export default Home;
