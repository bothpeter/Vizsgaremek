import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent implements OnInit {
  weight: string = '';
  height: string = '';
  age: string = '';
  gender: string = '';
  bmi: number | null = null;
  bmiCategory: string = '';

  calorieWeight: string = '';
  calorieHeight: string = '';
  calorieAge: string = '';
  calorieGender: string = '';
  activityLevel: string = '';
  goal: string = '';
  calorieResult: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserPhysique();
  }

  fetchUserPhysique(): void {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('Nincs érvényes hitelesítési token.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });

    this.http.get('http://127.0.0.1:8000/api/user_physique', { headers }).subscribe(
      (response: any) => {
        if (response.status === 200 && response.UserPhysique.length > 0) {
          const physique = response.UserPhysique[0];

          this.weight = physique.weight.toString();
          this.height = physique.height.toString();
          this.age = physique.age.toString();
          this.gender = physique.gender === 'ferfi' ? 'male' : 'female';

          this.calorieWeight = physique.weight.toString();
          this.calorieHeight = physique.height.toString();
          this.calorieAge = physique.age.toString();
          this.calorieGender = physique.gender === 'ferfi' ? 'male' : 'female';
        }
      },
      (error) => {
        console.error('Hiba történt az adatok lekérése során:', error);
      }
    );
  }

  onSubmitBMI() {
    if (this.weight && this.height) {
      const weightValue = parseFloat(this.weight);
      const heightValue = parseFloat(this.height) / 100;
      this.bmi = weightValue / (heightValue * heightValue);
      this.bmi = parseFloat(this.bmi.toFixed(1));
      this.bmiCategory = this.getBmiCategory(this.bmi);
    }
  }

  getBmiCategory(bmi: number): string {
    if (bmi < 18.5) {
      return 'Alultápláltság';
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return 'Normál testsúly';
    } else if (bmi >= 25 && bmi < 29.9) {
      return 'Túlsúly';
    } else {
      return 'Elhízás';
    }
  }

  onSubmitCalories() {
    if (this.calorieWeight && this.calorieHeight && this.calorieAge) {
      const weight = parseFloat(this.calorieWeight);
      const height = parseFloat(this.calorieHeight);
      const age = parseInt(this.calorieAge);
      const gender = this.calorieGender;
      const activityLevel = this.activityLevel;

      let bmr: number;

      if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }

      let activityMultiplier: number;
      switch (activityLevel) {
        case 'sedentary':
          activityMultiplier = 1.2;
          break;
        case 'light':
          activityMultiplier = 1.375;
          break;
        case 'moderate':
          activityMultiplier = 1.55;
          break;
        case 'active':
          activityMultiplier = 1.725;
          break;
        case 'veryActive':
          activityMultiplier = 1.9;
          break;
        default:
          activityMultiplier = 1.2;
      }

      let calories = bmr * activityMultiplier;

      if (this.goal === 'lose') {
        calories -= 500;
      } else if (this.goal === 'gain') {
        calories += 500;
      }

      this.calorieResult = Math.round(calories);
    }
  }
}