module.exports = {
  root: true,
  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'plugin:jsdoc/recommended',
    'plugin:jest/recommended',
    'plugin:react-hooks/recommended',
    'plugin:security/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'eslint-plugin-import',
    'eslint-plugin-jsdoc',
    'eslint-plugin-prefer-arrow',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'react-hooks',
    'security',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
  rules: {
    '@typescript-eslint/naming-convention': 'error',
    '@typescript-eslint/semi': ['error', 'always'],
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@mobile/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '~/**',
            group: 'parent',
          },
        ],
        groups: [['external', 'builtin'], 'internal', 'parent', 'sibling'],
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['internal'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
