import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        fetch: 'readonly',
        // Browser APIs for animations and images
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        Image: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React Rules
      'react/prop-types': 'warn',
      'react/jsx-key': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/no-unknown-property': 'error',
      'react/self-closing-comp': 'warn',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',

      // React Hooks Rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility Rules
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',

      // General Best Practices
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',
      'prefer-const': 'warn',
    },
  },
];
