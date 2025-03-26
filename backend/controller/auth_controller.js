const userModel = require('../models/index').users;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const Login = async (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({
      status: false,
      logged: false,
      message: 'Email dan password harus diisi'
    });
  }
  console.log('SECRET_KEY:', SECRET_KEY);

  try {
    // Cari user berdasarkan email
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: false,
        logged: false,
        message: 'Email tidak ditemukan'
      });
    }

    // Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        logged: false,
        message: 'Password salah'
      });
    }

    // Generate JWT Token
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    return res.status(200).json({
      status: true,
      logged: true,
      message: 'Login berhasil',
      data: payload,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      logged: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

module.exports = { Login };