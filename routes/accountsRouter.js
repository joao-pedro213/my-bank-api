import express from 'express';
import { doDeposit } from '../controller/accountController.js';

const accountRouter = express.Router();

accountRouter.put('/deposit', doDeposit);

export { accountRouter };
