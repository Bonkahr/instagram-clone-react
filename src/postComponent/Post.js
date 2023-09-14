import React, { useState, useEffect } from 'react';

import Comment from '../commentComponent/Comment';
import { Avatar } from '@material-ui/core';
import './post.css';

const BaseUrl = 'http://127.0.0.1:8000/';

const Post = ({ post, authToken, username, authTokenType }) => {
  const image_alt = 'image from' + post.username;

  const [imageUrl, setImageUrl] = useState('');
  const [comments, setComents] = useState([]);

  const [comment, setComment] = useState('');

  const capitalizeUsername = (username) => {
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  useEffect(() => {
    if (post.image_url_type === 'absolute') {
      setImageUrl(post.image_url);
    } else {
      setImageUrl(BaseUrl + post.image_url);
    }
  }, []);

  useEffect(() => {
    setComents(post.comments);
  }, []);

  const handleDelete = (event) => {
    event?.preventDefault();

    const requestOptions = {
      method: 'DELETE',
      headers: new Headers({
        Authorization: authTokenType + ' ' + authToken,
      }),
    };

    fetch(BaseUrl + `post/${post.id}`, requestOptions)
      .then((res) => {
        if (res.ok) {
          window.location.reload();
        }
        throw res;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleComment = (event) => {
    event?.preventDefault();

    const jsonString = JSON.stringify({
      comment: comment,
    });

    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        Authorization: authTokenType + ' ' + authToken,
        'Content-Type': 'application/json',
      }),
      body: jsonString,
    };

    fetch(BaseUrl + `comment/${post.id}`, requestOptions)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        fetchComments();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setComents('');
      });
  };

  const fetchComments = () => {
    fetch(BaseUrl + 'comments/all' + post.id)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        console.log(data);
        setComents(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='post'>
      <div className='post_header_info'>
        <Avatar></Avatar>
        <h3>{capitalizeUsername(post.user.username)}</h3>
        {authToken && post.user.username === username ? (
          <button
            className='btn btn-danger'
            onClick={handleDelete}
          >
            Delete
          </button>
        ) : (
          <div></div>
        )}
      </div>

      <img
        className='post_image'
        src={imageUrl}
        alt={image_alt}
      />
      <h4 className='post_text'>{post.caption}</h4>
      <div className='post_comment'>
        <div className='card'>
          {comments.length > 0 && <h5 className='card-header'>Comments</h5>}
          {comments.map((comment) => (
            <Comment
              comment={comment}
              key={comment.id}
            />
          ))}
        </div>
        {authToken && (
          <div className='add_comment'>
            <form>
              <div class='form-floating'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='name@example.com'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <label for='floatingInput'>Write your comment</label>
              </div>
              <div className='comment_button'>
                <button
                  className='btn btn-primary w-30 py-2'
                  type='submit'
                  disabled={!comment}
                  onClick={handleComment}
                >
                  Comment
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
