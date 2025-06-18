import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="container text-center h3">
      <h1>Welcome to home Pages</h1>
      <Link to={"/"}>Home</Link>
      <Link to={"/login"}>login</Link>
    </div>
  );
};

export default Home;
