const request = require('supertest');
require('dotenv').config();

const app = require('../../app');
const { 
  mongoConnect,
  mongoDisconnect,
} = require('../../services/mongo');

let adminToken, userManagerToken, userToken;

describe('AUTH API - LOG IN', () => {
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


  describe('Test ADMIN AUTH', () => {
    const newUser = {
      email:"testjest@gmail.com",
      name: "novi User",
      surname:"test jest",
      password:"testjest",
    }

    test('Admin successfully registers a new admin user', async () => {
      const response = await request(app)
      .post('/api/v1/auth/register')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newUser)
      .expect('Content-Type', /json/) 
      .expect(200);
    });

    test('Admin successfuly gets his info GET /ME', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(200);
        
        expect(response.body.email).toStrictEqual(process.env.ADMIN_EMAIL);
        expect(response.body.role).toStrictEqual('admin');
    });
  });




  describe('Test USER MANAGER AUTH', ()=>{
    const newUser = {
      email:"testjest@gmail.com",
      name: "novi User",
      surname:"test jest",
      password:"testjest",
    }

    test('User manager successfully registers a new admin user', async () => {
      const response = await request(app)
      .post('/api/v1/auth/register')
      .set('Authorization', `Bearer ${userManagerToken}`)
      .send(newUser)
      .expect('Content-Type', /json/) 
      .expect(200);
    });

    test('User manager successfuly gets his info GET /ME', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userManagerToken}`)
        .expect('Content-Type', /json/)
        .expect(200);
        
        expect(response.body.email).toStrictEqual(process.env.USER_MANAGER_EMAIL);
        expect(response.body.role).toStrictEqual('user manager');
    });
  });

  
  
  
  describe('Test USER AUTH', ()=>{
    const newUser = {
      email:"testjest@gmail.com",
      name: "novi User",
      surname:"test jest",
      password:"testjest",
    }

    test('User successfully registers a new admin user', async () => {
      const response = await request(app)
      .post('/api/v1/auth/register')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newUser)
      .expect('Content-Type', /json/) 
      .expect(200);
    });

    test('User successfuly gets his info GET /ME', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200);
        
        expect(response.body.email).toStrictEqual(process.env.USER_EMAIL);
        expect(response.body.role).toStrictEqual('user');
    });
  });





  describe('Test INVALID TOKEN AUTH', ()=>{
    const newUser = {
      email:"testjest@gmail.com",
      name: "novi User",
      surname:"test jest",
      password:"testjest",
    }
    test('Client without token successfully registers a new admin user', async () => {
      const response = await request(app)
      .post('/api/v1/auth/register')
      .send(newUser)
      .expect('Content-Type', /json/) 
      .expect(200);
    });

  test('Client without token cannot GET /ME', async () => {
    const response = await request(app)
      .get('/api/v1/auth/me')
      .expect(401);
  });
    
  });

});
