import { db } from '../models/index.js';

const Account = db.account;
const WITHDRAW_FEE = 1;
const TRANSFER_FEE = 8;

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
      res.send('balance updated. balance: ' + updatedAccount[0].balance);
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

      res.send('balance updated. balance: ' + updatedAccount[0].balance);
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

const doTransfer = async (req, res) => {
  let transferValue = req.body.transferValue;
  const originAccountAgency = req.body.originAccountAgency;
  const originalAccountNumber = req.body.originAccountNumber;
  const destinationAccountAgency = req.body.destinationAccountAgency;
  const destinationAccountNumber = req.body.destinationAccountNumber;

  try {
    //prettier-ignore
    const originAccount = await validateAccountExistence(originAccountAgency, originalAccountNumber)
    //prettier-ignore
    const destinationAccount = await validateAccountExistence(destinationAccountAgency, destinationAccountNumber);

    if (!originAccount || !destinationAccount) {
      res
        .status(404)
        .send('The origin account or the destination does not exists.');
      return;
    }

    if (originAccountAgency === destinationAccountAgency) {
      if (originAccount[0].balance < transferValue) {
        res.status(500).send('Insufficient balance.');
        return;
      }
      const updatedOriginAccount = await Account.findByIdAndUpdate(
        originAccount[0]._id,
        { $inc: { balance: transferValue * -1 } },
        { new: true }
      );
      await Account.findByIdAndUpdate(
        destinationAccount[0]._id,
        { $inc: { balance: transferValue } },
        { new: true }
      );

      res.send(
        'Transfer done with success. Current balance: ' +
          updatedOriginAccount.balance
      );
    } else {
      transferValue = transferValue + TRANSFER_FEE;
      if (originAccount[0].balance < transferValue) {
        res.status(500).send('Insufficient balance.');
        return;
      }
      const updatedOriginAccount = await Account.findByIdAndUpdate(
        originAccount[0]._id,
        { $inc: { balance: transferValue * -1 } },
        { new: true }
      );
      await Account.findByIdAndUpdate(
        destinationAccount[0]._id,
        { $inc: { balance: transferValue - TRANSFER_FEE } },
        { new: true }
      );
      res.send(
        'Transfer done with success. Current balance: ' +
          updatedOriginAccount.balance
      );
    }
  } catch (err) {
    res.status(500).send('Error on doing transference: ' + err);
  }
};

const doBalanceAvgFromAgency = async (req, res) => {
  const agency = req.body.agency;
  try {
    const isAgency = await Account.find({ agencia: agency });
    if (isAgency.length === 0) {
      res.status(404).send('Agency not found.');
      return;
    }
    let balanceAvg = await Account.aggregate([
      { $match: { agencia: agency } },
      { $group: { _id: '$agencia', average: { $avg: '$balance' } } },
    ]);
    balanceAvg = balanceAvg[0].average.toFixed(2);
    res.send(`The balance average at agency ${agency} is: ${balanceAvg}`);
  } catch (err) {
    res.status(500).send('Error on calculating balance average: ' + err);
  }
};

const clientsWithLowerBalance = async (req, res) => {
  const limit = req.body.limit;
  try {
    const clientsList = await Account.find(
      { balance: { $gt: 0 } },
      { _id: 0, agencia: 1, conta: 1, balance: 1 }
    )
      .sort({ balance: 1 })
      .limit(limit);
    res.send(clientsList);
  } catch (err) {
    res.status(500).send('Error on listing clients: ' + err);
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
  doTransfer,
  doBalanceAvgFromAgency,
  clientsWithLowerBalance,
};
