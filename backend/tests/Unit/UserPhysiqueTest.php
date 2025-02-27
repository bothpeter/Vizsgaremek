<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\UserPhysique;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

class UserPhysiqueTest extends BaseTestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_view_user_physique()
    {
        $user = User::factory()->create();
        $token = $user->createToken('TestToken')->plainTextToken;

        $physique = UserPhysique::factory()->create(['user_id' => $user->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/user_physique');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'UserPhysique' => [$physique->toArray()],
            ]);
    }

    public function test_post_user_physique()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $data = [
            'progress_picture' => new \Illuminate\Http\UploadedFile(
                base_path('public/images/logo.png'),
                'logo.png',
                'image/png',
                null,
                true,
            ),
            'height' => 1,
            'weight' => 1,
            'age' => 1,
            'gender' => 'male',
            'daily_calorie_intake' => 1,
            'activity_level' => 'low',
            'goal' => 'lose weight'
        ];

        $response = $this->postJson('/api/user_physique', $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'message' => 'Data uploaded',
                'data' => [
                    'height' => 1,
                    'weight' => 1,
                    'age' => 1,
                    'gender' => 'male',
                    'daily_calorie_intake' => 1,
                    'activity_level' => 'low',
                    'goal' => 'lose weight'
                ]
            ]);
    }

    public function test_update_user_physique()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $physique = UserPhysique::factory()->create(['user_id' => $user->id]);

        $data = [
            'progress_picture' => new \Illuminate\Http\UploadedFile(
                base_path('public/images/logo.png'),
                'logo.png',
                'image/png',
                null,
                true,
            ),
            'height' => 2,
            'weight' => 2,
            'age' => 2,
            'gender' => 'male',
            'daily_calorie_intake' => 2,
            'activity_level' => 'medium',
            'goal' => 'gain weight'
        ];

        $response = $this->putJson('/api/user_physique', $data);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'message' => 'Data updated',
                'data' => [
                    'height' => 2,
                    'weight' => 2,
                    'age' => 2,
                    'gender' => 'male',
                    'daily_calorie_intake' => 2,
                    'activity_level' => 'medium',
                    'goal' => 'gain weight'
                ]
            ]);
    }
}
