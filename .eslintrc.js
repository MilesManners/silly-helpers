module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true
  },
  'extends': ['standard', 'plugin:jest/style', 'plugin:jest/recommended'],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018
  },
  'plugins' : ['jest-formatting'],
  'rules': {
    'no-var': 'error',
    'spaced-comment': ['error', 'always', {
      'line': {
        'markers': ['*package', '!', '/', ',', '='],
        'exceptions': ['!', '?', 'todo', '*']
      },
      'block': {
        'balanced': true,
        'markers': ['*package', '!', ',', ':', '::', 'flow-include'],
        'exceptions': ['*']
      }
    }],

    // Jest
    'jest/consistent-test-it': ['error', { fn: 'test', withinDescribe: 'it' }],
    'jest/no-test-callback': 2,

    // Jest Formatting
    'jest-formatting/padding-before-test-blocks': 2,
    'jest-formatting/padding-before-describe-blocks': 2
  }
}
