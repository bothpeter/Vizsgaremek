<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use App\Models\Exercise;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

    class ExerciseTest extends BaseTestCase
    {
        
        use RefreshDatabase;

        public function setUp(): void
        {
            parent::setUp();
            $this->artisan('migrate');
        }
    
        public function test_view_exercises()
        {
            Exercise::factory()->create();
        
            $response = $this->getJson('/api/exercise');
        
            $response->assertStatus(200)
             ->assertJson([
             'status' => 200,
             'exercise' => true,
             ]);
        }

        public function test_view_exercises_by_exercise_id()
        {
            $exercise = Exercise::factory()->create();

            $response = $this->getJson('/api/exercise/' . $exercise->exercise_id);
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

        public function test_delete_exercise()
        {
            $user = User::factory()->create();
            $this->actingAs($user, 'sanctum');

            $exercise = Exercise::factory()->create(['user_id' => $user->id]);
            $response = $this->deleteJson('/api/exercise/' . $exercise->exercise_id);
            $response->assertStatus(200)
                 ->assertJson(['message' => 'Exercise deleted']);

            $otherUser = User::factory()->create();
            $exercise = Exercise::factory()->create(['user_id' => $otherUser->id]);
            $response = $this->deleteJson('/api/exercise/' . $exercise->exercise_id);
            $response->assertStatus(403)
                 ->assertJson(['message' => 'Unauthorized']);

            $response = $this->deleteJson('/api/exercise/999');
            $response->assertStatus(404)
                 ->assertJson(['message' => 'Exercise not found']);
        }

}
