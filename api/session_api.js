exports.logIn = function (request) {
  // TODO: Make DB call
  let response = {
    message: 'You are logged in.'
  };

  return new Promise(resolve => {
    resolve(response);
  });
};

exports.logOut = function (request) {
  // TODO: Make DB call
  let response = {
    message: 'You are logged out.'
  };

  return new Promise(resolve => {
    resolve(response);
  });
};
