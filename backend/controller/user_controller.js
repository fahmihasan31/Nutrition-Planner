// Import model
const userModel = require('../models/index').users;
//import library
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      age,
      gender,
      weight,
      height,
      activity_level,
      goal
    } = req.body;

    if (!username || !email || !password || !age || !gender || !weight || !height || !activity_level || !goal) {
      return res.status(400).json({
        status: false,
        message: 'Semua field harus diisi',
      });
    }

    if (!password) {
      return res.status(400).json({
        status: false,
        message: 'Password wajib diisi'
      });
    }

    const validGender = ['male', 'female'];
    if (gender && !validGender.includes(gender)) {
      return res.status(400).json({
        status: false,
        message: 'Gender harus salah satu dari "male" atau "female"'
      });
    }

    const validActivity = ['low', 'medium', 'high'];
    if (activity_level && !validActivity.includes(activity_level)) {
      return res.status(400).json({
        status: false,
        message: 'Activity Level Gender harus salah satu dari "low", "medium", atau "high"'
      });
    }

    const validGoal = ['lose_weight', 'maintain_weight', 'gain_weight'];
    if (goal && !validGoal.includes(goal)) {
      return res.status(400).json({
        status: false,
        message: 'Goal Gender harus salah satu dari "lose_weight", "maintain_weight", atau "gain_weight"'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      age,
      gender,
      weight,
      height,
      activity_level,
      goal
    });

    return res.status(201).json({
      status: true,
      message: 'User berhasil dibuat',
      data: newUser
    });

  } catch (error) {
    console.error('Error createUser:', error);
    return res.status(500).json({
      status: false,
      error: error.message
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await userModel.findAll({
      attributes: [
        'user_id',
        'username',
        'email',
        'age',
        'gender',
        'weight',
        'height',
        'activity_level',
        'goal'
      ]
    });

    if (users.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'User tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Data user ditampilkan semua',
      data: users
    })
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message
    })
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findOne({
      where: { user_id: id },
      attributes: [
        'user_id',
        'username',
        'email',
        'age',
        'gender',
        'weight',
        'height',
        'activity_level',
        'goal'
      ]
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User tidak ditemukan'
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Data user berhasil ditemukan',
      data: user
    });
  } catch (error) {
    console.error('Error getUserById:', error);
    return res.status(500).json({
      status: false,
      error: error.message
    });
  }
};

exports.getUserbyKey = async (req, res) => {
  try {
    const { key } = req.params;

    const users = await userModel.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${key}%` } },
          { email: { [Op.like]: `%${key}%` } },
          { gender: { [Op.like]: `%${key}%` } },
          { activity_level: { [Op.like]: `%${key}%` } },
          { goal: { [Op.like]: `%${key}%` } }
        ]
      },
      attributes: [
        'user_id',
        'username',
        'email',
        'age',
        'gender',
        'weight',
        'height',
        'activity_level',
        'goal'
      ]
    });

    if (users.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'User tidak ditemukan'
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Data user berhasil ditemukan',
      data: users
    });

  } catch (error) {
    console.error('Error searchUser:', error);
    return res.status(500).json({
      status: false,
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      age,
      gender,
      weight,
      height,
      activity_level,
      goal
    } = req.body;

    const user = await userModel.findOne({ where: { user_id: id } });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User tidak ditemukan'
      });
    }

    if (email && email !== user.email) {
      const existingUser = await userModel.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: 'Email sudah terdaftar, gunakan email lain'
        });
      }
    }

    const validGender = ['male', 'female'];
    if (gender && !validGender.includes(gender)) {
      return res.status(400).json({
        status: false,
        message: 'Gender hanya boleh "male" atau "female"'
      });
    }

    const validActivity = ['low', 'medium', 'high'];
    if (activity_level && !validActivity.includes(activity_level)) {
      return res.status(400).json({
        status: false,
        message: 'Activity Level hanya boleh "low", "medium", atau "high"'
      });
    }

    const validGoal = ['lose_weight', 'maintain_weight', 'gain_weight'];
    if (goal && !validGoal.includes(goal)) {
      return res.status(400).json({
        status: false,
        message: 'Goal hanya boleh "lose_weight", "maintain_weight", atau "gain_weight"'
      });
    }

    await user.update({
      username,
      email,
      age,
      gender,
      weight,
      height,
      activity_level,
      goal
    });

    return res.status(200).json({
      status: true,
      message: 'Data user berhasil diupdate',
      data: user
    });

  } catch (error) {
    console.error('Error updateUser:', error);
    return res.status(500).json({
      status: false,
      error: error.message
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findOne({ where: { user_id: id } });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User tidak ditemukan'
      });
    }

    await user.destroy();

    return res.status(200).json({
      status: true,
      message: 'User berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleteUser:', error);
    return res.status(500).json({
      status: false,
      error: error.message
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: false,
        message: 'Password lama dan password baru wajib diisi'
      });
    }

    const user = await userModel.findOne({ where: { user_id: id } });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User tidak ditemukan'
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: 'Password lama salah'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedPassword });

    return res.status(200).json({
      status: true,
      message: 'Password berhasil diupdate'
    });

  } catch (error) {
    console.error('Error updatePassword:', error);
    return res.status(500).json({
      status: false,
      error: error.message
    });
  }
};