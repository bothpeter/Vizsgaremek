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
}
