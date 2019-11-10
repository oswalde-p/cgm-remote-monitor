module.exports = {
    "plugins": [ ],
    "extends": [
      "eslint:recommended"
    ],
    "parser": "babel-eslint",
    "env": {
      "browser": true,
      "commonjs": true,
      "es6": true,
      "node": true,
      "jquery": true
    },
    "rules": {
      "comma-spacing": ["error", { "before": false, "after": true }],
      "comma-style": ["error", "first"],
      "indent": ["error", 2],
      "quotes": ["error", "single"],
      "space-before-function-paren": ["error", "always"],
    }
  };
