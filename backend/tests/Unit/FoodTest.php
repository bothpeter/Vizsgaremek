<?php

namespace Tests\Unit;

use App\Models\Food;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

class FoodTest extends BaseTestCase 
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }
        
    public function test_view_foods()
    {
        Food::factory()->create();

        $response=$this->getJson('/api/food');
        
        $response->assertStatus(200)
                 ->assertJson([
                 'status' => 200,
                 'food' => true,
                 ]);
        }

    public function test_view_foods_by_food_id()
    {
        $food = Food::factory()->create();

        $response = $this->getJson('/api/food/' . $food->food_id);
        $response->assertStatus(200)
                 ->assertJson([
                 'status' => 200,
                 'food' => true,
                 ]);

        $response = $this->getJson('/api/food/999');
        $response->assertStatus(404)
                 ->assertJson([
                 'message' => "Food not found",
                 ]);
    }
}
