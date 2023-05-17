const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');

const { createPool } = require('mysql2/promise');

const connection = createPool({
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  console.log(req.body)

  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const q = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const result = await connection.execute(q, [name, email, hashedPassword]);
    res.status(201).json('user created!');
  } catch (err) {

    res.status(500).json({
      err: 'Internal server error',
    });
  }
};

const login = async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;
  let token;
  const q = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  try {
    const [rows] = await connection.execute(q, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const validPassword = await bcrypt.compare(password, rows[0].password);

    if (!validPassword) {
      return res.status(404).json({ error: 'Incorrect password' });
    }

    token = Jwt.sign(rows[0], process.env.SECRET_KEY, {
      expiresIn: '30d',
    });
    console.log(rows[0]);

    res.status(202).json({ user: rows[0], token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: 'Internal server error',
    });
  }
};

module.exports = { createUser, login };
