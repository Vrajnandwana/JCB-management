// routes/dailyLogRoutes.js 
import express from 'express';
import {
  createDailyLog,
  getLogsBySite,
  updateDailyLog,
  deleteDailyLog
} from '../controllers/dailyLogController.js';
import DailyLog from '../models/DailyLog.js';
import Site from '../models/Site.js';
import ExcelJS from 'exceljs';

const router = express.Router();


//  Existing routes
router.post('/', createDailyLog); // POST /api/dailylogs
router.get('/:siteId', getLogsBySite); // GET /api/dailylogs/:siteId

router.put('/:logId', updateDailyLog);     // PUT /api/dailylogs/:logId
router.delete('/:logId', deleteDailyLog);  // DELETE /api/dailylogs/:logId
//  NEW: Download logs as Excel for a site
router.get('/download/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params;

    const site = await Site.findById(siteId);
    const logs = await DailyLog.find({ siteId });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daily Logs');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Machine', key: 'machineType', width: 20 },
      { header: 'Hours Used', key: 'hoursUsed', width: 15 },
      { header: 'Rate (Rs/hr)', key: 'rate', width: 15 },
      { header: 'Amount (Rs)', key: 'amount', width: 15 },
    ];

    logs.forEach(log => {
      worksheet.addRow({
        date: new Date(log.date).toLocaleDateString('en-IN'),
        machineType: log.machineType,
        hoursUsed: log.hoursUsed || 0,
        rate: log.rate || 0,
        amount: (log.hoursUsed || 0) * (log.rate || 0),
      });
    });

    const totalAmount = logs.reduce((sum, log) => sum + (log.hoursUsed || 0) * (log.rate || 0), 0);
    worksheet.addRow({});
    worksheet.addRow({ machineType: 'Total Amount (Rs)', amount: totalAmount });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${site.siteName}_logs.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate Excel file' });
  }
});

export default router;
