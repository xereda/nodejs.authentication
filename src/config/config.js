module.exports = {
  jwtSecret: 'K%&#addf342-__jJX',
  jwtSession: {
    session: false
  },
  expirate: 86400,
  corsOptions: {
    origin: '*',
    exposedHeaders: ['X-total-Count', 'Authorization'],
    methods: [ 'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE' ],
    preflightContinue: false
  }
}
