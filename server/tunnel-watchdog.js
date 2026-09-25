import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const URL_FILE = path.join(__dirname, '..', 'active-tunnel.txt');

let activeUrl = '';
let keepAliveTimer = null;

function startTunnel() {
  console.log('[Tunnel Watchdog] Connecting to localhost.run...');

  const ssh = spawn('ssh', [
    '-R', '80:127.0.0.1:8000',
    '-o', 'ServerAliveInterval=15',
    '-o', 'ServerAliveCountMax=4',
    '-o', 'StrictHostKeyChecking=no',
    'nokey@localhost.run'
  ], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  ssh.stdout.setEncoding('utf-8');
  ssh.stderr.setEncoding('utf-8');

  ssh.stdout.on('data', (data) => {
    // Search for https://*.lhr.life
    const match = data.match(/https:\/\/[a-z0-9]+\.lhr\.life/i);
    if (match) {
      activeUrl = match[0];
      console.log(`\n=============================================================`);
      console.log(`🌐 LIVE SECURE PUBLIC TUNNEL (AUTO-RECONNECTING):`);
      console.log(`👉 ${activeUrl}`);
      console.log(`=============================================================\n`);
      try {
        fs.writeFileSync(URL_FILE, activeUrl, 'utf-8');
      } catch (e) {}

      // Start keep-alive heartbeats to prevent inactivity timeout
      if (keepAliveTimer) clearInterval(keepAliveTimer);
      keepAliveTimer = setInterval(async () => {
        try {
          const res = await fetch(activeUrl, { headers: { 'User-Agent': 'TunnelKeepAlive/1.0' } });
          // console.log(`[KeepAlive] Pinged ${activeUrl} -> status ${res.status}`);
        } catch (e) {
          // Ignore transient network dips
        }
      }, 45000); // ping every 45s
    }
  });

  ssh.stderr.on('data', (data) => {
    // console.log('[Tunnel SSH]', data.trim());
  });

  ssh.on('close', (code) => {
    console.warn(`[Tunnel Watchdog] Tunnel process exited with code ${code}. Reconnecting in 3s...`);
    if (keepAliveTimer) clearInterval(keepAliveTimer);
    setTimeout(startTunnel, 3000);
  });

  ssh.on('error', (err) => {
    console.error('[Tunnel Watchdog] SSH Spawn Error:', err.message);
  });
}

startTunnel();
