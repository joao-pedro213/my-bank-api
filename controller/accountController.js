import { db } from '../models/index.js';

const Account = db.account;
const WITHDRAW_FEE = 1;

const doDeposit = async (req, res) => {
  const agency = req.body.agency;
  const accountNumber = req.body.accountNumber;
  const depositValue = req.body.value;

  const account = await Account.find(
    {
      agencia: agency,
      conta: accountNumber,
    },
    { _id: 1 }
  );

  if (account.length > 0) {
    try {
      const updatedAccount = await Account.findByIdAndUpdate(
        account,
        { $inc: { balance: depositValue } },
        { new: true }
      );

      res.send('balance updated. balance: ' + updatedAccount.balance);
    } catch (err) {
      res.status(500).send('Error on update balance: ' + err);
    }
  } else {
    res.status(404).send('This account dont exists.');
  }
};

const doWithdraw = async (req, res) => {
  const agency = req.body.agency;
  const accountNumber = req.body.accountNumber;
  const withDrawValue = req.body.value + WITHDRAW_FEE;

  const account = await Account.find(
    {
      agencia: agency,
      conta: accountNumber,
    },
    { _id: 1, balance: 1 }
  );

  console.log(withDrawValue);

  if (account[0].balance < withDrawValue) {
    res.status(500).send('Insufficient balance.');
  }

  if (account.length > 0) {
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
    res.status(404).send('This account dont exists.');
  }
};

export { doDeposit, doWithdraw };
