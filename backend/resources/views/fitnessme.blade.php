<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laravel Blade Template</title>
    <style>
        body {
            background-color: black;
            color: #333;
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        .header img {
            text-align: center;
            height: 100px;
            border-radius: 8px;
            display: block;
            margin-left: auto;
            margin-right: auto;
            padding-top: 5px;
            box-shadow: 0 15px 30px rgba(241, 3, 3, 0.2), 0 6px 10px rgba(241, 3, 3, 0.2);
        }

        .content {
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            align-items: center;
            justify-content: center;
        }

        .highlighted-div {
            
            box-shadow: 0 10px 20px rgb(247, 242, 242), 0 4px 6px rgb(247, 242, 242);
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            padding: 30px;
            color: white; /* Laravel primary color */
            font-size: 20px;
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        }
        .text {
            color: white;
        }
        .highlighted-div:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(241, 3, 3, 0.2), 0 6px 10px rgba(241, 3, 3, 0.2);
        }

        @media (max-width: 768px) {
            .highlighted-div {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="{{ asset('images/logo.png') }}" alt="Logo" class="center">
    </div>
        
    <div class="content">
        <div class="highlighted-div">
        <h2>User (only post methods)</h2>
        <hr>
        <a href="http://127.0.0.1:8000/api/register" class="text">Url for register endpoint : http://127.0.0.1:8000/api/register</a>
        <hr>
        <a href="http://127.0.0.1:8000/api/login" class="text">Url for login endpoint : http://127.0.0.1:8000/api/login</a>
        <hr>
        <a href="http://127.0.0.1:8000/api/logout" class="text">Url for logout endpoint : http://127.0.0.1:8000/api/logout</a>
        <hr>
        <a href="http://127.0.0.1:8000/api/forgot_password" class="text">Url to report forgetted password endpoint : http://127.0.0.1:8000/api/forgot_password</a>
        <hr>
        <a href="http://127.0.0.1:8000/api/reset_password" class="text">Url to reset password endpoint : http://127.0.0.1:8000/api/reset_password</a>
        </div>
        <div class="highlighted-div">
        <h2>Exercise</h2>
        <hr>
        <a href="http://127.0.0.1:8000/api/exercise" class="text">Url for exercise endpoint : http://127.0.0.1:8000/api/exercise</a>
        <hr>
        <a href="http://127.0.0.1:8000/api/exercise/1" class="text">Url for exercise by exercise id endpoint : http://127.0.0.1:8000/api/exercise/id</a>
        </div>
        <hr>
        <div class="highlighted-div">
        <h2>Food</h2>
        <hr>
        <a href="http://127.0.0.1:8000/api/food" class="text">Url for food endpoint :<br> http://127.0.0.1:8000/api/food</a>
        <hr>
        <a href="http://127.0.0.1:8000/api/food/1" class="text">Url for food endpoint by id:<br> http://127.0.0.1:8000/api/food/1</a>
        </div>
        <hr>
        <div class="highlighted-div">
        <h2>Food ingredients</h2>
        <hr>
        <a href="http://127.0.0.1:8000/api/food_ingredients" class="text">Url for food ingredients endpoint :<br> http://127.0.0.1:8000/api/food_ingredients</a>
        <hr>
        <a href="http://127.0.0.1:8000/api/food_ingredients/1" class="text">Url for food ingredients by food id endpoint :<br> http://127.0.0.1:8000/api/food_ingredients/1</a>
        </div>
        <hr>
        <div class="highlighted-div">
        <h2>Workout Plan</h2>
        <hr>
        <a href="http://127.0.0.1:8000/api/workout_plan" class="text">Url for workouts endpoint :<br> http://127.0.0.1:8000/api/workout_plan</a>
        </div>
        <hr>
        <div class="highlighted-div">
        <h2>Diet Plan</h2>
        <hr>
        <a href="http://127.0.0.1:8000/api/diet_plan" class="text">Url for diets endpoint :<br> http://127.0.0.1:8000/api/diet_plan</a>
        </div>
        <hr>
        <div class="highlighted-div">
        <h2>User liked foods</h2>
        <hr>
        <a href="http://127.0.0.1:8000/api/user_like_food" class="text">Url for liked foods endpoint :<br> http://127.0.0.1:8000/api/user_like_food</a>
        <hr>
        <a href="http://127.0.0.1:8000/api/user_like_food/1" class="text">Url for liked foods by userid endpoint :<br> http://127.0.0.1:8000/api/user_like_food/1</a>
        </div>
        <hr>
        <div class="highlighted-div">
        <h2>User liked exercises</h2>
        <hr>
        <a href="http://127.0.0.1:8000/api/user_like_exercise" class="text">Url for liked exercises endpoint :<br> http://127.0.0.1:8000/api/user_like_exercise</a>
        <hr>
        <a href="http://127.0.0.1:8000/api/user_like_exercise/1" class="text">Url for liked exercises by userid endpoint :<br> http://127.0.0.1:8000/api/user_like_exercise/1</a>
        </div>
        <hr>
        <div class="highlighted-div">
        <h2>User physique</h2>
        <hr>
        <a href="http://127.0.0.1:8000/api/user_physique" class="text">Url for physiques endpoint :<br> http://127.0.0.1:8000/api/user_physique</a>
        <hr>
        <a href="http://127.0.0.1:8000/api/user_physique/1" class="text">Url for physiques by userid endpoint :<br> http://127.0.0.1:8000/api/user_physique/1</a>
        </div>
    </div>
</body>
</html>
