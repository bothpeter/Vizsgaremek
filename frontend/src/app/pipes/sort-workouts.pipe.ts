import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortWorkouts',
  standalone: true,
})
export class SortWorkoutsPipe implements PipeTransform {
  transform(workouts: any[], type: string): any[] {
    if (!workouts || !type || type === 'all') {
      return workouts;
    }
    return workouts.filter((workout) => workout.type === type);
  }
}