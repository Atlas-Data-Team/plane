#!/usr/bin/env bash
# Production deploy: scoped pull/recreate (web | api | full).
set -euo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose-prod.yaml}"
export IMAGE_TAG="${IMAGE_TAG:-latest}"
DEPLOY_SCOPE="${DEPLOY_SCOPE:-full}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:${LISTEN_HTTP_PORT:-80}}"
MAX_WAIT_SECONDS="${MAX_WAIT_SECONDS:-180}"
POLL_INTERVAL_SECONDS="${POLL_INTERVAL_SECONDS:-5}"
SKIP_GIT_PULL="${SKIP_GIT_PULL:-0}"

log() {
  echo "[deploy] scope=${DEPLOY_SCOPE} tag=${IMAGE_TAG} — $*"
}

safe_git_pull() {
  if [ ! -d .git ]; then
    return 0
  fi
  if [ -f deploy/prod-deploy.sh ] && ! git ls-files --error-unmatch deploy/prod-deploy.sh >/dev/null 2>&1; then
    log "Removing untracked deploy/prod-deploy.sh before git pull"
    rm -f deploy/prod-deploy.sh
  fi
  git pull --ff-only
}

wait_for_http() {
  local url="$1"
  local name="$2"
  local elapsed=0

  log "Waiting for ${name} (${url}) — max ${MAX_WAIT_SECONDS}s"
  while [ "${elapsed}" -lt "${MAX_WAIT_SECONDS}" ]; do
    if curl -fsSL -o /dev/null --max-time 10 "${url}"; then
      log "${name} is healthy (${elapsed}s)"
      return 0
    fi
    sleep "${POLL_INTERVAL_SECONDS}"
    elapsed=$((elapsed + POLL_INTERVAL_SECONDS))
  done

  log "ERROR: ${name} not healthy after ${MAX_WAIT_SECONDS}s"
  return 1
}

ensure_infra() {
  docker compose -f "${COMPOSE_FILE}" up -d --no-recreate plane-db plane-redis plane-mq plane-minio
  docker compose -f "${COMPOSE_FILE}" up -d --wait --no-recreate plane-db plane-redis plane-mq 2>/dev/null || true
}

deploy_web_only() {
  log "Pulling web image only"
  docker compose -f "${COMPOSE_FILE}" pull web

  ensure_infra

  log "Recreating web only (skip migrator — no API/DB schema change expected)"
  docker compose -f "${COMPOSE_FILE}" up -d --no-recreate api worker beat-worker space admin live caddy
  docker compose -f "${COMPOSE_FILE}" up -d --force-recreate web
  docker compose -f "${COMPOSE_FILE}" up -d --wait web 2>/dev/null || true

  wait_for_http "${HEALTH_URL}/" "Plane web (via caddy)"
}

deploy_api_only() {
  log "Pulling backend images"
  docker compose -f "${COMPOSE_FILE}" pull api worker beat-worker migrator

  ensure_infra

  log "Running database migrations"
  docker compose -f "${COMPOSE_FILE}" run --rm migrator

  log "Recreating API and workers only"
  docker compose -f "${COMPOSE_FILE}" up -d --no-recreate web space admin live caddy
  docker compose -f "${COMPOSE_FILE}" up -d --force-recreate api worker beat-worker
  docker compose -f "${COMPOSE_FILE}" up -d --wait api

  wait_for_http "${HEALTH_URL}/api/instances/" "Plane API (via caddy)" || \
    wait_for_http "${HEALTH_URL}/auth/" "Plane API auth (via caddy)"
  wait_for_http "${HEALTH_URL}/" "Plane web (via caddy)"
}

deploy_full() {
  log "Pulling all app images"
  docker compose -f "${COMPOSE_FILE}" pull web api worker beat-worker migrator

  ensure_infra

  log "Running database migrations"
  docker compose -f "${COMPOSE_FILE}" run --rm migrator

  log "Recreating backend then web"
  docker compose -f "${COMPOSE_FILE}" up -d --force-recreate api worker beat-worker
  docker compose -f "${COMPOSE_FILE}" up -d --wait api

  docker compose -f "${COMPOSE_FILE}" up -d --force-recreate web
  docker compose -f "${COMPOSE_FILE}" up -d --no-recreate space admin live caddy
  docker compose -f "${COMPOSE_FILE}" up -d --wait web caddy 2>/dev/null || true

  wait_for_http "${HEALTH_URL}/" "Plane web (via caddy)"
  wait_for_http "${HEALTH_URL}/api/instances/" "Plane API (via caddy)" || \
    wait_for_http "${HEALTH_URL}/auth/" "Plane API auth (via caddy)"
}

cd "${DEPLOY_PATH:-$HOME/plane}"

if [ "${SKIP_GIT_PULL}" != "1" ]; then
  safe_git_pull
fi

case "${DEPLOY_SCOPE}" in
  web)
    deploy_web_only
    ;;
  api)
    deploy_api_only
    ;;
  full)
    deploy_full
    ;;
  *)
    log "Unknown DEPLOY_SCOPE=${DEPLOY_SCOPE}, using full"
    deploy_full
    ;;
esac

log "Compose status"
docker compose -f "${COMPOSE_FILE}" ps

docker image prune -f
log "Deploy finished successfully"
