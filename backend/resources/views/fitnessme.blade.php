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
        <a href="http://127.0.0.1:8000/api/exercise" class="highlighted-div">Url for exercise endpoint : http://127.0.0.1:8000/api/exercise</a>
        <hr>
        <a href="http://127.0.0.1:8000/api/food" class="highlighted-div">Url for food endpoint :<br> http://127.0.0.1:8000/api/food</a>
    </div>
</body>
</html>
