const request = require('supertest');
require('dotenv').config();

const app = require('../../app');
const { 
  mongoConnect,
  mongoDisconnect,
} = require('../../services/mongo');

let adminToken, userManagerToken, userToken;

describe('TIMELOGS API', () => {
  beforeAll(async () => {
    await mongoConnect();

    let response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
        });
    adminToken = response.body.token;

    response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: process.env.USER_MANAGER_EMAIL,
          password: process.env.USER_MANAGER_PASSWORD,
        });
    userManagerToken = response.body.token;

    response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: process.env.USER_EMAIL,
          password: process.env.USER_PASSWORD,
        });
    userToken = response.body.token;
  });

  afterAll(async () => {
    await mongoDisconnect();
  });


  describe('Test ADMIN', () => {
    const timelog = {
      date: "2003-10-10",
      time: 10,
      notes:[
          'jest test admin notes'
      ],
      // userId: '60df1fc000744c2eff867017'
    }
    let timelogId;

    test('Admin successfully gets list of all timelogs', async () => {
      const response = await request(app)
        .get('/api/v1/time-logs')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /html/)
        .expect(200);
    });

    test('Admin successfully posts a time log', async () => {
      const response = await request(app)
        .post('/api/v1/time-logs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(timelog)
        .expect('Content-Type', /json/)
        .expect(200);
        expect(response.body.time).toStrictEqual(timelog.time);
        expect(response.body.notes).toStrictEqual(timelog.notes);
        timelogId = response.body._id;
    });

    test('Admin successfully updates a time log', async () => {
      const response = await request(app)
        .patch(`/api/v1/time-logs/${timelogId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(timelog)
        .expect('Content-Type', /json/)
        .expect(200);
    });

    test('Admin successfully deletes a time log', async () => {
      const response = await request(app)
        .delete(`/api/v1/time-logs/${timelogId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(200);
    });
  })






  describe('Test USER MANAGER', ()=>{
    let timelogId;
    const timelog = {
      "time":1010,
      "notes":[
          "mjenjam timelog, testiram u jestu"
      ],
      "date":"Jan 5, 2008"
      }

    test('User manager successfully gets his own timelogs', async () => {
      const response = await request(app)
        .get('/api/v1/time-logs')
        .set('Authorization', `Bearer ${userManagerToken}`)
        .expect('Content-Type', /html/)
        .expect(200);
    });

    test('User manager successfully posts a time log', async () => {
      const response = await request(app)
        .post('/api/v1/time-logs')
        .set('Authorization', `Bearer ${userManagerToken}`)
        .send(timelog)
        .expect('Content-Type', /json/)
        .expect(200);
        expect(response.body.time).toStrictEqual(timelog.time);
        expect(response.body.notes).toStrictEqual(timelog.notes);
        timelogId = response.body._id;
    });

    test('User manager succesfully updates his timelog', async () => {
      const response = await request(app)
        .patch(`/api/v1/time-logs/${timelogId}`)
        .set('Authorization', `Bearer ${userManagerToken}`)
        .send(timelog)
        .expect(200);
    });

    test('User manager successfuly deletes his timelog', async () => {
      const response = await request(app)
        .delete(`/api/v1/time-logs/${timelogId}`)
        .set('Authorization', `Bearer ${userManagerToken}`)
        .expect(200);
    });
  })







  describe('Test USER', ()=>{

    const timelog = {
      "time":1010,
      "notes":[
          "mjenjam timelog, testiram u jestu"
      ],
      "date":"Jan 5, 2008"
      }
      let timelogId;

    test('User successfully gets his own timelogs', async () => {
      const response = await request(app)
        .get('/api/v1/time-logs')
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /html/)
        .expect(200);
    });

    test('User successfully posts a time log', async () => {
      const response = await request(app)
        .post('/api/v1/time-logs')
        .set('Authorization', `Bearer ${userToken}`)
        .send(timelog)
        .expect('Content-Type', /json/)
        .expect(200);
        expect(response.body.time).toStrictEqual(timelog.time);
        expect(response.body.notes).toStrictEqual(timelog.notes);
        timelogId = response.body._id;
    });

    test('User successfuly updates his timelog', async () => {
      const response = await request(app)
        .patch(`/api/v1/time-logs/${timelogId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(timelog)
        .expect(200);
    });

    test('User successfuly deletes his timelog', async () => {
      const response = await request(app)
        .delete(`/api/v1/time-logs/${timelogId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    });
  })






  describe('Test INVALID TOKEN', () => {
    const timelog = {
      date: "2003-10-10",
      time: 10,
      notes:[
          'jest test admin notes'
      ],
      // userId: '60df1fc000744c2eff867017'
     }
     let timelogId;

      test('Client with invalid token cant access timelogs', async () => {
        const response = await request(app)
          .get('/api/v1/time-logs')
          .expect(401);
      });

      test('Client with invalid token cant create timelog', async () => {
        const response = await request(app)
          .post('/api/v1/time-logs')
          .send(timelog)
          .expect(401);
      });
      test('Client with invalid token cant update timelog', async () => {
        const response = await request(app)
          .patch(`/api/v1/time-logs/${timelogId}`)
          .send(timelog)
          .expect(401);
      });

      test('Client with invalid token cant delete timelog', async () => {
        const response = await request(app)
          .delete(`/api/v1/time-logs/${timelogId}`)
          .expect(401);
      });
  });

});
