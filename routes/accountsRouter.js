import express from 'express';
import { doDeposit, doWithdraw } from '../controller/accountController.js';

const accountRouter = express.Router();

accountRouter.put('/deposit', doDeposit);
accountRouter.put('/withdraw', doWithdraw);

export { accountRouter };
