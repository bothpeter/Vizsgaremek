<?php

namespace Tests\Unit;

use App\Models\PasswordReset;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_register()
    {
        $data = [
            'name' => 'user',
            'email' => 'tesuseremail@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password'
        ];

        $response = $this->postJson('/api/register', $data);
        $response->assertStatus(200)
            ->assertJson([
                'user' => true,
            ]);
    }

    public function test_login()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password')
        ]);

        $data = [
            'login' => $user->email,
            'password' => 'password'
        ];

        $response = $this->postJson('/api/login', $data);
        $response->assertStatus(200)
            ->assertJson([
                'token' => true,
            ]);

        $wrongData = [
            'login' => 'asd',
            'password' => 'wrongpassword'
        ];
        $response = $this->postJson('/api/login', $wrongData);
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Bad credentials',
            ]);
    }

    public function test_logout()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->postJson('/api/logout');
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Logged out',
            ]);
    }

    public function test_forgot()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $data = [
            'email' => $user->email
        ];

        $response = $this->postJson('/api/forgot_password', $data);
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Reset Password Token Sent to your Email Address',
            ]);

        $wrongData = [
            'email' => 'wrongemail@gmail.com'
        ];

        $response = $this->postJson('/api/forgot_password', $wrongData);
        $response->assertStatus(404)
            ->assertJson([
                'message' => 'No Record Found',
                'error' => 'Incorrect Email Address Provided',
            ]);
    }

    public function test_reset()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $user2 = User::factory()->create();
        $this->actingAs($user2, 'sanctum');

        PasswordReset::factory()->create([
            'email' => $user->email,
            'token' => 'valid_token',
            'expires_at' => now()->addHour(),
        ]);

        PasswordReset::factory()->create([
            'email' => $user2->email,
            'token' => 'expired_token',
            'expires_at' => now(),
        ]);

        $data = [
            'email' => $user->email,
            'token' => 'valid_token',
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword'
        ];

        $response = $this->postJson('/api/reset_password', $data);
        $response->assertStatus(200)
            ->assertJson([
                'user' => true,
            ]);

        $wrongTokenData = [
            'email' => $user->email,
            'token' => 'invalid_token',
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword'
        ];

        $response = $this->postJson('/api/reset_password', $wrongTokenData);
        $response->assertStatus(400)
            ->assertJson([
                'error' => 'An Error Occurred. Please Try again.',
                'message' => 'No reset request found.',
            ]);

        $expiredTokenData = [
            'email' => $user2->email,
            'token' => 'expired_token',
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword'
        ];

        $response = $this->postJson('/api/reset_password', $expiredTokenData);
        $response->assertStatus(400)
            ->assertJson([
                'error' => 'Token Expired',
                'message' => 'The reset token has expired.',
            ]);
    }
}