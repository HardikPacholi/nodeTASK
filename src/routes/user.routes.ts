import express from 'express';
import { User } from '../models/user.model';
import { processUserDataQueue } from '../jobs/fetchDataJob';

const router = express.Router();

router.post('/fetch', async (req, res) => {
    try {
      await processUserDataQueue();
      res.status(200).send('Started fetching user data in background');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error occurred while processing the request');
    }
  });

router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort = 'name', search = '{}' } = req.query;
  
  const sortField = sort as string;
  
  const searchObj = JSON.parse(search as string);

  const users = await User.find(searchObj)
    .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    .limit(parseInt(limit as string))
    .sort({ [sortField]: 1 }); 
  res.json(users);
});

export default router;
