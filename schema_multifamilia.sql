-- 1. Crear la tabla de familias
CREATE TABLE IF NOT EXISTS familias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    codigo_pin VARCHAR(10) NOT NULL UNIQUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Registrar vuestra casa (Familia 1) con el PIN 1234
INSERT INTO familias (id, nombre, codigo_pin) 
VALUES (1, 'Nuestra Casa', '1234')
ON DUPLICATE KEY UPDATE id=id;

-- 3. Añadir la columna familia_id a los productos actuales (asociándolos a vuestra casa)
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS familia_id INT DEFAULT 1;

-- 4. Eliminar la columna fecha_compra
ALTER TABLE productos 
DROP COLUMN IF EXISTS fecha_compra;
