#!/bin/sh
# Generate assets/env.js from environment variables so OIDC/Keycloak and API URLs
# can be set at container runtime (e.g. https://finos.atparui.com, auth.atparui.com).
set -e
ENV_JS="${ENV_JS_PATH:-/usr/share/nginx/html/assets/env.js}"
mkdir -p "$(dirname "$ENV_JS")"

# Defaults for atparui: Keycloak at auth.atparui.com, realm nbk-demo, client finos-web
OIDC_ENABLED="${OIDC_SERVER_ENABLED:-true}"
OIDC_BASE="${OIDC_BASE_URL:-https://auth.atparui.com/realms/nbk-demo}"
OIDC_CLIENT="${OIDC_CLIENT_ID:-finos-web}"
OIDC_FRONT="${OIDC_FRONT_URL:-https://finos.atparui.com}"
API_URL="${FINERACT_API_URL:-https://console.atparui.com}"
API_PROVIDER="${FINERACT_API_PROVIDER:-/services/fineract-provider/api}"
API_VER="${FINERACT_API_VERSION:-/v1}"
TENANT="${FINERACT_PLATFORM_TENANT_IDENTIFIER:-default}"

cat > "$ENV_JS" << ENVJS
(function(window) {
  window["env"] = window["env"] || {};
  window["env"]["fineractApiUrls"] = "${API_URL}";
  window["env"]["fineractApiUrl"] = "${API_URL}";
  window["env"]["apiProvider"] = "${API_PROVIDER}";
  window["env"]["apiVersion"] = "${API_VER}";
  window["env"]["apiActuator"] = "${FINERACT_API_ACTUATOR:-/services/fineract-provider}";
  window["env"]["fineractPlatformTenantId"] = "${TENANT}";
  window["env"]["fineractPlatformTenantIds"] = "${TENANT}";
  window["env"]["oidcServerEnabled"] = ${OIDC_ENABLED};
  window["env"]["oidcBaseUrl"] = "${OIDC_BASE}";
  window["env"]["oidcClientId"] = "${OIDC_CLIENT}";
  window["env"]["oidcApiUrl"] = "";
  window["env"]["oidcFrontUrl"] = "${OIDC_FRONT}";
  window["env"]["allowServerSwitch"] = "true";
  window["env"]["displayBackEndInfo"] = "true";
  window["env"]["displayTenantSelector"] = "true";
})(this);
ENVJS

exec nginx -g 'daemon off;'
