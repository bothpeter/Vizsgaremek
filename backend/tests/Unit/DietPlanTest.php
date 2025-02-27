<?php

namespace Tests\Unit;

use App\Models\DietPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DietPlanTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_view_diet_plan()
    {
        DietPlan::factory()->create();

        $response = $this->getJson('/api/diet_plan');
        $response->assertStatus(200);
    }

    public function test_post_diet_plan()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $data = [
            'title' => 'Keto Diet',
            'description' => 'A diet plan that focuses on low carb and high fat',
            'foods' => 'Eggs, Avocado, Chicken',
            'kcal' => 2000,
            'food1_id' => 1,
            'food2_id' => 2,
            'food3_id' => 3
        ];

        $response = $this->postJson('/api/diet_plan', $data);
        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'message' => 'Data uploaded',
                'diet_plan' => true,
            ]);
    }

    public function test_delete_diet_plan()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $diet_plan = DietPlan::factory()->create(['user_id' => $user->id]);
        $response = $this->deleteJson('/api/diet_plan/' . $diet_plan->id);
        $response->assertStatus(200)
            ->assertJson(['message' => 'diet deleted']);

        $otherUser = User::factory()->create();
        $diet_plan = DietPlan::factory()->create(['user_id' => $otherUser->id]);
        $response = $this->deleteJson('/api/diet_plan/' . $diet_plan->id);
        $response->assertStatus(403)
            ->assertJson(['message' => 'Unauthorized']);

        $response = $this->deleteJson('/api/diet_plan/999');
        $response->assertStatus(404)
            ->assertJson(['message' => 'diet not found']);
    }
}
