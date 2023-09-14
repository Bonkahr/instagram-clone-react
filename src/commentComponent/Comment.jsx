import React from 'react';

const Comment = ({ comment }) => {
  const t_a = comment.timestamp.split(/[-T:]/);

  const m_d = t_a[1] + '-' + t_a[2];
  const time = t_a[3] + ':' + t_a[4];

  const capitalizeUsername = (username) => {
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  return (
    <div className='card-body'>
      <h5 className='card-title'>
        <strong>{capitalizeUsername(comment.username)}</strong>
      </h5>
      <p className='card-text'>
        {comment.comment}{' '}
        <span className='opacity-75 text-end'>
          {m_d} - {time}
        </span>
      </p>
    </div>
  );
};

export default Comment;
