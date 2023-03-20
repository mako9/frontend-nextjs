const { i18n } = require('./next-i18next.config')

module.exports = {
  i18n,
  env: {
    BACKEND_BASE_URL: 'http://127.0.0.1:8080/api',
    LOG_LEVEL: 'info'
  },
}