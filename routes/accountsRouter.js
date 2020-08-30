import express from 'express';
import {
  doDeposit,
  doWithdraw,
  checkBalanceFrom,
  createNewAccount,
  deleteExistingAccount,
} from '../controller/accountController.js';

const accountRouter = express.Router();

accountRouter.put('/deposit', doDeposit);
accountRouter.put('/withdraw', doWithdraw);
accountRouter.get('/checkBalance', checkBalanceFrom);
accountRouter.post('/newAccount', createNewAccount);
accountRouter.delete('/deleteAccount', deleteExistingAccount);

export { accountRouter };
