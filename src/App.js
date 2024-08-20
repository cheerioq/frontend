import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/home';
import SignIn from './components/signIn';
import SignUp from './components/signUp';
import Profile from './components/profile';
import Createpost from './components/Createpost';
import { LoginContext } from './context/logonContext';
import Modal from './components/Modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from './components/UserProflle';

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [signUp, setSignUp] = useState("SignUp");
  const [signIn, setSignIn] = useState("SignIn");


  return (
    <BrowserRouter>
      <div className="App">
        <LoginContext.Provider value={{ userLogin, setUserLogin, modalOpen, setModalOpen, setSignUp,setSignIn, signIn, signUp }}>
          <Navbar login={userLogin} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route exact path="/Profile" element={<Profile />} />
            <Route path="/createPost" element={<Createpost />} />
            <Route path="/profile/:userid" element={<UserProfile />} />

          </Routes>
          <ToastContainer theme="dark" />
          {modalOpen && <Modal setModalOPen={setModalOpen} />}
        </LoginContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
