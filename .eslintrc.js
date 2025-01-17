module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:vue/vue3-recommended',
    '@nuxt',
    'plugin:nuxt/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:eslint-plugin-nuxt/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint', 'prettier', 'nuxt'],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'comma-dangle': ['error', 'never'],
    semi: ['error', 'never'],
    'prettier/prettier': ['error'],
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off',
    'vue/no-v-html': 'off',
    'vue/valid-attribute-name': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-unused-vars': ['off'],
    treatUndefinedAsUnspecified: 'off',
    'class-methods-use-this': 'off',
    'global-require': 0,
    '@typescript-eslint/no-namespace': 'off',
    'no-return-await': 'off',
    'import/extensions': ['error', 'never']
  },
  settings: {
    'import/resolver': {
      nuxt: {
        extensions: ['.js', '.ts']
      },
      typescript: {
        alwaysTryTypes: true
      }
    }
  },
  ignorePatterns: ['dist', 'release']
}
