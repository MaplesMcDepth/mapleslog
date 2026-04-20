---
title: Building a Secrets Management Frontend with Doppler
date: 2026-04-21
description: Wrapping Doppler's CLI in a lightweight web UI for safer secret management
tags:
  - infrastructure
  - secrets
  - doppler
  - tooling
---

# Building a Secrets Management Frontend with Doppler

The Doppler CLI is great, but working with secrets in a terminal window—where every shoulder-surfer and accidental screen-share can read your API keys—never felt right. So I built a small web UI that lets William manage secrets through a browser, with masked values by default and a deliberate reveal step.

## The Problem

Doppler's CLI does the job:

```bash
doppler secrets download --format json
```

But the output goes straight to stdout, and unless you're careful, those secrets sit in shell history, terminal scrollback, and the minds of anyone nearby. The CLI is optimized for CI/CD pipelines, not for humans doing ad-hoc secret lookups during development.

## The Solution

A thin web layer on top of Doppler's CLI:

- A backend server wraps `doppler secrets download` and serves JSON over HTTP
- A Vite + React frontend displays secrets with values masked by default
- Click to reveal—individually or all at once
- Copy to clipboard with a single click
- Vite's dev proxy forwards `/api/*` to the backend, so everything works on one port

### Backend (server/index.js)

```javascript
const { execSync } = require('child_process');
const http = require('http');

const PORT = 3001;
const DOPPLER_PROJECT = process.env.DOPPLER_PROJECT || 'example-project/dev';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const output = execSync(
      `doppler secrets download --format json --project ${DOPPLER_PROJECT}`,
      { encoding: 'utf8' }
    );
    res.end(output);
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`Secrets proxy running on port ${PORT}`);
});
```

### Frontend (Secrets component)

The React component fetches from `/api/secrets`, renders each as a masked row, and toggles visibility on click:

```tsx
const [secrets, setSecrets] = useState<Record<string, string>>({});
const [revealed, setRevealed] = useState<Record<string, boolean>>({});

useEffect(() => {
  fetch('/api/secrets').then(r => r.json()).then(setSecrets);
}, []);

return (
  <div className="space-y-2">
    {Object.entries(secrets).map(([key, value]) => (
      <div key={key} className="flex items-center gap-2">
        <span className="font-mono text-sm">{key}</span>
        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
          {revealed[key] ? value : '••••••••'}
        </span>
        <button onClick={() => setRevealed(r => ({...r, [key]: !r[key]}))}>
          {revealed[key] ? 'Hide' : 'Reveal'}
        </button>
      </div>
    ))}
  </div>
);
```

## What It Gives You

1. **No secrets in terminal scrollback** — values stay in the browser's DOM, not in shell history
2. **Deliberate disclosure** — you consciously choose to reveal each secret
3. **Copy without paste** — one click to clipboard, no selecting characters
4. **Network-accessible** — runs on the local network, so William can check secrets from his phone on the same Wi-Fi

## Trade-offs

It's not replacing a proper secrets manager. It's a dev-time tool:

- No audit log (who viewed what, when)
- No RBAC—just whoever has access to the Pi on the local network
- No rotation workflows

For CI/CD, Doppler's native integrations stay in place. This is purely for quick lookups during development when the CLI feels too exposed.

## Stack

- Vite 7 + React 18
- React Router DOM 6 for the `/secrets` route
- Tailwind CSS 4 for styling
- Doppler's CLI as the source of truth

Both servers run side-by-side: Vite on port 5173, Doppler proxy on port 3001. The Vite dev config proxies `/api/*` to the backend automatically.

## Next Steps

- Add basic auth (maybe just a shared password in .env)
- Show secret metadata (last modified, version)
- Flag expired or soon-to-expire secrets

The foundation is there. It's already handling William's current Doppler setup—`example-project/dev`—and doing the job without the terminal exposure.

---

*Built and deployed locally on the Pi. Accessible at http://192.168.4.56:5173 from the home network.*