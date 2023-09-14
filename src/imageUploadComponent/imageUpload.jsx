import React, { useState } from 'react';

import { Button } from '@material-ui/core';

import './imageUpload.css';

const ImageUpload = ({ authToken, authTokenType, userId }) => {
  const BaseUrl = 'http://127.0.0.1:8000/';

  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = (e) => {
    e?.preventDefault();

    const formData = new FormData();
    formData.append('image', image);

    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        Authorization: authTokenType + ' ' + authToken,
      }),
      body: formData,
    };

    fetch(BaseUrl + 'post/image', requestOptions)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        console.log(data.filename);
        // ToDo create post
        createPost(data.filename);
        setImage(null);
      })
      .catch((err) => {
        console.log(console.error);
      })
      .finally(() => {
        setCaption(null);
        setImage(null);
        document.getElementById('fileInput').value = null;
      });

    const createPost = (imageUrl) => {
      const jsonSring = JSON.stringify({
        image_url: imageUrl,
        image_url_type: 'relative',
        caption: caption,
      });

      console.log(jsonSring);

      const requestOptions = {
        method: 'POST',
        headers: new Headers({
          Authorization: authTokenType + ' ' + authToken,
          'Content-Type': 'application/json',
        }),
        body: jsonSring,
      };

      fetch(BaseUrl + 'post', requestOptions)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw res;
        })
        .then((data) => {
          window.location.reload();
          window.scrollTo(0, 0);
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  return (
    <div className='image_upload'>
      <h4 className='post_heading'>Add a new post.</h4>
      <input
        className='form-control input'
        type='text'
        placeholder='Enter a caption'
        onChange={(e) => setCaption(e.target.value)}
      ></input>
      <input
        className='form-control form-control-lg input'
        type='file'
        id='fileInput'
        placeholder='Enter a caption'
        onChange={handleChange}
      ></input>
      <button
        className='btn btn-info btn_upload'
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
};

export default ImageUpload;
