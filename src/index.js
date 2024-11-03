import express from 'express';
import {PORT} from './config.js';
import solutionsRoutes from './routes/solution.routes.js';

const app = express();
app.use(express.json());

app.use(solutionsRoutes);


app.listen(PORT, ()=> console.log('server listening on port', PORT));


export default app 