describe('Example test', () => {
  it('equals true', () => {
    expect(true).toEqual(true);
    expect('Ariel').toEqual('Ariel');
  });
});

function addNumbers(num1, num2): any {
  return num1 + num2;
}

describe('Add Numbers', () => {
  it('add 2 numbers', () => {
    expect(addNumbers(2, 2)).toEqual(4);
  });
});
