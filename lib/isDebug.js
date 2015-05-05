module.exports = function() {
  return process.argv[3] == 'dev' || process.argv[3] == 'debug';
};
