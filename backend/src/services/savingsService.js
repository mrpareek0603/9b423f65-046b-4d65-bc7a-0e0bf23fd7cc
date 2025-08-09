import * as savingRepo from '../repositories/savingsRepository.js';
import dayjs from 'dayjs';
export async function getSavingsForDeviceInRange(deviceId, startDate, endDate) {

  const savingsData = await savingRepo.findByDeviceAndRange(deviceId, startDate, endDate);
  const monthlyMap = {};
  let totalCarbon = 0;
  let totalDiesel = 0;

  savingsData.forEach(row => {
    const month = dayjs(row.timestamp).format('MMM YYYY');
    const carbon = parseFloat(row.carbon_saved || 0);
    const diesel = parseFloat(row.fueld_saved || 0);
    totalCarbon += carbon;
    totalDiesel += diesel;

    if (!monthlyMap[month]) monthlyMap[month] = { carbonSaved: 0, dieselSaved: 0 };
    monthlyMap[month].carbonSaved += carbon;
    monthlyMap[month].dieselSaved += diesel;
  });

  const data = Object.entries(monthlyMap).map(([month, values]) => ({
    month,
    ...values,
  }));

  const fetchedData = {
    totalCarbon: parseFloat((totalCarbon/1000).toFixed(1)),
    totalDiesel: parseFloat(totalDiesel.toFixed(1)),
    monthlyCarbon: parseFloat(((totalCarbon / data.length)/1000).toFixed(1)),
    monthlyDiesel: parseFloat((totalDiesel / data.length).toFixed(1)),
    data,
  };

  return fetchedData;
}