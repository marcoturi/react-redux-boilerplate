export default {
  plugins: {
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: [
              'default',
              {
                calc: false,
              },
            ],
          },
        }
      : {}),
  },
};
