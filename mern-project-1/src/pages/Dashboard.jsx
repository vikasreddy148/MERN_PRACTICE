
import { Link } from 'react-router-dom';


function Dashboard({ userDetails, setUserDetails }) {
  

  return (
    <div className="container text-center">
      <h1>User Dashboard Page</h1>
        <Link to = '/logout'>logout</Link>
    </div>
  );
}

export default Dashboard;
