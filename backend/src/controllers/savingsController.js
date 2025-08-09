import { loadCSV } from '../utils/csvLoader.js';
import * as savingsService from '../services/savingsService.js';

const deviceFile = './src/data/devices.csv';

export async function getSavings(req, res, next) {
  try {
    const { deviceId, start, end } = req.query;

    if (!deviceId) {
      return res.status(400).json({ message: 'deviceId is required' });
    }

    const devicesData = await loadCSV(deviceFile);
    if (Number(deviceId) > devicesData.length) {
      console.log(('--device id more than 10'));

      return res.status(400).json({
        message: `Bad Request. Enter DeviceId from 1 to ${devicesData.length}`,
      });
    }

    const rows = await savingsService.getSavingsForDeviceInRange(
      deviceId,
      start,
      end
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}
