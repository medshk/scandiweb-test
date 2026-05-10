<?php

require_once __DIR__ . '/../vendor/autoload.php';

define('BASE_PATH', dirname(__DIR__) . '/');

$dotenvPath = BASE_PATH . '.env';
if (file_exists($dotenvPath)) {
    Dotenv\Dotenv::createImmutable(BASE_PATH)->load();
}

include_once BASE_PATH . 'src/helpers.php';

$allowedOrigins = [
    'https://your-frontend-url.web.app',
    'https://your-frontend-url.firebaseapp.com',
    'http://localhost:5173',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 200 OK');
    exit;
}

$dispatcher = FastRoute\simpleDispatcher(function (FastRoute\RouteCollector $r) {
    $r->get('/health', function () {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'healthy']);
        exit;
    });

    $r->post('/graphql', [App\GraphQL\Controller::class, 'handle']);
});

$requestUri = $_SERVER['REQUEST_URI'];
if (false !== $pos = strpos($requestUri, '?')) {
    $requestUri = substr($requestUri, 0, $pos);
}
$requestUri = rawurldecode($requestUri);

$routeInfo = $dispatcher->dispatch(
    $_SERVER['REQUEST_METHOD'],
    $requestUri
);

switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Not Found']);
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        http_response_code(405);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        echo $handler($vars);
        break;
}