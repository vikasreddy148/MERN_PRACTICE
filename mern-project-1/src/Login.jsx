const Login = () => {
  return (
    <div className="container">
      <form action="">
        <dl>
          <dt>
            <label htmlFor="txtUser" className="form-label">
              Enter Your Name
            </label>
          </dt>
          <dd>
            <input
              type="text"
              name="txtUser"
              id="txtUser"
              className="form-control"
              
            />
          </dd>
        </dl>
      </form>
    </div>
  );
};

export default Login;
