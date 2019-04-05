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
});
