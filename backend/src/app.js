require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/auth',    require('./routes/authRoutes'));
app.use('/api/admin',   require('./routes/adminRoutes'));
app.use('/api/users',   require('./routes/userRoutes'));
app.use('/api/stores',  require('./routes/storeRoutes'));
app.use('/api/owner',   require('./routes/ownerRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
