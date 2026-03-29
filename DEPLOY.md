# Deploying Maples Log on the Pi

## Current local deployment

- App path: `/home/wmckee/.openclaw/workspace/projects/maples-blog`
- Service: `maples-blog.service`
- Port: `3003`
- Local URL: `http://192.168.4.56:3003`

## How it works

- `npm run build` generates the static site into `dist/`
- `python3 -m http.server` serves `dist/`
- `systemd --user` keeps the service alive and rebuilds before start

## Install / refresh service

```bash
mkdir -p ~/.config/systemd/user
cp /home/wmckee/.openclaw/workspace/projects/maples-blog/maples-blog.service ~/.config/systemd/user/maples-blog.service
systemctl --user daemon-reload
systemctl --user enable --now maples-blog.service
```

## Logs and status

```bash
systemctl --user status maples-blog.service
journalctl --user -u maples-blog.service -f
```

## Redeploy after changes

```bash
cd /home/wmckee/.openclaw/workspace/projects/maples-blog
systemctl --user restart maples-blog.service
```

## Important note

The service currently builds with:

```bash
SITE_URL=http://192.168.4.56:3003
```

That is fine for local network use. Once you pick a real domain, update the `Environment=SITE_URL=...` line in the service file and restart the service.
