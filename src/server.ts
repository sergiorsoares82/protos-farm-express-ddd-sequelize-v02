import express from 'express';
import routes from './interfaces/http/routes/routes';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello My API!');
});

app.use(routes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
