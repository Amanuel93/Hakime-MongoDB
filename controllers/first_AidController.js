// controllers/firstAidController.js
const { First_Aids } = require('../models');
const { uploadImage } = require('../middleware/multerMiddleware');

// Create a new first aid entry
const createFirstAid = async (req, res) => {
  try {
    uploadImage(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const { title, content, source } = req.body;
      const image = req.file ? req.file.path : null;

      const firstAid = await First_Aids.create({
        title,
        content,
        source,
        image,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      res.status(201).json(firstAid);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all first aid entries
const getAllFirstAids = async (req, res) => {
  try {
    const firstAids = await First_Aids.findAll();
    res.status(200).json(firstAids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single first aid entry by ID
const getFirstAidById = async (req, res) => {
  try {
    const firstAid = await First_Aids.findByPk(req.params.id);
    if (!firstAid) {
      return res.status(404).json({ error: 'First aid entry not found' });
    }
    res.status(200).json(firstAid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a first aid entry by ID
const updateFirstAid = async (req, res) => {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const { title, content, source } = req.body;
      const image = req.file ? req.file.path : null;

      const firstAid = await First_Aids.findByPk(req.params.id);
      if (!firstAid) {
        return res.status(404).json({ error: 'First aid entry not found' });
      }

      await firstAid.update({
        title,
        content,
        source,
        image: image || firstAid.image,
        updatedAt: new Date()
      });

      res.status(200).json(firstAid);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a first aid entry by ID
const deleteFirstAid = async (req, res) => {
  try {
    const firstAid = await First_Aids.findByPk(req.params.id);
    if (!firstAid) {
      return res.status(404).json({ error: 'First aid entry not found' });
    }

    await firstAid.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFirstAid,
  getAllFirstAids,
  getFirstAidById,
  updateFirstAid,
  deleteFirstAid
};
