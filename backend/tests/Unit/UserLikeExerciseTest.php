<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\UserLikeExercise;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

class UserLikeExerciseTest extends BaseTestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_view_user_like_exercise()
    {
        $user = User::factory()->create();
        $token = $user->createToken('TestToken')->plainTextToken;

        $exercise = UserLikeExercise::factory()->create(['user_id' => $user->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/user_like_exercise');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'userLikeExercise' => [$exercise->toArray()],
            ]);
    }

    public function test_post_user_like_exercise()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $data= [
            'exercise_id' => 1,
        ];

        $response = $this->postJson('/api/user_like_exercise', $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'message' => 'Data uploaded',
                'data' => true
            ]);
        $this->assertDatabaseHas('user_like_exercises', $data);
    }

    public function test_delete_user_like_exercise()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $exercise = UserLikeExercise::factory()->create(['user_id' => $user->id, 'exercise_id' => 1]);

        $response = $this->deleteJson('/api/user_like_exercise/' . $exercise->exercise_id);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Exercise deleted',
            ]);

        $this->assertDatabaseMissing('user_like_exercises', ['exercise_id' => $exercise->exercise_id, 'user_id' => $user->id]);

        $response = $this->deleteJson('/api/user_like_exercise/' . $exercise->exercise_id);
        $response->assertStatus(404)
            ->assertJson([
                'message' => 'Exercise not found',
            ]);
    }
}