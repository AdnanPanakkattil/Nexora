<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>404 – Page Not Found | Nexora</title>
    <meta name="description" content="The page you are looking for could not be found." />

    <!-- Lottie Web Player -->
    <script src="https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js"></script>

    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #ffffff;
        }

        lottie-player {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
        }
    </style>
</head>
<body>

    <lottie-player
        src="{{ asset('assets/animations/404.json') }}"
        background="transparent"
        speed="1"
        loop
        autoplay>
    </lottie-player>

</body>
</html>
