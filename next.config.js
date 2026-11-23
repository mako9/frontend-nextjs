const { i18n } = require('./next-i18next.config')

// BACKEND_BASE_URL has no value in this file: the deployment, not the repository, decides where the API
// is. It is still passed through `env` because the browser bundle needs the value inlined - the web app
// calls the API directly from the client (item create/edit, booking, join/leave), and Next only inlines
// what is declared here. Dropping the key leaves `undefined/user/item/...` in the browser bundle, which
// was measured, not assumed. Serving those calls through Next instead is a separate decision (the spec's
// open question about web topology); until then the build environment is the only source, and changing
// the address means rebuilding.
// .env.development carries the local default, .env.local overrides both and is not committed.
module.exports = {
  i18n,
  env: {
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
    LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  },
}
