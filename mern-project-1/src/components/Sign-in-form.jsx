import React from "react";

const SignInForm = () => {
  return (
    <div className="formContainer">
    <form action="" >
      <div className="mb-3">
        <label htmlFor="txtUserName" className="form-label">
          Username
        </label>
        <input
          type="text"
          className="form-control"
          id="txtUserName"
          style={{ width: "250px" }}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="txtPassword" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="txtPassword"
          style={{ width: "250px" }}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
    </div>
  );
};

export default SignInForm;
