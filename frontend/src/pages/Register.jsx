import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  registerUser,
  setToken
} from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== passwordAgain) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await registerUser({
        display_name: displayName,
        email,
        password
      });

      setToken(result.token);

      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Create account</h1>

        <label>
          Name
          <input
            type="text"
            value={displayName}
            onChange={(event) =>
              setDisplayName(event.target.value)
            }
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </label>

        <label>
          Password again
          <input
            type="password"
            value={passwordAgain}
            onChange={(event) =>
              setPasswordAgain(event.target.value)
            }
            required
          />
        </label>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? "Creating account..."
            : "Create account"}
        </button>

        <p>
          Already registered?{" "}
          <Link to="/login">
            Log in
          </Link>
        </p>

        <Link to="/">
          Back to introduction
        </Link>
      </form>
    </main>
  );
}

export default Register;
