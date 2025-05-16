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

// Update daily log entry
export const updateDailyLog = async (req, res) => {
  try {
    const updatedLog = await DailyLog.findByIdAndUpdate(req.params.logId, req.body, { new: true });
    if (!updatedLog) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.status(200).json(updatedLog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating log', error: error.message });
  }
};

// Delete daily log entry
export const deleteDailyLog = async (req, res) => {
  try {
    const deletedLog = await DailyLog.findByIdAndDelete(req.params.logId);
    if (!deletedLog) {
      return res.status(404).json({ message: 'Log not found' });
    }
    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting log', error: error.message });
  }
};
