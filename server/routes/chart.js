import express from 'express';
import { ephemerisService } from '../swisseph-service.js';

const router = express.Router();

// Calculate full Vedic birth chart (D1, D9, D10, Vimshottari, Doshas)
router.post('/calculate', async (req, res) => {
  try {
    const { dob, tob, lat, lon, tz } = req.body;

    if (!dob || !tob) {
      return res.status(400).json({ message: 'Date of birth and Time of birth are required' });
    }

    const latitude = parseFloat(lat ?? 18.5204); // Default to Pune
    const longitude = parseFloat(lon ?? 73.8567);
    const timezone = parseFloat(tz ?? 5.5);

    const chart = await ephemerisService.calculateBirthChart({
      dob,
      tob,
      lat: latitude,
      lon: longitude,
      tz: timezone,
    });

    return res.status(200).json(chart);
  } catch (err) {
    console.error('Calculate Chart Error:', err);
    return res.status(500).json({ message: 'Failed to calculate astronomical chart', error: err.message });
  }
});

// Calculate Daily Gochar (Transit) vs Natal Chart
router.post('/daily', async (req, res) => {
  try {
    const natalData = req.body;
    const daily = await ephemerisService.calculateDailyGochar(natalData);
    return res.status(200).json(daily);
  } catch (err) {
    console.error('Calculate Daily Gochar Error:', err);
    return res.status(500).json({ message: 'Failed to calculate daily gochar', error: err.message });
  }
});

export default router;
