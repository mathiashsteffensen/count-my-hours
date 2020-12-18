module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#46AFB9',
        secondary: '#184C51',
        accent: '#F5E4C3',
        extra: '#532A31',
        opaque: 'rgba(216, 224, 232, 0.75)'
      },
      inset: {
          "1/4": "25%"
      },
      width: {
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
      }
    }
  },
  purge: [
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.jsx',
  ],
  variants: {
    // Some useful comment
  },
  plugins: [
    // Some useful comment
  ],
}
