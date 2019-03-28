exports.getUsers = function (request) {
  // TODO: Make DB call
  let response = {
    users: [
      {
        user: 'David Wosk',
        user_id: 1
      },
      {
        user: 'Gideon Chia',
        user_id: 2
      },
      {
        user: 'Jeff Chiu',
        user_id: 3
      }
    ]
  };

  return new Promise(resolve => {
    resolve(response);
  });
};

exports.getUser = function (userId, request) {
  // TODO: Make DB call
  let response = {
    user: 'David Wosk',
    user_id: userId
  };

  return new Promise(resolve => {
    resolve(response);
  });
};
