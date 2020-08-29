import { db } from '../models/index.js';

const Account = db.account;

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
      await Account.findByIdAndUpdate(account, {
        $inc: { balance: depositValue },
      });

      res.send('balance updatated!');
    } catch (err) {
      res.status(500).send('Error on update balance: ' + err);
    }
  } else {
    res.status(404).send('This account dont exists.');
  }
};

export { doDeposit };
