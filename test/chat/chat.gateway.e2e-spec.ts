import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { io, Socket } from 'socket.io-client';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('ChatGateway (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let mongo: Connection;
  let token: string;
  let roomId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
    mongo = app.get(getConnectionToken());

    // Ensure DB connection string for tests (requires running MongoDB)
    // Create a user and login
    await request(httpServer).post('/auth/signup').send({ email: 't@t.com', name: 'T', password: 'secret' });
    const login = await request(httpServer).post('/auth/login').send({ email: 't@t.com', password: 'secret' });
    token = login.body.token;

    // Create admin and room
    await request(httpServer).post('/users').set('Authorization', `Bearer ${token}`)
      .send({ email: 'admin@t.com', name: 'Admin', password: 'secret', role: 'admin' });
    const loginAdmin = await request(httpServer).post('/auth/login').send({ email: 'admin@t.com', password: 'secret' });
    const adminToken = loginAdmin.body.token;
    const roomRes = await request(httpServer).post('/rooms').set('Authorization', `Bearer ${adminToken}`).send({ name: 'general' });
    roomId = roomRes.body._id;
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  it('connects and exchanges messages', (done) => {
    const socket: Socket = io('http://localhost:3000', {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      socket.emit('join_room', { roomId });
      socket.emit('send_message', { roomId, content: 'hello' });
    });

    socket.on('receive_message', (msg) => {
      try {
        expect(msg.content).toBe('hello');
        socket.disconnect();
        done();
      } catch (e) {
        done(e);
      }
    });
  }, 20000);
});
