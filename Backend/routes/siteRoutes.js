import express from 'express';
import { createSite } from '../controllers/siteController.js';
import Site from '../models/Site.js';

const router = express.Router();

// ✅ POST: Create a new site
router.post('/', createSite);

// ✅ GET: Fetch all sites
router.get('/', async (req, res) => {
  try {
    const sites = await Site.find().sort({ createdAt: -1 });
    res.json(sites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET: Site by ID
router.get('/:siteId', async (req, res) => {
  try {
    const site = await Site.findById(req.params.siteId);
    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }
    res.json(site);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PUT: Update site status
router.put('/:siteId/status', async (req, res) => {
  try {
    const { status } = req.body;

    const updatedSite = await Site.findByIdAndUpdate(
      req.params.siteId,
      { status },
      { new: true }
    );

    if (!updatedSite) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.json(updatedSite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
