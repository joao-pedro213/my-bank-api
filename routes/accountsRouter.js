import express from 'express';
import {
  doDeposit,
  doWithdraw,
  checkBalanceFrom,
  createNewAccount,
  deleteExistingAccount,
  doTransfer,
  doBalanceAvgFromAgency,
  clientsWithLowerBalance,
  clientsWithHigherBalance,
  createPrivateClientsList,
} from '../controller/accountController.js';

const accountRouter = express.Router();

accountRouter.put('/deposit', doDeposit);
accountRouter.put('/withdraw', doWithdraw);
accountRouter.get('/checkBalance', checkBalanceFrom);
accountRouter.post('/newAccount', createNewAccount);
accountRouter.delete('/deleteAccount', deleteExistingAccount);
accountRouter.put('/transfer', doTransfer);
accountRouter.get('/balanceAvg', doBalanceAvgFromAgency);
accountRouter.get('/clientsWithLowerBalance', clientsWithLowerBalance);
accountRouter.get('/clientsWithHigherBalance', clientsWithHigherBalance);
accountRouter.get('/privateClients', createPrivateClientsList);

export { accountRouter };
