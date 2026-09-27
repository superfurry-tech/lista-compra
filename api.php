<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$db   = 'lista_compra';
$user = 'fran';
$pass = 'hpunki';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Error de conexión: " . $e->getMessage()]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$input  = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        $familia_id = $_GET['familia_id'] ?? 1;
        $stmt = $pdo->prepare("SELECT * FROM productos WHERE familia_id = :familia_id ORDER BY id DESC");
        $stmt->execute([':familia_id' => $familia_id]);
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $accion = $input['accion'] ?? '';

        if ($accion === 'validar_pin' && !empty($input['pin'])) {
            $stmt = $pdo->prepare("SELECT id, nombre FROM familias WHERE codigo_pin = :pin");
            $stmt->execute([':pin' => $input['pin']]);
            $familia = $stmt->fetch();

            if ($familia) {
                echo json_encode([
                    "status" => "ok",
                    "familia_id" => $familia['id'],
                    "nombre_familia" => $familia['nombre']
                ]);
            } else {
                echo json_encode(["status" => "error", "mensaje" => "PIN incorrecto"]);
            }

        } elseif ($accion === 'crear_familia') {
            $nombre = $input['nombre'] ?? '';
            $pin    = $input['pin'] ?? '';

            if (empty($nombre) || empty($pin)) {
                echo json_encode(["status" => "error", "mensaje" => "Rellena todos los campos"]);
            } else {
                // 1. Comprobar si el PIN ya existe
                $stmtCheck = $pdo->prepare("SELECT id FROM familias WHERE codigo_pin = :pin");
                $stmtCheck->execute([':pin' => $pin]);

                if ($stmtCheck->fetch()) {
                    echo json_encode(["status" => "error", "mensaje" => "Este PIN ya está registrado. Elige otro."]);
                } else {
                    // 2. Registrar la nueva familia
                    $stmtInsert = $pdo->prepare("INSERT INTO familias (nombre, codigo_pin) VALUES (:nombre, :pin)");
                    $stmtInsert->execute([':nombre' => $nombre, ':pin' => $pin]);
                    $nuevaId = $pdo->lastInsertId();

                    echo json_encode([
                        "status" => "ok",
                        "familia_id" => $nuevaId,
                        "nombre_familia" => $nombre
                    ]);
                }
            }

        } elseif ($accion === 'agregar' && !empty($input['nombre'])) {
            $familia_id = $input['familia_id'] ?? 1;
            $stmt = $pdo->prepare("INSERT INTO productos (nombre, familia_id) VALUES (:nombre, :familia_id)");
            $stmt->execute([
                ':nombre' => $input['nombre'],
                ':familia_id' => $familia_id
            ]);
            echo json_encode(["status" => "ok", "id" => $pdo->lastInsertId()]);

        } elseif ($accion === 'marcar' && isset($input['id'])) {
            $comprado     = !empty($input['comprado']) ? 1 : 0;
            $comprado_por = $comprado ? ($input['comprado_por'] ?? 'Alguien') : null;

            $sql = "UPDATE productos SET comprado = :comprado, comprado_por = :comprado_por WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':comprado'     => $comprado,
                ':comprado_por' => $comprado_por,
                ':id'           => $input['id']
            ]);
            echo json_encode(["status" => "ok"]);

        } elseif ($accion === 'eliminar' && isset($input['id'])) {
            $stmt = $pdo->prepare("DELETE FROM productos WHERE id = :id");
            $stmt->execute([':id' => $input['id']]);
            echo json_encode(["status" => "ok"]);

        } else {
            echo json_encode(["error" => "Acción no válida"]);
        }
        break;
}
