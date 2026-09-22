import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const messages = [
  "Keep your fishing trips, catches, locations and lures together in one intelligent fishing journal.",
  "Remember every catch.",
  "Discover what works and where.",
  "Turn fishing memories into useful knowledge."
];

function Landing() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let fadeTimer;
    let changeTimer;

    function startCycle() {
      fadeTimer = setTimeout(() => {
        setFading(true);

        changeTimer = setTimeout(() => {
          setMessageIndex(
            (current) => (current + 1) % messages.length
          );

          setFading(false);
          startCycle();
        }, 1000);
      }, 5000);
    }

    startCycle();

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(changeTimer);
    };
  }, []);

  return (
    <main className="landing-page">
      <div className="landing-overlay">
        <div className="landing-content">

          <div
            className={`landing-message ${
              fading ? "landing-message-fade" : ""
            }`}
          >
            {messages[messageIndex]}
          </div>

          <div className="landing-actions">
            <Link className="primary-link" to="/login">
              Log in
            </Link>

            <Link className="secondary-link" to="/register">
              Create account
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

export default Landing;
