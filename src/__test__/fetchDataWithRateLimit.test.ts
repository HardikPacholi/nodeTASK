import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import { fetchDataWithRateLimit } from '../services/randomUserService';
import { User } from '../models/user.model';

const mockAxios = new axiosMockAdapter(axios);
jest.mock('../models/user.model', () => ({
  User: {
    insertMany: jest.fn(),
  },
}));

describe('fetchDataWithRateLimit', () => {
  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it('should fetch user data and save it to the database', async () => {
    const mockBatchSize = 1; // Adjusting the batch size for simplicity
    const mockApiResponse = {
      results: [
        {
          name: { first: 'Aadi', last: 'Anand' },
          email: 'aadi.anand@example.com',
          gender: 'male',
          dob: { age: 56, date: '1968-04-29T06:16:16.758Z' },
          location: { country: 'India' },
        },
      ],
    };

    const expectedMappedUsers = [
      {
        name: 'Aadi Anand',
        email: 'aadi.anand@example.com',
        gender: 'male',
        age: 56,
        dob: new Date('1968-04-29T06:16:16.758Z'),
        country: 'India',
      },
    ];

    // Mock Axios response
    mockAxios.onGet(`https://randomuser.me/api/?results=${mockBatchSize}`).reply(200, mockApiResponse);

    // Call the service function
    await fetchDataWithRateLimit(mockBatchSize);

    // Assertions
    expect(mockAxios.history.get.length).toBe(1); // Ensure the API was called once
    expect(User.insertMany).toHaveBeenCalledWith(expectedMappedUsers); // Ensure data was saved correctly
    expect(User.insertMany).toHaveBeenCalledTimes(1); // Ensure `insertMany` was called once
  });

  it('should throw an error if the API call fails', async () => {
    const mockBatchSize = 1;

    // Mock Axios to simulate API failure
    mockAxios.onGet(`https://randomuser.me/api/?results=${mockBatchSize}`).reply(500);

    await expect(fetchDataWithRateLimit(mockBatchSize)).rejects.toThrowError('Request failed with status code 500');

    // Ensure no data was saved to the database
    expect(User.insertMany).not.toHaveBeenCalled();
  });
});
