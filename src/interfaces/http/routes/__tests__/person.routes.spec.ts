import express from 'express';
import personRoutes from '../person.routes';
import request from 'supertest';

describe('Person Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/persons', personRoutes);
  });

  describe('Route Configuration', () => {
    it('should be defined and exportable', () => {
      expect(personRoutes).toBeDefined();
      expect(typeof personRoutes).toBe('function');
    });

    it('should be an Express Router instance', () => {
      expect(personRoutes.stack).toBeDefined(); // Router instances have a stack property
    });
  });
  describe('Routes behavior', () => {
    it('should respond to GET requests', () => {
      return request(app).get('/persons').expect(200);
    });
  });
});
