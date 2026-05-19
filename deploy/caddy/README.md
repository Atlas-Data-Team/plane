# Production Caddy reverse proxy

Replaces `plane-proxy` for `docker-compose-prod.yaml`. Routes match [apps/proxy/Caddyfile.ce](../../apps/proxy/Caddyfile.ce).

## VM rollout (after `git pull`)

1. **DNS:** `dig projects.metasolutions.software` should point at the VM public IP.
2. **`.env` on the server** (example):

   ```env
   APP_DOMAIN=projects.metasolutions.software
   WEB_URL=https://projects.metasolutions.software
   CORS_ALLOWED_ORIGINS=https://projects.metasolutions.software
   LIVE_SERVER_SECRET_KEY=<random-secret>
   AMQP_URL=amqp://plane:plane@plane-mq:5672/plane
   ```

3. **Remove old proxy** (avoid port 80/443 conflict):

   ```bash
   cd ~/plane
   docker compose -f docker-compose-prod.yaml stop proxy
   docker compose -f docker-compose-prod.yaml rm -f proxy
   ```

4. **Deploy:**

   ```bash
   DEPLOY_SCOPE=full ./deploy/prod-deploy.sh
   ```

5. **Verify:**

   ```bash
   docker compose -f docker-compose-prod.yaml ps
   docker compose -f docker-compose-prod.yaml logs caddy --tail 50
   curl -fsSL https://projects.metasolutions.software/api/instances/
   ```

6. **Optional cleanup** of orphaned volumes: `proxy_config`, `proxy_data`.
