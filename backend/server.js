import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { boqRouter } from './routes/boq.js';
import { vendorRouter } from './routes/vendors.js';
import { substitutionRouter } from './routes/substitutions.js';
import { poRouter } from './routes/po.js';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.use('/api/boq', boqRouter);
app.use('/api/vendors', vendorRouter);
app.use('/api/substitutions', substitutionRouter);
app.use('/api/po', poRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
