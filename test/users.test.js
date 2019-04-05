/* eslint handle-callback-err: "off" */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
chai.use(chaiHttp);
chai.should();

describe('Users', () => {
  describe('GET /users', () => {
    it('should get all users', (done) => {
      chai.request(app)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.have.lengthOf(6);
          res.body[0].should.be.a('object');
          done();
        });
    });

    it('should return type application/json', (done) => {
      chai.request(app)
        .get('/users')
        .end((err, res) => {
          res.type.should.equal('application/json');
          done();
        });
    });
  });

  describe('GET /users/:id', () => {
    it('should get a single user', (done) => {
      const googleId = '623734482213542756012';
      chai.request(app)
        .get(`/users/${googleId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.email.should.equal('jade.jost@gmail.org');
          done();
        });
    });

    it('should return type application/json', (done) => {
      const googleId = '623734482213542756012';
      chai.request(app)
        .get(`/users/${googleId}`)
        .end((err, res) => {
          res.type.should.equal('application/json');
          done();
        });
    });

    it('should return empty object if user does not exist', (done) => {
      const googleId = 1;
      chai.request(app)
        .get(`/users/${googleId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.deep.equal({});
          done();
        });
    });

    it('should return validation error', (done) => {
      const googleId = 1;
      chai.request(app)
        .get(`/users/${googleId}?query=test`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.error.status.should.equal(400);
          res.body.error.reason.should.equal('invalidParameters');
          res.body.error.message.should.equal('This endpoint does not support query parameters.');
          done();
        });
    });
  });

  describe('GET /users/:id/arrangements', () => {
    it('should get a users arrangements', (done) => {
      const googleId = '623734482213542756012';
      chai.request(app)
        .get(`/users/${googleId}/arrangements`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(1);
          res.body[0].should.include.keys('_id', 'containers', 'snapshots', 'name', 'owner');
          done();
        });
    });

    it('should return type application/json', (done) => {
      const googleId = '623734482213542756012';
      chai.request(app)
        .get(`/users/${googleId}/arrangements`)
        .end((err, res) => {
          res.type.should.equal('application/json');
          done();
        });
    });

    it('should return empty array if user has no arrangements', (done) => {
      const googleId = 1;
      chai.request(app)
        .get(`/users/${googleId}/arrangements`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.deep.equal([]);
          done();
        });
    });
  });

  describe('POST /login', () => {
    it('should return user object', (done) => {
      const user = {
        access_token: 'fake.token',
        user_data: {
          googleId: '991931460120626036114',
          name: 'Otto',
          givenName: 'Otto',
          email: 'otto.ogg@gmail.com',
          familyName: 'Ogg',
          imageUrl: 'https://lh4.googleusercontent.com/-yam-83cUajo/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reB-PJPjnCzfjYSWA1-eRJj0o12kp/s96-c/photo.jpg'
        }
      };
      chai.request(app)
        .post(`/login`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.deep.equal(user.user_data);
          done();
        });
    });

    it('should return type application/json', (done) => {
      const user = {
        access_token: 'fake.token',
        user_data: {
          googleId: '991931460120626036114',
          name: 'Otto',
          givenName: 'Otto',
          email: 'otto.ogg@gmail.com',
          familyName: 'Ogg',
          imageUrl: 'https://lh4.googleusercontent.com/-yam-83cUajo/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reB-PJPjnCzfjYSWA1-eRJj0o12kp/s96-c/photo.jpg'
        }
      };
      chai.request(app)
        .post(`/login`)
        .send(user)
        .end((err, res) => {
          res.type.should.equal('application/json');
          done();
        });
    });

    it('should return validation error', (done) => {
      const user = {
        access_token: 'fake.token',
        user_data: {
          notValid: '991931460120626036114',
          name: 'Otto',
          givenName: 'Otto',
          email: 'otto.ogg@gmail.com',
          familyName: 'Ogg',
          imageUrl: 'https://lh4.googleusercontent.com/-yam-83cUajo/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reB-PJPjnCzfjYSWA1-eRJj0o12kp/s96-c/photo.jpg'
        }
      };
      const errorMsg = {
        location: 'body',
        param: 'user_data.googleId',
        msg: 'googleId is required'
      };
      chai.request(app)
        .post(`/login`)
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.error.reason.should.equal('validationError');
          res.body.error.message.should.be.a('array');
          res.body.error.message[0].should.deep.equal(errorMsg);
          done();
        });
    });
  });

  describe('POST /logout', () => {
    it('should return object', (done) => {
      chai.request(app)
        .post(`/logout`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.deep.equal({ message: 'You are logged out.' });
          done();
        });
    });

    it('should return type application/json', (done) => {
      chai.request(app)
        .post(`/logout`)
        .end((err, res) => {
          res.type.should.equal('application/json');
          done();
        });
    });
  });
});
