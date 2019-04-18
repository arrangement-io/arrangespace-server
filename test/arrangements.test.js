/* eslint handle-callback-err: 'off' */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
chai.use(chaiHttp);
chai.should();

describe('Arrangements', () => {
  describe('GET /arrangement/:id', () => {
    it('should get a single arrangement', (done) => {
      const id = 'a0QFA2CLY';
      chai.request(app)
        .get(`/arrangement/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

    it('should return type application/json', (done) => {
      const id = 'a0QFA2CLY';
      chai.request(app)
        .get(`/arrangement/${id}`)
        .end((err, res) => {
          res.type.should.equal('application/json');
          done();
        });
    });

    it('should return empty object if arrangement does not exist', (done) => {
      const id = '1';
      chai.request(app)
        .get(`/arrangement/${id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.deep.equal({});
          done();
        });
    });
  });

  describe('GET /arrangement/:id/export/:type', () => {
    it('should get an arrangement exported as csv', (done) => {
      const id = 'a07HY7HQO';
      const type = 'csv';
      chai.request(app)
        .get(`/arrangement/${id}/export/${type}`)
        .end((err, res) => {
          let arrangement = res.text.trim().split('\n');
          res.should.have.status(200);
          arrangement.length.should.equal(5);
          arrangement[0].split(',').length.should.equal(2);
          done();
        });
    });

    it('should get an arrangement exported as tsv', (done) => {
      const id = 'a07HY7HQO';
      const type = 'tsv';
      chai.request(app)
        .get(`/arrangement/${id}/export/${type}`)
        .end((err, res) => {
          let arrangement = res.text.trim().split('\n');
          res.should.have.status(200);
          arrangement.length.should.equal(5);
          arrangement[0].split('\t').length.should.equal(2);
          done();
        });
    });

    it('should return type text/html', (done) => {
      const id = 'a07HY7HQO';
      const type = 'csv';
      chai.request(app)
        .get(`/arrangement/${id}/export/${type}`)
        .end((err, res) => {
          res.type.should.equal('text/html');
          done();
        });
    });

    it('should return error if arrangement does not exist', (done) => {
      const id = '1';
      const type = 'csv';
      const errorMsg = {
        error: {
          status: 404,
          reason: 'notFound',
          message: 'Could not find resource with id: 1'
        }
      };
      chai.request(app)
        .get(`/arrangement/${id}/export/${type}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.deep.equal(errorMsg);
          done();
        });
    });
  });

  describe('POST /arrangement/:id', () => {
    it('should return arrangement object', (done) => {
      const id = 'aTBG654bb';
      const arrangement = {
        _id: 'aTBG654bb',
        containers: [],
        is_deleted: false,
        items: [],
        modified_timestamp: 1554263347.135,
        name: 'new blah1',
        owner: '106427691348095657861',
        snapshots: [
          {
            _id: 'sZ8O2QXLE',
            name: 'Snapshot 1',
            snapshot: {},
            snapshotContainers: [],
            unassigned: []
          }
        ],
        timestamp: 1554263341.683,
        user: '106427691348095657861',
        users: [
          '106427691348095657861'
        ]
      };
      chai.request(app)
        .post(`/arrangement/${id}`)
        .send(arrangement)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.deep.equal(arrangement);
          done();
        });
    });

    xit('should return type application/json', (done) => {
      chai.request(app)
        .post(`/logout`)
        .end((err, res) => {
          res.type.should.equal('application/json');
          done();
        });
    });

    it('should return validation error', (done) => {
      const id = 'fake';
      chai.request(app)
        .post(`/arrangement/${id}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.error.should.be.a('object');
          res.body.error.status.should.equal(400);
          res.body.error.reason.should.equal('validationError');
          res.body.error.message.length.should.equal(1);
          done();
        });
    });
  });
});
