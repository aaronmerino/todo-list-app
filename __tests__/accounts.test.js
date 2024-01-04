const { isValidUsername } = require('../src/app/api/accounts');

test('should be true', () => {
  const result = isValidUsername();
  expect(result).toBe(true);
});
