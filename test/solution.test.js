import request from 'supertest';
import app from '../src/index.js';
import { findSolution } from '../src/controllers/solution.controllers.js';

/*--------------------------------------------------------------
# Unit Tests:Here we are testing the find Solution function, to 
  verify that it returns the expected answer and to verify the 
  algorithm
--------------------------------------------------------------*/

describe('findSolution function', () => {

  describe('returns correct steps when a solution exists', () => {
    test('solution for X=2, Y=10, Z=4', () => {
      const solution = findSolution(2, 10, 4);
      expect(solution).toBeInstanceOf(Array);
      expect(solution[solution.length - 1]).toEqual(expect.objectContaining({ status: 'Solved' }));
      expect(solution).toEqual([
        { step: 1, bucketX: 2, bucketY: 0, action: 'Fill bucket X' },
        { step: 2, bucketX: 0, bucketY: 2, action: 'Transfer from bucket X to Y'},
        { step: 3, bucketX: 2, bucketY: 2, action: 'Fill bucket X' },
        { step: 4, bucketX: 0, bucketY: 4, action: 'Transfer from bucket X to Y', status: 'Solved'}
      ])
    });

    test('solution for X=2, Y=100, Z=96', () => {
      const solution = findSolution(2, 100, 96);
      expect(solution).toBeInstanceOf(Array);
      expect(solution[solution.length - 1]).toEqual(expect.objectContaining({ status: 'Solved' }));
      expect(solution).toEqual([
        { step: 1, bucketX: 0, bucketY: 100, action: 'Fill bucket Y' },
        { step: 2, bucketX: 2, bucketY: 98,  action: 'Transfer from bucket Y to X'},
        { step: 3, bucketX: 0, bucketY: 98, action: 'Empty bucket X' },
        { step: 4, bucketX: 2, bucketY: 96, action: 'Transfer from bucket Y to X',status: 'Solved'}
      ])
    });
  });

  describe('returns empty array when no solution exists', () => {
    test('no solution for X=2, Y=6, Z=5', () => {
      const solution = findSolution(2, 6, 5);
      expect(solution).toBeInstanceOf(Array);
      expect(solution).toEqual([]);
    });

    test('no solution for X=2, Y=3, Z=5', () => {
      const solution = findSolution(2, 3, 5);
      expect(solution).toBeInstanceOf(Array);
      expect(solution).toEqual([]);
    });
  });

});


/*--------------------------------------------------------------
# Integration Tests: We verify that the components interact correctly 
in this case the /solution endpoint, where the response is correct when 
sending valid data and 400 if it is invalid.
--------------------------------------------------------------*/

describe('POST /solution', () => {

  test('should return the correct solution steps', async () => {
      const response = await request(app).post('/solution')
      .send({ x_capacity: 2, y_capacity: 10, z_amount_wanted: 4 });
      expect(response.body.solution).toBeDefined(); //Check that the value is not undefined
      expect(response.status).toBe(200); //Check that the status is 200
  });

  describe('returns 400 error when data is invalid', () => {

    test('returns 400 error when data is negative number)', async () => {
      const response = await request(app).post('/solution')
      .send({ x_capacity: -1, y_capacity: 2, z_amount_wanted: 5 });
      expect(response.status).toBe(400); //Check that the status is 400
      expect(response.body.error).toBe('All inputs must be positive integers');//Check the error
    });

    test('returns 400 error when data is String)', async () => {
      const response = await request(app).post('/solution')
      .send({ x_capacity: 2, y_capacity: 'I am String', z_amount_wanted: 5 });
      expect(response.status).toBe(400); //Check that the status is 400
      expect(response.body.error).toBe('All inputs must be positive integers');//Check the error
    });

    test('returns 400 error when data is null)', async () => {
      const response = await request(app).post('/solution')
      .send({ x_capacity: null, y_capacity: 3, z_amount_wanted: 5 });
      expect(response.status).toBe(400); //Check that the status is 400
      expect(response.body.error).toBe('All inputs must be positive integers');//Check the error
    });
  });
});
