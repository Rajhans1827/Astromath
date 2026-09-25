import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PYTHON_SCRIPT_PATH = path.join(__dirname, 'python', 'astromath_engine.py');

/**
 * Execute astronomical calculations through Python ephem engine
 */
function runPythonEngine(payload) {
  return new Promise((resolve, reject) => {
    // Pass Python IO encoding flag so UTF-8 characters pass through cleanly on Windows
    const env = { ...process.env, PYTHONIOENCODING: 'utf-8' };
    const pyProcess = spawn('python', [PYTHON_SCRIPT_PATH], {
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdoutData = '';
    let stderrData = '';

    pyProcess.stdout.setEncoding('utf-8');
    pyProcess.stderr.setEncoding('utf-8');

    pyProcess.stdout.on('data', (chunk) => {
      stdoutData += chunk;
    });

    pyProcess.stderr.on('data', (chunk) => {
      stderrData += chunk;
    });

    pyProcess.on('error', (err) => {
      console.error('[PythonEngine] Failed to spawn python:', err);
      reject(new Error(`Failed to start Python engine: ${err.message}`));
    });

    pyProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`[PythonEngine] Python exited with code ${code}. Stderr: ${stderrData}`);
        return reject(new Error(`Python computation failed with code ${code}: ${stderrData || stdoutData}`));
      }

      try {
        const parsed = JSON.parse(stdoutData.trim());
        if (parsed.error) {
          return reject(new Error(`Python calculation error: ${parsed.error}`));
        }
        resolve(parsed);
      } catch (e) {
        console.error('[PythonEngine] JSON parse error:', e, 'Raw output:', stdoutData);
        reject(new Error(`Failed to parse Python engine output: ${e.message}`));
      }
    });

    // Write input JSON to stdin
    pyProcess.stdin.write(JSON.stringify(payload));
    pyProcess.stdin.end();
  });
}

export class PythonEphemerisService {
  async calculateBirthChart({ dob, tob, lat, lon, tz = 5.5 }) {
    const payload = {
      action: 'calculate',
      dob,
      tob,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      tz: parseFloat(tz),
    };
    return await runPythonEngine(payload);
  }

  async calculateDailyGochar(natalData, targetDate = null) {
    const payload = {
      action: 'daily',
      natalData,
      targetDate,
    };
    return await runPythonEngine(payload);
  }

  async calculateNumerology({ name, dob }) {
    const payload = {
      action: 'numerology',
      name: name || '',
      dob,
    };
    return await runPythonEngine(payload);
  }

  async calculateCoupleNumerology({ partner1, partner2 }) {
    const payload = {
      action: 'couple_numerology',
      partner1,
      partner2,
    };
    return await runPythonEngine(payload);
  }

  async calculateKundaliMatch({ boy, girl }) {
    const payload = {
      action: 'kundali_match',
      boy,
      girl,
    };
    return await runPythonEngine(payload);
  }
}

export const pythonEphemerisService = new PythonEphemerisService();
