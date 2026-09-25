import express from 'express';
import jwt from 'jsonwebtoken';
import { pythonEphemerisService as ephemerisService } from '../python-service.js';
import { saveBirthProfile, getBirthProfileByUserId, getBirthProfileById } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'astromath_cosmic_secret_key_2026';

// Standard City Coordinates Directory
const CITY_COORDINATES = {
  pune: { lat: 18.5204, lon: 73.8567, tz: 5.5 },
  mumbai: { lat: 19.0760, lon: 72.8777, tz: 5.5 },
  delhi: { lat: 28.7041, lon: 77.1025, tz: 5.5 },
  'new delhi': { lat: 28.6139, lon: 77.2090, tz: 5.5 },
  bengaluru: { lat: 12.9716, lon: 77.5946, tz: 5.5 },
  bangalore: { lat: 12.9716, lon: 77.5946, tz: 5.5 },
  hyderabad: { lat: 17.3850, lon: 78.4867, tz: 5.5 },
  chennai: { lat: 13.0827, lon: 80.2707, tz: 5.5 },
  kolkata: { lat: 22.5726, lon: 88.3639, tz: 5.5 },
  ahmedabad: { lat: 23.0225, lon: 72.5714, tz: 5.5 },
  surat: { lat: 21.1702, lon: 72.8311, tz: 5.5 },
  jaipur: { lat: 26.9124, lon: 75.7873, tz: 5.5 },
  lucknow: { lat: 26.8467, lon: 80.9462, tz: 5.5 },
  nagpur: { lat: 21.1458, lon: 79.0882, tz: 5.5 },
  indore: { lat: 22.7196, lon: 75.8577, tz: 5.5 },
  nashik: { lat: 19.9975, lon: 73.7898, tz: 5.5 },
  aurangabad: { lat: 19.8762, lon: 75.3433, tz: 5.5 },
  chhatrapati_sambhajinagar: { lat: 19.8762, lon: 75.3433, tz: 5.5 },
  kolhapur: { lat: 16.7050, lon: 74.2433, tz: 5.5 },
  solapur: { lat: 17.6599, lon: 75.9064, tz: 5.5 },
  thane: { lat: 19.2183, lon: 72.9781, tz: 5.5 },
  bhopal: { lat: 23.2599, lon: 77.4126, tz: 5.5 },
  patna: { lat: 25.5941, lon: 85.1376, tz: 5.5 },
  chandigarh: { lat: 30.7333, lon: 76.7794, tz: 5.5 },
  london: { lat: 51.5074, lon: -0.1278, tz: 0 },
  'new york': { lat: 40.7128, lon: -74.0060, tz: -5 },
  'san francisco': { lat: 37.7749, lon: -122.4194, tz: -8 },
  dubai: { lat: 25.2048, lon: 55.2708, tz: 4 },
  singapore: { lat: 1.3521, lon: 103.8198, tz: 8 },
  toronto: { lat: 43.6532, lon: -79.3832, tz: -5 },
  sydney: { lat: -33.8688, lon: 151.2093, tz: 10 },
  tokyo: { lat: 35.6762, lon: 139.6503, tz: 9 },
};

function resolveCoordinates(city, defaultLat, defaultLon, defaultTz) {
  if (defaultLat !== undefined && defaultLon !== undefined && !isNaN(defaultLat) && !isNaN(defaultLon)) {
    return {
      lat: parseFloat(defaultLat),
      lon: parseFloat(defaultLon),
      tz: defaultTz !== undefined && !isNaN(defaultTz) ? parseFloat(defaultTz) : 5.5,
    };
  }

  const normalized = (city || '').toLowerCase().trim();
  for (const [cityName, coords] of Object.entries(CITY_COORDINATES)) {
    if (normalized.includes(cityName)) {
      return coords;
    }
  }

  // Fallback to Pune coordinates if unknown
  return { lat: 18.5204, lon: 73.8567, tz: 5.5 };
}

// Optional Token Verification Middleware
const getAuthUserId = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/, '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (e) {
    return null;
  }
};

