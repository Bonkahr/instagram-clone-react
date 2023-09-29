import React, { useEffect, useState } from 'react';
import { Modal, makeStyles, Input, Button } from '@material-ui/core';

import './App.css';
import Post from './postComponent/Post';
import Navbar from './navBarComponent/Navbar';
import ImageUpload from './imageUploadComponent/imageUpload';

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const App = () => {
  const classes = useStyles();

  const BaseUrl = 'http://127.0.0.1:8000/';

  const [posts, setPosts] = useState([]);

  const [modalStyle, setModalStyle] = useState(getModalStyle);

  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [authToken, setAuthToken] = useState(null);
  const [authTokenType, setAuthTokenType] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setAuthToken(localStorage.getItem('authToken'));
    setAuthTokenType(localStorage.getItem('authTokenType'));
    setUsername(localStorage.getItem('username'));
    setUserId(localStorage.getItem('userId'));
    setUserType(localStorage.getItem('userType'));
  }, []);

  useEffect(() => {
    authToken
      ? localStorage.setItem('authToken', authToken)
      : localStorage.removeItem('authToken');

    authTokenType
      ? localStorage.setItem('authTokenType', authTokenType)
      : localStorage.removeItem('authTokenType');

    userId
      ? localStorage.setItem('userId', userId)
      : localStorage.removeItem('userId');

    username
      ? localStorage.setItem('username', username)
      : localStorage.removeItem('username');

    userType
      ? localStorage.setItem('userTye', userType)
      : localStorage.removeItem('userType');
  }, [authToken, authTokenType, userId, userType, username]);

  useEffect(() => {
    fetch(BaseUrl + 'post')
      .then((response) => {
        const json = response.json();
        if (response.ok) {
          return json;
        }
        throw response;
      })
      .then((data) => {
        const result = data.sort((a, b) => {
          const t_a = a.timestamp.split(/[-T:]/);
          const t_b = b.timestamp.split(/[-T:]/);

          const d_a = new Date(
            Date.UTC(t_a[0], t_a[1] - 1, t_a[2], t_a[4], t_a[5])
          );
          const d_b = new Date(
            Date.UTC(t_b[0], t_b[1] - 1, t_b[2], t_b[4], t_b[5])
          );

          return d_b - d_a;
        });
        return result;
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const signIn = (e) => {
    e?.preventDefault();

    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const requestOptions = {
      method: 'POST',
      body: formData,
    };

    fetch(BaseUrl + 'login', requestOptions)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        setAuthToken(data.access_token);
        setAuthTokenType(data.token_type);
        setUserId(data.user_id);
        setUserType(data.user_type);
        setUsername(data.username);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
    setOpenSignIn(false);
  };

  const signOut = (e) => {
    setAuthToken(null);
    setAuthTokenType(null);
    setUserId('');
    setUserType('');
    setUsername('');
  };

  const signUp = (e) => {
    e?.preventDefault();

    if (password !== confirmPassword) {
      alert('Confirm your password.');
      return;
    }

    const jsonString = JSON.stringify({
      username: username,
      email: email,
      password: password,
      user_type: userType,
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonString,
    };

    fetch(BaseUrl + 'user/', requestOptions)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        signIn();
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });

    setOpenSignUp(false);
  };

  return (
    <div className='app'>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div
          style={modalStyle}
          className={classes.paper}
        >
          <form className='app_sign_in'>
            <center>
              <img
                className='app_header_image'
                src='https://www.meilleure-innovation.com/wp-content/uploads/2022/04/logo-instagram-788x444.png'
                alt='instagram'
              />
            </center>
            <Input
              placeholder='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Input>
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button
              type='submit'
              onClick={signIn}
            >
              Login
            </Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}
      >
        <div
          style={modalStyle}
          className={classes.paper}
        >
          <form className='app_sign_in'>
            <center>
              <img
                className='app_header_image'
                src='https://www.meilleure-innovation.com/wp-content/uploads/2022/04/logo-instagram-788x444.png'
                alt='instagram'
              />
            </center>
            <Input
              placeholder='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Input>
            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <Input
              placeholder='userType'
              type='text'
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            ></Input>
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Input
              placeholder='confirm password'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Input>

            {password !== confirmPassword ? (
              <p className='text-danger'>Passwords are not the same.</p>
            ) : (
              <></>
            )}

            <Button
              type='submit'
              onClick={signUp}
            >
              SignUp
            </Button>
          </form>
        </div>
      </Modal>

      <Navbar
        openSignIn={openSignIn}
        openSignUp={openSignUp}
        setOpenSignIn={setOpenSignIn}
        setOpenSignUp={setOpenSignUp}
        signOut={signOut}
        authToken={authToken}
      />
      {authToken ? (
        <ImageUpload
          authToken={authToken}
          authTokenType={authTokenType}
          userId={userId}
        />
      ) : (
        <div className='login_div'>
          <h3 className='login_text'>Login to create a post</h3>
        </div>
      )}

      <div className='app_posts'>
        {posts.map((post) => (
          <Post
            post={post}
            key={post.id}
            authToken={authToken}
            username={username}
            authTokenType={authTokenType}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
