import axios from 'axios';
import { User } from '../models/user.model';  
import { setTimeout } from 'timers/promises';  


const axiosInstance = axios.create({
  baseURL: 'https://randomuser.me/api/', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export const fetchDataWithRateLimit = async (batchSize: number): Promise<void> => {
    try {
      const response = await axios.get(`https://randomuser.me/api/?results=${batchSize}`);
  
      const users = response.data.results;
  
      const userDocuments = users.map((user: any) => ({
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        gender: user.gender,
        age: user.dob.age,
        dob: new Date(user.dob.date),
        country: user.location.country,
      }));
  
      await User.insertMany(userDocuments);
  
      console.log(`Successfully saved ${users.length} users to the database.`);
    } catch (error) {
      console.error('Error while fetching and saving user data:', error);
      throw error;
    }
  };

