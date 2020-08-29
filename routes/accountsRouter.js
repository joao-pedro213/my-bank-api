import express from 'express';

const accountRouter = express.Router();

accountRouter.get('/', (_, res) => {
  res.send('Route is working.');
});

export { accountRouter };
