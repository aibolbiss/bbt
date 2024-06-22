import express from 'express';
import authRoute from './routes/auth.route.js';
import postRoute from './routes/post.route.js';

const app = express();

app.use(express.json()); // Postman

app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

app.listen(8000, () => {
  console.log('Server is running!');
});
