<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use App\Http\Controllers\ExerciseController;
use Illuminate\Http\Request;
use App\Models\Exercise;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Mockery;

    class ExerciseControllerTest extends BaseTestCase
    {
        
        use RefreshDatabase;

        public function setUp(): void
        {
            parent::setUp();
            $this->artisan('migrate');
        }
    
        public function test_view_exercises()
        {
            Exercise::factory()->count(5)->create();
        
            $response = $this->getJson('/api/exercise');
        
            $response->assertStatus(200)
                 ->assertJson([
                 'status' => 200,
                 'exercise' => true,
                 ])
                 ->assertJsonCount(5, 'exercise');
        }

        public function test_view_exercises_by_exercise_id()
        {
            Exercise::factory()->create();

            $response = $this->getJson('/api/exercise/' . 1);
            $response->assertStatus(200)
                 ->assertJson([
                 'status' => 200,
                 'exercise' => true,
                 ]);

            $response = $this->getJson('/api/exercise/999');
            $response->assertStatus(404)
                 ->assertJson([
                 'message' => "Exercise not found",
                 ]);
        }

        public function test_post_exercises()
        {
            $user = User::factory()->create();
            $this->actingAs($user, 'sanctum');

            $data = [
                'exercise_name' => 'Push Up',
                'muscle_group' => 'Chest',
                'description' => 'A basic push up exercise',
                'type' => 'Strength'
            ];

            $response = $this->postJson('/api/exercise', $data);

            $response->assertStatus(200)
                     ->assertJson([
                         'status' => 200,
                         'message' => 'Exercise uploaded',
                         'exercise' => true,
                     ]);

            $this->assertDatabaseHas('exercises', [
                'exercise_name' => 'Push Up',
                'muscle_group' => 'Chest',
                'description' => 'A basic push up exercise',
                'type' => 'Strength',
                'user_id' => $user->id
            ]);
        }

        public function test_delete_exercise_cases()
        {
            $user = User::factory(1)->create();
            $this->actingAs($user, 'sanctum');

            // Case 1: Successfully delete exercise
            $exercise = Exercise::factory()->create(['user_id' => $user->id]);
            $response = $this->deleteJson('/api/exercise/' . $exercise->id);
            $response->assertStatus(200)
             ->assertJson(['message' => 'Exercise deleted']);
            $this->assertDatabaseMissing('exercises', ['id' => $exercise->id]);

            // Case 2: Unauthorized delete attempt
            $otherUser = User::factory()->create();
            $exercise = Exercise::factory()->create(['user_id' => $otherUser->id]);
            $response = $this->deleteJson('/api/exercise/' . $exercise->id);
            $response->assertStatus(403)
             ->assertJson(['message' => 'Unauthorized']);
            $this->assertDatabaseHas('exercises', ['id' => $exercise->id]);

            // Case 3: Exercise not found
            $response = $this->deleteJson('/api/exercise/999');
            $response->assertStatus(404)
             ->assertJson(['message' => 'Exercise not found']);
        }

}
