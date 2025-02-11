import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByType',
  standalone: true,
})
export class SortByTypePipe implements PipeTransform {
  transform(foods: any[], type: string): any[] {
    if (!foods || !type || type === 'all') {
      return foods;
    }
    return foods.filter((food) => food.type === type);
  }
}