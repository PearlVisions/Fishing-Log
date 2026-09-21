import {
  BrowserRouter,
  Routes,
  Route,
  NavLink
} from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Trips from "./pages/Trips";
import Catches from "./pages/Catches";
import Locations from "./pages/Locations";
import Lures from "./pages/Lures";
import Species from "./pages/Species";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <h1>Fishing Log</h1>
          <p>AI-native fishing journal</p>
        </header>

        <nav className="main-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/trips">Trips</NavLink>
          <NavLink to="/catches">Catches</NavLink>
          <NavLink to="/locations">Locations</NavLink>
          <NavLink to="/lures">Lures</NavLink>
          <NavLink to="/species">Species</NavLink>
        </nav>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/catches" element={<Catches />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/lures" element={<Lures />} />
            <Route path="/species" element={<Species />} />
          </Routes>
        </main>

        <footer className="app-footer">
          Fishing Log v0.1.0
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
