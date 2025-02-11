import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortExercises',
  standalone: true,
})
export class SortExercisesPipe implements PipeTransform {
  transform(exercises: any[], type: string, muscleGroup: string): any[] {
    if (!exercises) return [];

    if (type && type !== 'all') {
      exercises = exercises.filter((exercise) => exercise.type === type);
    }

    if (muscleGroup && muscleGroup !== 'all') {
      exercises = exercises.filter((exercise) => exercise.muscle_group === muscleGroup);
    }

    return exercises;
  }
}