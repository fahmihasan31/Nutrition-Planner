const menuModel = require(`../models/index`).menus
const upload = require(`./upload-menu`)
const path = require(`path`)
const fs = require(`fs`)
const { Op } = require(`sequelize`)

exports.getFoodImage = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../menu-image", filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Server Error" });
    }
  });
};

exports.createMenu = async (req, res) => {
  const uploadMenu = upload.single('picture');

  uploadMenu(req, res, async (error) => {
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: 'File gambar tidak boleh kosong',
      });
    }

    const { name_menu, category, protein, carbs, calories, description } = req.body;

    if (!name_menu || !category || !protein || !carbs || !calories || !description) {
      return res.status(400).json({
        status: false,
        message: 'Semua field harus diisi',
      });
    }

    if (isNaN(protein) || isNaN(carbs) || isNaN(calories)) {
      return res.status(400).json({
        status: false,
        message: 'Protein, Carbs, dan Calories harus berupa angka',
      });
    }

    const allowedCategory = ['food', 'drink'];
    if (!allowedCategory.includes(category)) {
      return res.status(400).json({
        status: false,
        message: 'Category harus "food" atau "drink"',
      });
    }

    try {
      const existingMenu = await menuModel.findOne({
        where: {
          name_menu: {
            [Op.like]: name_menu,
          }
        }
      });

      if (existingMenu) {
        return res.status(400).json({
          status: false,
          message: 'Menu dengan nama tersebut sudah ada',
        });
      }

      const newMenu = await menuModel.create({
        name_menu,
        category,
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        calories: parseFloat(calories),
        description,
        picture: req.file.filename,
      });

      return res.status(201).json({
        status: true,
        message: 'Menu berhasil ditambahkan',
        data: newMenu,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  });
};

exports.getAllMenuCategory = async (req, res) => {
  const { category } = req.query;

  try {
    const whereClause = {};

    if (category) {
      const allowedCategory = ['food', 'drink'];
      if (!allowedCategory.includes(category.toLowerCase())) {
        return res.status(400).json({
          status: false,
          message: 'Kategori hanya boleh "food" atau "drink"',
        });
      }
      whereClause.category = category.toLowerCase();
    }

    const menus = await menuModel.findAll({ where: whereClause });

    if (menus.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Menu tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Berhasil mendapatkan menu',
      data: menus,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

exports.getMenuById = async (req, res) => {
  const menuId = req.params.id;

  try {
    const menu = await menuModel.findByPk(menuId);

    if (!menu) {
      return res.status(404).json({
        status: false,
        message: 'Menu tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Berhasil mendapatkan menu',
      data: menu,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

exports.getMenuByKey = async (req, res) => {
  try {
    const { key } = req.params;

    const menus = await menuModel.findAll({
      where: {
        [Op.or]: [
          { name_menu: { [Op.like]: `%${key}%` } },
          { category: { [Op.like]: `%${key}%` } },
          { description: { [Op.like]: `%${key}%` } }
        ]
      },
      attributes: [
        'menu_id',
        'name_menu',
        'category',
        'protein',
        'carbs',
        'calories',
        'description',
        'picture'
      ]
    });

    if (menus.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Menu tidak ditemukan'
      });
    }

    return res.status(200).json({
      status: true,
      data: menus,
      message: 'Data menu berhasil ditemukan'
    });

  } catch (error) {
    console.error('Error searchMenu:', error);
    return res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};


exports.updateMenu = async (req, res) => {
  const uploadMenu = upload.single('picture');

  uploadMenu(req, res, async (error) => {
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }

    const menuId = req.params.id;

    try {
      const menu = await menuModel.findByPk(menuId);

      if (!menu) {
        return res.status(404).json({
          status: false,
          message: 'Menu tidak ditemukan',
        });
      }

      const {
        name_menu = menu.name_menu,
        category = menu.category,
        protein = menu.protein,
        carbs = menu.carbs,
        calories = menu.calories,
        description = menu.description,
      } = req.body;

      const allowedCategory = ['food', 'drink'];
      if (req.body.category && !allowedCategory.includes(category)) {
        return res.status(400).json({
          status: false,
          message: 'Category harus "food" atau "drink"',
        });
      }

      if (req.body.protein && isNaN(protein)) {
        return res.status(400).json({
          status: false,
          message: 'Protein harus berupa angka',
        });
      }

      if (req.body.carbs && isNaN(carbs)) {
        return res.status(400).json({
          status: false,
          message: 'Carbs harus berupa angka',
        });
      }

      if (req.body.calories && isNaN(calories)) {
        return res.status(400).json({
          status: false,
          message: 'Calories harus berupa angka',
        });
      }

      if (req.body.name_menu && req.body.name_menu !== menu.name_menu) {
        const existingMenu = await menuModel.findOne({
          where: {
            name_menu: {
              [Op.like]: req.body.name_menu
            },
            menu_id: { [Op.ne]: menuId }
          }
        });

        if (existingMenu) {
          return res.status(400).json({
            status: false,
            message: 'Menu dengan nama tersebut sudah ada',
          });
        }
      }

      await menu.update({
        name_menu,
        category,
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        calories: parseFloat(calories),
        description,
        picture: req.file ? req.file.filename : menu.picture
      });

      return res.status(200).json({
        status: true,
        message: 'Menu berhasil diupdate',
        data: menu,
      });

    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  });
};

exports.deleteMenu = async (req, res) => {
  const menuId = req.params.id;

  try {
    const menu = await menuModel.findByPk(menuId);

    if (!menu) {
      return res.status(404).json({
        status: false,
        message: 'Menu tidak ditemukan',
      });
    }

    if (menu.picture) {
      const imagePath = path.join(__dirname, '../menu-image', menu.picture);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await menu.destroy();

    return res.status(200).json({
      status: true,
      message: 'Menu dan gambarnya berhasil dihapus',
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};