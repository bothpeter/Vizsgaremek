import { sortFoodsPipe } from './sort-foods.pipe';

describe('sortFoodsPipe', () => {
  it('create an instance', () => {
    const pipe = new sortFoodsPipe();
    expect(pipe).toBeTruthy();
  });
});
