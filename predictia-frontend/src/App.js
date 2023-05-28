import logo from './logo.svg';
import './App.css';
import TopNavBar from './component/TopNavBar'
import { Login } from './component/Login';
import { Paper } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Register } from './component/Register';
import { createContext, useEffect, useState } from 'react';
import { HomePage } from './component/HomePage';

export const UserContext = createContext()


function App() {

  const [user, setUser] = useState();

  useEffect(()=>{
    if(sessionStorage.getItem('token'))
      setUser(sessionStorage.getItem('token'))
  },[])

  return (
    <UserContext.Provider value={{ user: user, setUser: setUser }}>
      <Paper sx={{ height: "100vh" }} component={"div"} elevation={0}>
        <BrowserRouter>
          <TopNavBar />
          <Routes>
            <Route path="/" >
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="home" element={<HomePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        {/* <Login/> */}
      </Paper>
    </UserContext.Provider>
  );
}

export default App;
