<?php

namespace Tests\Unit;

use App\Models\WorkoutPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class WorkoutPlanTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_view_workout_plan()
    {
        WorkoutPlan::factory()->create();

        $response = $this->getJson('/api/workout_plan');
        $response->assertStatus(200);
    }

    public function test_post_workout_plan()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $data = [
            'title' => 'Beginner workout',
            'goodFor' => 'Beginners',
            'description' => 'A workout plan for beginners',
            'type' => 'Full body',
            'exercise1_id' => 1,
            'exercise2_id' => 2,
            'exercise3_id' => 3,
            'exercise4_id' => 4,
            'exercise5_id' => 5,
        ];

        $response = $this->postJson('/api/workout_plan', $data);
        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'message' => 'Data uploaded',
                'workout_plan' => true,
            ]);
    }

    public function test_delete_workout_plan()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $workout_plan = WorkoutPlan::factory()->create(['user_id' => $user->id]);
        $response = $this->deleteJson('/api/workout_plan/' . $workout_plan->id);
        $response->assertStatus(200)
            ->assertJson(['message' => 'workout deleted']);

        $otherUser = User::factory()->create();
        $workout_plan = WorkoutPlan::factory()->create(['user_id' => $otherUser->id]);
        $response = $this->deleteJson('/api/workout_plan/' . $workout_plan->id);
        $response->assertStatus(403)
            ->assertJson(['message' => 'Unauthorized']);

        $response = $this->deleteJson('/api/workout_plan/999');
        $response->assertStatus(404)
            ->assertJson(['message' => 'workout not found']);
    }
}
