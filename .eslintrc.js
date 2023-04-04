module.exports = {
    "parserOptions": {
        "ecmaVersion": 8
    },
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "quotes": ["warn", "single"],
        "semi": ["warn", "always"],
        "max-depth": ["warn", 6]
    }
};
