process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Stat = require('../models/stat');

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let expect = chai.expect;
chai.use(chaiHttp);

describe('Stats', () => {
  beforeEach((done) => {
    Stat.remove({}, (err) => {
      done();
    });
  });

  describe('Persisting stats', () => {
    let rawStat = {
      total: 1,
      timeStudied: 10
    };
    let courseId = 'history';
    let persistenceRoute = `/courses/${courseId}`

    it('it should allow a user to save a stat', () => {
      return chai.request(app)
      .post(persistenceRoute)
      .set('User-Id', 'George')
      .send(rawStat)
      .then((res) => {
        expect(res).to.have.status(201);
        expect(res.body.stat).to.have.property('userId', 'George');
        expect(res.body.stat).to.have.property('courseId', 'history');
        expect(res.body.stat).to.have.property('total', 1);
        expect(res.body.stat).to.have.property('timeStudied', 10);
      })
      .catch((err) => {
        throw err;
      });
    });

    it('it should not store a stat without required fields', () => {
      return chai.request(app)
      .post(persistenceRoute)
      .send({})
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors).to.have.property('userId');
        expect(res.body.errors.userId).to.have.property('kind').eql('required');
        expect(res.body.errors).to.have.property('timeStudied');
        expect(res.body.errors.timeStudied).to.have.property('kind').eql('required');
        expect(res.body.errors).to.have.property('total');
        expect(res.body.errors.total).to.have.property('kind').eql('required');
      }).catch((err) => {
        throw err;
      });
    });

    describe('Fetching aggregate stat values', () => {
      let courseId = 'history';
      let userId = 'George';

      let statOne = {
        userId: userId,
        courseId: courseId,
        total: 2,
        timeStudied: 10
      };
      let statTwo = {
        userId: userId,
        courseId: courseId,
        total: 3,
        timeStudied: 20
      };
      let statThree = {
        userId: userId,
        courseId: courseId,
        total: 5,
        timeStudied: 10
      }

      let route = `/courses/${courseId}`;

      beforeEach((done) => {
        let firstStatToSave = new Stat(statOne);
        let secondStatToSave = new Stat(statTwo);
        let thirdStatToSave = new Stat(statThree);
        firstStatToSave.save();
        secondStatToSave.save();
        thirdStatToSave.save();
        done();
      });

      it('should calculate the total timeStudied the userId', () => {
        return chai.request(app)
        .get('/courses/history')
        .set('User-Id', 'George')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('timeStudied', 40);
        }).catch((err) => {
          throw err;
        });
      });

      it('should calculate the average score for the userId, rounded to one decimal place', () => {
        return chai.request(app)
        .get('/courses/history')
        .set('User-Id', 'George')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('averageScore', 3.3);
        }).catch((err) => {
          throw err;
        });
      });

      it('should display a message when trying to fetch stats for courseIds that have no data', () => {
        return chai.request(app)
        .get('/courses/biology')
        .set('User-Id', 'George')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'No stats found for requested courseId or UserId');
        }).catch((err) => {
          throw err;
        });
      });

      it('should display a message when trying to fetch stats for userIds that have no data', () => {
        return chai.request(app)
        .get('/courses/history')
        .set('User-Id', 'Unknown User')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'No stats found for requested courseId or UserId');
        }).catch((err) => {
          throw err;
        });
      });
    });

  });
});
