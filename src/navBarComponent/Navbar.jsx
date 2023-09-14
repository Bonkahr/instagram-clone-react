import React from 'react';

const Navbar = ({ setOpenSignIn, setOpenSignUp, authToken, signOut }) => {
  return (
    <div className='sticky-top'>
      <nav className='navbar bg-body-tertiary'>
        <div className='container'>
          <img
            className='app_header_image'
            src='https://www.meilleure-innovation.com/wp-content/uploads/2022/04/logo-instagram-788x444.png'
            alt='instagram'
          />
        </div>
        {authToken ? (
          <div className='buttons'>
            <button
              onClick={() => signOut(true)}
              className='btn btn-info button'
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className='buttons'>
            <button
              onClick={() => setOpenSignIn(true)}
              className='btn btn-success button'
            >
              Log In
            </button>
            <button
              onClick={() => setOpenSignUp(true)}
              className='btn btn-warning button'
            >
              Sign Up
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
