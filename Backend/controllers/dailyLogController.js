// controllers/dailyLogController.js
import DailyLog from '../models/DailyLog.js';

// Create new daily log entry
export const createDailyLog = async (req, res) => {
  try {
    const log = new DailyLog(req.body);
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating daily log', error: error.message });
  }
};

// Get logs by siteId
export const getLogsBySite = async (req, res) => {
  try {
    const siteId = req.params.siteId;
    const logs = await DailyLog.find({ siteId });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs', error: error.message });
  }
};
