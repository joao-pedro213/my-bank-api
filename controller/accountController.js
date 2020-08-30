import { db } from '../models/index.js';

const Account = db.account;
const WITHDRAW_FEE = 1;

const doDeposit = async (req, res) => {
  const agency = req.body.agency;
  const accountNumber = req.body.accountNumber;
  const depositValue = req.body.value;

  const account = await validateAccountExistence(agency, accountNumber);

  if (account) {
    try {
      const updatedAccount = await Account.findByIdAndUpdate(
        account[0]._id,
        { $inc: { balance: depositValue } },
        { new: true }
      );
      res.send('balance updated. balance: ' + updatedAccount.balance);
    } catch (err) {
      res.status(500).send('Error on update balance: ' + err);
    }
  } else {
    res.status(404).send('Account not found.');
  }
};

const doWithdraw = async (req, res) => {
  const agency = req.body.agency;
  const accountNumber = req.body.accountNumber;
  const withDrawValue = req.body.value + WITHDRAW_FEE;

  const account = await validateAccountExistence(agency, accountNumber);

  if (account) {
    if (account[0].balance < withDrawValue) {
      res.status(500).send('Insufficient balance.');
      return;
    }

    try {
      const updatedAccount = await Account.findByIdAndUpdate(
        account[0]._id,
        { $inc: { balance: withDrawValue * -1 } },
        { new: true }
      );

      res.send('balance updated. balance: ' + updatedAccount.balance);
    } catch (err) {
      res.status(500).send('Error on update balance: ' + err);
    }
  } else {
    res.status(404).send('Account not found.');
  }
};

const checkBalanceFrom = async (req, res) => {
  const agency = req.body.agency;
  const accountNumber = req.body.accountNumber;

  try {
    const account = await validateAccountExistence(agency, accountNumber);

    if (account) {
      res.send('Current balance: ' + account[0].balance);
    } else {
      res.status(404).send('Account not found.');
    }
  } catch (err) {
    res.status(500).send('Error on checking the balance.');
  }
};

const createNewAccount = async (req, res) => {
  const agency = req.body.agency;
  const accountNumber = req.body.accountNumber;
  const accountOwner = req.body.accountOwner;
  const initialBalance = 0;
  try {
    const account = await new Account({
      agencia: agency,
      conta: accountNumber,
      name: accountOwner,
      balance: initialBalance,
    }).save();
    res.send('Account inserida com sucesso. \n' + account);
  } catch (err) {
    res.status(500).send('Error on creating new account: ' + err);
  }
};

const deleteExistingAccount = async (req, res) => {
  const agency = req.body.agency;
  const accountNumber = req.body.accountNumber;

  const account = await validateAccountExistence(agency, accountNumber);

  if (account) {
    try {
      await Account.findByIdAndDelete(account[0]._id);
      //prettier-ignore
      const numberOfAccountsByAgency = await Account.countDocuments({agencia: agency,});
      console.log(numberOfAccountsByAgency);
      res.send(
        `Account deleted. \n Currently exists ${numberOfAccountsByAgency} accounts for the agency ${agency}.`
      );
    } catch (err) {
      res.status(500).send('Error on deleting account: ' + err);
    }
  } else {
    res.status(404).send('Account not found.');
  }
};

const validateAccountExistence = async (agency, accountNumber) => {
  // prettier-ignore
  const account = await Account.find({ agencia: agency, conta: accountNumber,});

  if (account.length === 0) {
    return false;
  }
  return account;
};

export {
  doDeposit,
  doWithdraw,
  checkBalanceFrom,
  createNewAccount,
  deleteExistingAccount,
};
