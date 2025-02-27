<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase;
use Illuminate\Testing\Fluent\AssertableJson;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_update_user()
    {
        $user = User::factory()->create();
        $token = $user->createToken('TestToken')->plainTextToken;
        $otherToken = "asd";

        $data = [
            'name' => 'johni',
            'email' => 'johni@gmail.com',
            'password' => 'asd123',
            'password_confirmation' => 'asd123',
        ];
        
        $response = $this->putJson('/api/user', $data, ['Authorization' => 'Bearer ' . $otherToken]);
        $response->assertStatus(401);

        $response = $this->putJson('/api/user', $data, ['Authorization' => 'Bearer ' . $token]);
        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'message' => 'Data updated',
                'data' => [
                    'name' => 'johni',
                    'email' => 'johni@gmail.com',
                ]
            ]);
    }

    public function test_delete_user()
    {
        $user = User::factory()->create();
        $token = $user->createToken('TestToken')->plainTextToken;
        $otherToken = "asd";

        $response = $this->deleteJson('/api/user', [], ['Authorization' => 'Bearer ' . $token]);
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'User deleted'
            ]);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);

        $response = $this->deleteJson('/api/user', [], ['Authorization' => 'Bearer ' . $token]);
        $response->assertStatus(404)
            ->assertJson([
                'message' => 'User not found'
            ]);
    }
}