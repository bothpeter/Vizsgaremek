<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Http\Controllers\ExerciseController;
use Illuminate\Http\Request;
use App\Models\Exercise;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Mockery;

    class ExerciseControllerTest extends TestCase
    {
        protected function setUp(): void
        {
            parent::setUp();
            DB::shouldReceive('connection')->andReturn(Mockery::mock(\Illuminate\Database\Connection::class));
            DB::shouldReceive('table')->andReturnSelf();
            DB::shouldReceive('get')->andReturn(collect([]));
        }
    
        protected function tearDown(): void
        {
            Mockery::close();
            parent::tearDown();
        }

    public function test_view_exercises()
    {
        $exerciseMock = Mockery::mock('alias:App\Models\Exercise');
        $exerciseMock->shouldReceive('all')->andReturn(collect([]));

        $controller = new ExerciseController();
        $response = $controller->view_exercises();

        $this->assertEquals(200, $response->status());
        $this->assertArrayHasKey('exercise', $response->getData(true));
    }

    public function test_view_exercise_by_exercise_id()
    {
        $controller = new ExerciseController();
        $response = $controller->view_exercise_by_exercise_id(1);

        $this->assertEquals(200, $response->status());
        $this->assertArrayHasKey('exercise', $response->getData(true));
    }

    public function test_post_exercises()
    {
        $request = Request::create('/post_exercises', 'POST', [
            'exercise_name' => 'Push Up',
            'muscle_group' => 'Chest',
            'description' => 'A basic push up exercise',
            'type' => 'Strength'
        ]);

        $user = Auth::user();
        $controller = new ExerciseController();
        $response = $controller->post_exercises($request);

        $this->assertEquals(200, $response->status());
        $this->assertEquals('Exercise uploaded', $response->getData(true)['message']);
    }

    public function test_delete_exercise()
    {
        $request = Request::create('/delete_exercise/1', 'DELETE');
        $user = Auth::user();
        $controller = new ExerciseController();
        $response = $controller->delete_exercise($request, 1);

        $this->assertEquals(200, $response->status());
        $this->assertEquals('Exercise deleted', $response->getData(true)['message']);
    }
}
