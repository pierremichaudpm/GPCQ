function randomThink(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  setup: async (context, events) => {
    context.vars.thinkShort = randomThink(2, 6);
    context.vars.thinkLong = randomThink(8, 15);
    return context;
  },

  pickPath: (context, events, done) => {
    const paths = [
      '/',
      '/index.html',
      '/css/style.css',
      '/css/overrides.css',
      '/js/app.js',
      '/sw.js',
      '/health',
      '/worker'
    ];
    context.vars.path = paths[Math.floor(Math.random() * paths.length)];
    return done();
  }
};


