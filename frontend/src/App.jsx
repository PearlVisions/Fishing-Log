import {
  BrowserRouter,
  Routes,
  Route,
  NavLink
} from "react-router-dom";

import "./App.css";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";
import Trips from "./pages/Trips";
import Catches from "./pages/Catches";
import Locations from "./pages/Locations";
import Lures from "./pages/Lures";
import Species from "./pages/Species";

import ProtectedRoute from "./components/ProtectedRoute";

function AppLayout({ children }) {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Fishing Log</h1>
        <p>AI-native fishing journal</p>
      </header>

      <nav className="main-nav">
        <NavLink to="/home">
          Home
        </NavLink>

        <NavLink to="/trips">
          Trips
        </NavLink>

        <NavLink to="/catches">
          Catches
        </NavLink>

        <NavLink to="/locations">
          Locations
        </NavLink>

        <NavLink to="/lures">
          Lures
        </NavLink>

        <NavLink to="/species">
          Species
        </NavLink>
      </nav>

      <main className="app-main">
        {children}
      </main>

      <footer className="app-footer">
        Fishing Log v0.2.0
      </footer>
    </div>
  );
}

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>
        {children}
      </AppLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/home"
          element={
            <ProtectedPage>
              <Home />
            </ProtectedPage>
          }
        />

        <Route
          path="/trips"
          element={
            <ProtectedPage>
              <Trips />
            </ProtectedPage>
          }
        />

        <Route
          path="/catches"
          element={
            <ProtectedPage>
              <Catches />
            </ProtectedPage>
          }
        />

        <Route
          path="/locations"
          element={
            <ProtectedPage>
              <Locations />
            </ProtectedPage>
          }
        />

        <Route
          path="/lures"
          element={
            <ProtectedPage>
              <Lures />
            </ProtectedPage>
          }
        />

        <Route
          path="/species"
          element={
            <ProtectedPage>
              <Species />
            </ProtectedPage>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
