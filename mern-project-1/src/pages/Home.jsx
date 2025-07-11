import { Link } from "react-router-dom";
import reactLogo from "../assets/react.svg";

function Home() {
  return (
    <div
      className="container py-5 d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "70vh" }}
    >
      <img src={reactLogo} alt="Affiliate+ Logo" width={80} className="mb-3" />
      <h1 className="mb-3 fw-bold text-primary">Welcome to Affiliate+</h1>
      <p className="lead text-center mb-4" style={{ maxWidth: 600 }}>
        Affiliate+ is your all-in-one platform to manage, track, and analyze
        your marketing links. Gain insights into your campaigns, monitor clicks,
        and optimize your performance. Purchase credits or subscribe for
        unlimited access, all with secure authentication and user management.
      </p>
      <div className="row mb-4 w-100 justify-content-center">
        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Link Management</h5>
              <p className="card-text">
                Create, edit, and organize your marketing links with ease.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Analytics</h5>
              <p className="card-text">
                Track clicks and view detailed analytics for every link.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Payments & Subscriptions</h5>
              <p className="card-text">
                Purchase credits or subscribe for unlimited access to premium
                features.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex gap-3">
        <Link to="/register" className="btn btn-primary btn-lg">
          Get Started
        </Link>
        <Link to="/login" className="btn btn-outline-primary btn-lg">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;