// 1. Save Birth Profile into SQLite Database & Calculate Astronomical Chart
router.post('/save-profile', async (req, res) => {
  try {
    const { name, dob, tob, city, lat, lon, tz } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Full name is compulsory.' });
    }
    if (!dob || !dob.trim()) {
      return res.status(400).json({ message: 'Date of birth is compulsory.' });
    }
    if (!tob || !tob.trim()) {
      return res.status(400).json({ message: 'Exact time of birth is compulsory.' });
    }
    if (!city || !city.trim()) {
      return res.status(400).json({ message: 'Place/city of birth is compulsory.' });
    }

    const coords = resolveCoordinates(city, lat, lon, tz);

    // Compute Swiss Ephemeris Vedic Chart
    const chart = await ephemerisService.calculateBirthChart({
      dob: dob.trim(),
      tob: tob.trim(),
      lat: coords.lat,
      lon: coords.lon,
      tz: coords.tz,
    });

    const userId = getAuthUserId(req) || req.body.userId || null;

    const profileRecord = {
      name: name.trim(),
      dob: dob.trim(),
      tob: tob.trim(),
      city: city.trim(),
      latitude: coords.lat,
      longitude: coords.lon,
      timezone: coords.tz,
      chartDataJson: JSON.stringify(chart),
    };

    const profileId = saveBirthProfile(userId, profileRecord);

    return res.status(200).json({
      success: true,
      message: 'Birth coordinates saved to database and celestial chart computed.',
      profileId,
      profile: {
        id: profileId,
        name: name.trim(),
        dob: dob.trim(),
        tob: tob.trim(),
        city: city.trim(),
        lat: coords.lat,
        lon: coords.lon,
        tz: coords.tz,
      },
      chart,
    });
  } catch (err) {
    console.error('Save Profile Error:', err);
    return res.status(500).json({ message: 'Failed to process birth profile', error: err.message });
  }
});

// 2. Retrieve User's Saved Birth Profile from Database
router.get('/profile', async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const profileId = req.query.profileId;

    let profile = null;
    if (userId) {
      profile = getBirthProfileByUserId(userId);
    } else if (profileId) {
      profile = getBirthProfileById(profileId);
    }

    if (!profile) {
      return res.status(200).json({ profile: null, chart: null });
    }

    let chart = null;
    if (profile.chart_data_json) {
      try {
        chart = JSON.parse(profile.chart_data_json);
      } catch (e) {
        chart = null;
      }
    }

    if (!chart) {
      chart = await ephemerisService.calculateBirthChart({
        dob: profile.dob,
        tob: profile.tob,
        lat: profile.latitude,
        lon: profile.longitude,
        tz: profile.timezone,
      });
    }

    return res.status(200).json({
      profile: {
        id: profile.id,
        name: profile.name,
        dob: profile.dob,
        tob: profile.tob,
        city: profile.city,
        lat: profile.latitude,
        lon: profile.longitude,
        tz: profile.timezone,
      },
      chart,
    });
  } catch (err) {
    console.error('Get Profile Error:', err);
    return res.status(500).json({ message: 'Failed to retrieve profile', error: err.message });
  }
});

// 3. Calculate full Vedic birth chart on demand
router.post('/calculate', async (req, res) => {
  try {
    const { dob, tob, lat, lon, tz, city } = req.body;

    if (!dob || !tob) {
      return res.status(400).json({ message: 'Date of birth and Time of birth are compulsory.' });
    }

    const coords = resolveCoordinates(city, lat, lon, tz);

    const chart = await ephemerisService.calculateBirthChart({
      dob: dob.trim(),
      tob: tob.trim(),
      lat: coords.lat,
      lon: coords.lon,
      tz: coords.tz,
    });

    return res.status(200).json(chart);
  } catch (err) {
    console.error('Calculate Chart Error:', err);
    return res.status(500).json({ message: 'Failed to calculate astronomical chart', error: err.message });
  }
});

// 4. Calculate Daily Gochar (Transit) vs Natal Chart
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
