import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import identifyRoutes from './routes/identifyRoutes';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/identify', identifyRoutes);

// app.listen(port, () => {
//     console.log(`app listening at port ${port}`);
// });

// app.get("/", (req, res) => {
//     res.send(`hello from server`);
// })

export default app;
