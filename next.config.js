const { i18n } = require('./next-i18next.config')

// BACKEND_BASE_URL has no value in this file: the deployment, not the repository, decides where the API
// is. It is still passed through `env` because the browser bundle needs the value inlined - the web app
// calls the API directly from the client (item create/edit, booking, join/leave), and Next only inlines
// what is declared here. Dropping the key leaves `undefined/user/item/...` in the browser bundle, which
// was measured, not assumed. Serving those calls through Next instead is a separate decision (the spec's
// open question about web topology); until then the build environment is the only source, and changing
// the address means rebuilding.
// `next dev` reads .env.development (committed, local stack) and .env.local (yours, not committed).
// `next build` reads neither of those - it loads .env and .env.production - so a build needs the value in
// its own environment. Hence the check below rather than a default: a build that emits the wrong address
// looks completely healthy until someone opens an item.
if (!process.env.BACKEND_BASE_URL && process.env.NODE_ENV !== 'test') {
  throw new Error(
    'BACKEND_BASE_URL is not set. The browser bundle would request "undefined/user/item/...".\n' +
    '  build:       BACKEND_BASE_URL=https://api.example.org/api pnpm build   (or set it in the build env)\n' +
    '  development: cp .env.development .env.local, or just run pnpm dev, which reads .env.development\n' +
    ' All the variables and what they are for: .env.example'
  )
}

module.exports = {
  i18n,
  env: {
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
    LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  },
}
