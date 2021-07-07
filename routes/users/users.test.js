const request = require('supertest');
require('dotenv').config();

const app = require('../../app');
const { 
  mongoConnect,
  mongoDisconnect,
} = require('../../services/mongo');

let adminToken, userManagerToken, userToken;

describe('USERS API', () => {
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

  describe('Test INVALID TOKEN /users', ()=>{
    let userId;
    const user = {
        name:"novi user jest test",
        surname:"prezime",
        email:"jest@test.com",
        password:"jest123"
    }

    test('Client with invalid token cant GET all users', async () => {
        const response = await request(app)
          .get('/api/v1/users')
          .expect(401);
    });

    test('Client with invalid token cant POST user', async () => {
        const response = await request(app)
          .post('/api/v1/users')
          .send(user)
          .expect(401);
      });

      test('Client with invalid token cant GET specific user', async () => {
        const response = await request(app)
          .get( `/api/v1/users/${userId}`)
          .expect(401);
      });

      test('Client with invalid token cant PATCH specific user', async () => {
        const response = await request(app)
          .patch(`/api/v1/users/${userId}`)
          .send(user)
          .expect(401);
      });

      test('Client with invalid token cant delete any user', async () => {
        const response = await request(app)
          .delete(`/api/v1/users/${userId}`)
          .expect(401);
      });

      test('Client with invalid token cant change settings of anyone', async () => {
        const response = await request(app)
          .patch(`/api/v1/users/${userId}/settings`)
          .expect(401);
      });
      
  });


  describe('Test ADMIN /users', ()=>{
    let userId;
    const user = {
        name:"novi user jest test",
        surname:"prezime",
        email:"jest@test.com",
        password:"jest123"
    }

    test('Admin successfully gets list of all users', async () => {
        const response = await request(app)
          .get('/api/v1/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect('Content-Type', /json/)
          .expect(200);
      });

      test('Admin successfully posts a user', async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(user)
            .expect('Content-Type', /json/)
            .expect(200);
            expect(response.body.name).toStrictEqual(user.name);
            expect(response.body.surname).toStrictEqual(user.surname);
            expect(response.body.email).toStrictEqual(user.email);
            userId = response.body._id;
        });

      test('Admin successfully gets a user by id', async () => {
        const response = await request(app)
            .get( `/api/v1/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect('Content-Type', /json/)
            .expect(200);
        });


        test('Admin successfully updates a user', async () => {
            const response = await request(app)
            .patch(`/api/v1/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(user)
            .expect('Content-Type', /json/)
            .expect(200);

            expect(response.body.name).toStrictEqual(user.name);
            expect(response.body.surname).toStrictEqual(user.surname);
            expect(response.body.email).toStrictEqual(user.email);
        });

        test('Admin successfully deletes a user', async () => {
            const response = await request(app)
            .delete(`/api/v1/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect('Content-Type', /json/)
            .expect(200);
        });

  });




  
  describe('Test USER MANAGER /users', ()=>{
    let userId;
    const user = {
        name:"novi user od user managera",
        surname:"prezime",
        email:"jest@test.com",
        password:"jest123",
        role:"user"
    }

    test('User manager successfully gets list of all users', async () => {
        const response = await request(app)
          .get('/api/v1/users')
          .set('Authorization', `Bearer ${userManagerToken}`)
          .expect('Content-Type', /json/)
          .expect(200);
      });

      test('User manager successfully posts a user of role user', async () => {
        const response = await request(app)
            .post('/api/v1/users')
            .set('Authorization', `Bearer ${userManagerToken}`)
            .send(user)
            .expect('Content-Type', /json/)
            .expect(200);
            expect(response.body.name).toStrictEqual(user.name);
            expect(response.body.surname).toStrictEqual(user.surname);
            expect(response.body.email).toStrictEqual(user.email);
            userId = response.body._id;
        });

      test('User manager successfully gets a user by id', async () => {
        const response = await request(app)
            .get( `/api/v1/users/${userId}`)
            .set('Authorization', `Bearer ${userManagerToken}`)
            .expect('Content-Type', /json/)
            .expect(200);
        });


        test('User manager successfully updates a user with role user', async () => {
            const response = await request(app)
            .patch(`/api/v1/users/${userId}`)
            .set('Authorization', `Bearer ${userManagerToken}`)
            .send(user)
            .expect('Content-Type', /json/)
            .expect(200);

            expect(response.body.name).toStrictEqual(user.name);
            expect(response.body.surname).toStrictEqual(user.surname);
            expect(response.body.email).toStrictEqual(user.email);
        });

        test('User manager successfully deletes a user', async () => {
            const response = await request(app)
            .delete(`/api/v1/users/${userId}`)
            .set('Authorization', `Bearer ${userManagerToken}`)
            .expect('Content-Type', /json/)
            .expect(200);
        });

  });




  describe('Test USER /users', ()=>{
    let userId;
    const user = {
        name:"novi user od user managera",
        surname:"prezime",
        email:"jest@test.com",
        password:"jest123",
        role:"user"
    }

    test('Basic user cannot acces a list of all users', async () => {
        const response = await request(app)
          .get('/api/v1/users')
          .set('Authorization', `Bearer ${userToken}`)
          .expect('Content-Type', /json/)
          .expect(401);
      });

      test('Basic user cannot create any user', async () => {
        const response = await request(app)
            .post(`/api/v1/users`)
            .set('Authorization', `Bearer ${userToken}`)
            .send(user)
            .expect('Content-Type', /json/)
            .expect(401);
        });

      test('Basic user successfully gets any user by id', async () => {
        let userId='60db2a0e81b5711094ad215e';

        const response = await request(app)
            .get( `/api/v1/users/${userId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect('Content-Type', /json/)
            .expect(200);
        });


        test('Basic user cannot update any user', async () => {
            let userId='60db2a0e81b5711094ad215e';
            const response = await request(app)
            .patch(`/api/v1/users/${userId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send(user)
            .expect('Content-Type', /json/)
            .expect(401);
        });

        test('Basic user cannot delete a user', async () => {
            let userId='60db2a0e81b5711094ad215e';
            const response = await request(app)
            .delete(`/api/v1/users/${userId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect('Content-Type', /json/)
            .expect(401);
        });

  });

});
