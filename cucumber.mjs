export default {
  paths: ['features/**/*.feature'],
  requireModule: ['ts-node/register', 'tsconfig-paths/register'],
  require: ['features/step-definitions/**/*.ts'],
  format: ['@cucumber/pretty-formatter'],
  tags: '@session',
};
