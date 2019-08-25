test('Should pass', () => {
  const given = {
    a: 1,
    b: 2,
  };

  const expected = 3;

  const actual = given.a + given.b;

  expect(actual).toEqual(expected);
});
