import express from 'express';
import { accountRouter } from './routes/accountsRouter.js';
import { db } from './models/index.js';

(async () => {
  try {
    await db.mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected.');
  } catch (err) {
    console.log('Error connecting to database: ' + err);
  }
})();

const app = express();

app.use(express.json());
app.use('/accounts', accountRouter);

app.listen(process.env.PORT, () => console.log('API is running.'));
