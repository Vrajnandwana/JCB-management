import Site from '../models/Site.js';

// @desc    Create a new site
// @route   POST /api/sites
// @access  Public (for now)
export const createSite = async (req, res) => {
  try {
    const newSite = new Site(req.body);
    const savedSite = await newSite.save();
    res.status(201).json(savedSite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
