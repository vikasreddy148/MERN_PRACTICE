import Home from "./Home";
import AppLayout from "./layout/AppLayout";
import Login from "./Login";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
        
        <Route path="/" element={ <AppLayout><Home /></AppLayout>} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
