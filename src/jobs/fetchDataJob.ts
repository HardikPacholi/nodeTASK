import dotenv from 'dotenv';
import { setTimeout } from 'timers/promises';  
import { fetchDataWithRateLimit } from '../services/randomUserService';

dotenv.config();  

const { REQUESTS_PER_BATCH, SLEEP_TIME, REQUESTS_PER_SECOND } = process.env;

export const processUserDataQueue = async () => {
  let requestsMade = 0;
  const totalRequests = 5000; 

  while (requestsMade < totalRequests) {
    console.log(`Fetching batch starting from request ${requestsMade + 1}...`);
    await fetchDataWithRateLimit(parseInt(REQUESTS_PER_BATCH as string)); 

    requestsMade += parseInt(REQUESTS_PER_BATCH as string);

    if (requestsMade % (parseInt(REQUESTS_PER_BATCH as string) * 5) === 0) {
      console.log(`Sleeping for ${SLEEP_TIME} seconds...`);
      await setTimeout(parseInt(SLEEP_TIME as string) * 1000);
    }

    await setTimeout(1000 / parseInt(REQUESTS_PER_SECOND as string));
  }

  console.log('Completed fetching and saving all user data.');
};