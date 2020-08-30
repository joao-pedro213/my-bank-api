import express from 'express';
import {
  doDeposit,
  doWithdraw,
  checkBalanceFrom,
} from '../controller/accountController.js';

const accountRouter = express.Router();

accountRouter.put('/deposit', doDeposit);
accountRouter.put('/withdraw', doWithdraw);
accountRouter.get('/checkBalance', checkBalanceFrom);

export { accountRouter };
