import app from './app';
import 'reflect-metadata';
import { AppDataSource } from './data-source';

const PORT = process.env.PORT || 8000;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected!');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error('DB connection error:', error));