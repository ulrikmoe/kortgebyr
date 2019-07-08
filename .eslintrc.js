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
        "accessor-pairs": 2,
        "array-bracket-spacing": 2,
        "array-callback-return": 2,
        "arrow-body-style": 1,
        "arrow-parens": [
            1,
            "as-needed",
            { "requireForBlockBody": true }
        ],
        "arrow-spacing": [
            1,
            {
                "after": true,
                "before": true
            }
        ],
        "block-scoped-var": 2,
        "block-spacing": 2,
        "brace-style": [
            2,
            "1tbs",
            {
                "allowSingleLine": true
            }
        ],
        "comma-dangle": 1,
        "comma-spacing": [
            2,
            {
                "after": true,
                "before": false
            }
        ],
        "comma-style": [
            2,
            "last"
        ],
        "complexity": 0,
        "computed-property-spacing": [
            2,
            "never"
        ],
        "consistent-return": 0,
        "curly": 2,
        "dot-location": [
            2,
            "property"
        ],
        "dot-notation": 2,
        "eol-last": 2,
        "eqeqeq": 1,
        "for-direction": 2,
        "func-call-spacing": 2,
        "func-style": [
            2,
            "declaration"
        ],
        "function-paren-newline": 1,
        "generator-star-spacing": 2,
        "getter-return": 2,
        "handle-callback-err": 2,
        "id-blacklist": 2,
        "id-length": 0,
        "id-match": 2,
        "indent": [1, 4, { "SwitchCase": 1 }],
        "init-declarations": 0,
        "jsx-quotes": 2,
        "key-spacing": 2,
        "keyword-spacing": [
            2,
            {
                "after": true,
                "before": true
            }
        ],
        "line-comment-position": 0,
        "linebreak-style": [
            2,
            "unix"
        ],
        "lines-around-directive": 2,
        "max-depth": 2,
        "max-len": [1, 120],
        "max-nested-callbacks": 2,
        "max-params": 2,
        "max-statements": 0,
        "max-statements-per-line": 0,
        "new-cap": 2,
        "new-parens": 2,
        "newline-after-var": 0,
        "newline-before-return": 0,
        "newline-per-chained-call": 0,
        "no-array-constructor": 2,
        "no-buffer-constructor": 2,
        "no-caller": 2,
        "no-catch-shadow": 2,
        "no-cond-assign": 0,
        "no-confusing-arrow": 2,
        "no-constant-condition": 0,
        "no-console": 0,
        "no-div-regex": 2,
        "no-duplicate-imports": 2,
        "no-else-return": 2,
        "no-empty": 1,
        "no-empty-function": 1,
        "no-eq-null": 2,
        "no-eval": 2,
        "no-extend-native": 2,
        "no-extra-bind": 2,
        "no-extra-label": 2,
        "no-floating-decimal": 2,
        "no-implicit-globals": 0,
        "no-implied-eval": 2,
        "no-inline-comments": 0,
        "no-invalid-this": 2,
        "no-iterator": 2,
        "no-label-var": 2,
        "no-labels": 0,
        "no-lone-blocks": 2,
        "no-lonely-if": 2,
        "no-loop-func": 2,
        "no-magic-numbers": 0,
        "no-mixed-operators": 2,
        "no-mixed-requires": 2,
        "no-multi-spaces": [1, { ignoreEOLComments: true }],
        "no-multi-str": 2,
        "no-native-reassign": 2,
        "no-negated-condition": 1,
        "no-negated-in-lhs": 2,
        "no-new": 2,
        "no-new-func": 2,
        "no-new-object": 2,
        "no-new-require": 2,
        "no-new-wrappers": 2,
        "no-octal-escape": 2,
        "no-param-reassign": 2,
        "no-path-concat": 2,
        "no-process-env": 2,
        "no-process-exit": 2,
        "no-proto": 2,
        "no-redeclare": [
            2,
            {
                "builtinGlobals": false
            }
        ],
        "no-restricted-globals": 2,
        "no-restricted-imports": 2,
        "no-restricted-modules": 2,
        "no-restricted-properties": 2,
        "no-restricted-syntax": 2,
        "no-return-assign": 0,
        "no-return-await": 2,
        "no-script-url": 2,
        "no-self-compare": 2,
        "no-sequences": 2,
        "no-shadow": 0,
        "no-shadow-restricted-names": 2,
        "no-spaced-func": 2,
        "no-tabs": 2,
        "no-template-curly-in-string": 2,
        "no-throw-literal": 0,
        "no-trailing-spaces": 2,
        "no-undef-init": 2,
        "no-unused-vars": 0,
        "no-undefined": 2,
        "no-unmodified-loop-condition": 2,
        "no-unneeded-ternary": 2,
        "no-unused-expressions": 2,
        "no-use-before-define": [2, "nofunc"],
        "no-useless-call": 2,
        "no-useless-computed-key": 2,
        "no-useless-concat": 2,
        "no-useless-constructor": 2,
        "no-useless-rename": 2,
        "no-useless-return": 2,
        "no-var": 2,
        "no-void": 2,
        "no-warning-comments": 0,
        "no-whitespace-before-property": 2,
        "no-with": 2,
        "nonblock-statement-body-position": 2,
        "object-curly-newline": 0,
        "object-curly-spacing": [
            2,
            "always"
        ],
        "object-property-newline": [
            2,
            {
                "allowMultiplePropertiesPerLine": true
            }
        ],
        "object-shorthand": 0,
        "one-var": 0,
        "one-var-declaration-per-line": 2,
        "operator-assignment": [
            2,
            "always"
        ],
        "operator-linebreak": 2,
        "padded-blocks": 0,
        "padding-line-between-statements": 2,
        "prefer-arrow-callback": 2,
        "prefer-const": 1,
        "prefer-numeric-literals": 2,
        "prefer-promise-reject-errors": 0,
        "prefer-rest-params": 1,
        "prefer-spread": 2,
        "prefer-template": 0,
        "quote-props": 0,
        "quotes": [
            2,
            "single",
            { "avoidEscape": true }
        ],
        "radix": 2,
        "require-await": 2,
        "require-jsdoc": 0,
        "rest-spread-spacing": 2,
        "semi": 2,
        "semi-spacing": 2,
        "semi-style": [
            2,
            "last"
        ],
        "sort-imports": 2,
        "sort-keys": 0,
        "sort-vars": 2,
        "space-before-blocks": 2,
        "space-before-function-paren": 0,
        "space-in-parens": [
            2,
            "never"
        ],
        "space-infix-ops": 0,
        "space-unary-ops": 2,
        "spaced-comment": [
            1,
            "always"
        ],
        "switch-colon-spacing": 2,
        "symbol-description": 2,
        "template-tag-spacing": 2,
        "unicode-bom": [
            2,
            "never"
        ],
        "vars-on-top": 2,
        "wrap-iife": 2,
        "wrap-regex": 2,
        "yield-star-spacing": 2,
        "yoda": [
            2,
            "never"
        ]
    }
};
