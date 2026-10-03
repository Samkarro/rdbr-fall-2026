const config = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 16,
      propList: ["*"],
      unitPrecision: 5,
      minPixelValue: 2,
      selectorBlackList: [/^html$/],
    },
  },
};

export default config;
