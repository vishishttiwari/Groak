module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "indent": ["error", 4, { "SwitchCase": 1 }],
    "react/jsx-indent": ["error", 4],
    "react/jsx-indent-props": ["error", 4],
    "react/jsx-filename-extension": "off",
    "react/prefer-stateless-function": "off",
    "react/prefer-default-export": "off",
    "import/prefer-default-export": "off",
    "arrow-body-style": ["error", "always"],
    "object-curly-newline": "off",
    "react/self-closing-comp": "off",
    "react/forbid-prop-types":"off",
    "react/jsx-props-no-spreading": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/control-has-associated-label": "off",
    "jsx-a11y/label-has-for":"off",
    "max-len":"off"
  },
};
