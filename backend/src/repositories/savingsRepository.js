import dayjs from 'dayjs';
import { loadCSV } from '../utils/csvLoader.js';

const savingsFile = './src/data/device-saving.csv';

export async function findByDeviceAndRange(deviceId, start, end) {
  const rows = await loadCSV(savingsFile);

  const startDate = dayjs(start);
  const endDate   = dayjs(end);

  const filtered = rows.filter(row => {
    const ts = dayjs(row.timestamp);
    return String(row.device_id) === String(deviceId)
      && (ts.isAfter(startDate) || ts.isSame(startDate))
      && (ts.isBefore(endDate)  || ts.isSame(endDate));
  });

  return filtered;
}
