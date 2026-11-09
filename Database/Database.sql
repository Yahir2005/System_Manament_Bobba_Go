CREATE DATABASE IF NOT EXISTS boba_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE boba_shop;

-- ==========================================
-- 1. ACCESS CONTROL & INTERNAL USERS
-- ==========================================
CREATE TABLE roles (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE -- 'administrator', 'employee'
) ENGINE=InnoDB;

INSERT INTO roles (name) VALUES ('administrator'), ('employee'),('client');

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    id_role INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_roles FOREIGN KEY (id_role) REFERENCES roles(id_role)
) ENGINE=InnoDB;

-- ==========================================
-- 2. PRODUCT CATALOG & HIERARCHY
-- ==========================================
CREATE TABLE product_types (
    id_type INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE -- 'Beverage', 'Food'
) ENGINE=InnoDB;

INSERT INTO product_types (name) VALUES ('Beverage'), ('Food');

CREATE TABLE categories (
    id_category INT AUTO_INCREMENT PRIMARY KEY,
    id_type INT NOT NULL,
    name VARCHAR(80) NOT NULL UNIQUE, -- 'Boba', 'Italian Sodas', 'Cakes', etc.
    CONSTRAINT fk_categories_types FOREIGN KEY (id_type) REFERENCES product_types(id_type)
) ENGINE=InnoDB;

CREATE TABLE products (
    id_product INT AUTO_INCREMENT PRIMARY KEY,
    id_category INT NOT NULL,
    name VARCHAR(120) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255) NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_by INT NOT NULL,       -- Employee who submitted the product
    approved_by INT NULL,          -- Administrator who reviewed the product
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_categories FOREIGN KEY (id_category) REFERENCES categories(id_category),
    CONSTRAINT fk_products_creator FOREIGN KEY (created_by) REFERENCES users(id_user),
    CONSTRAINT fk_products_approver FOREIGN KEY (approved_by) REFERENCES users(id_user)
) ENGINE=InnoDB;

-- ==========================================
-- 3. LOYALTY PROGRAM (CUSTOMERS & QR)
-- ==========================================
CREATE TABLE customers (
    id_customer INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    qr_code VARCHAR(64) NOT NULL UNIQUE, -- Unique token/UUID for the QR
    stamps_count INT DEFAULT 0,          -- Current cycle count (0 to 10)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Stamp log / check-ins (used to enforce the 12-hour anti-abuse rule)
CREATE TABLE loyalty_visits (
    id_visit BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_customer INT NOT NULL,
    registered_by INT NOT NULL,          -- Employee who scanned the QR
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_visits_customers FOREIGN KEY (id_customer) REFERENCES customers(id_customer),
    CONSTRAINT fk_visits_employee FOREIGN KEY (registered_by) REFERENCES users(id_user),
    INDEX idx_customer_visited_at (id_customer, visited_at)
) ENGINE=InnoDB;

-- Claimed rewards history (11th product free)
CREATE TABLE redeemed_rewards (
    id_redemption INT AUTO_INCREMENT PRIMARY KEY,
    id_customer INT NOT NULL,
    id_product INT NOT NULL,             -- Free product claimed (boba, cake, coffee)
    authorized_by INT NOT NULL,          -- Employee who fulfilled the redemption
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_redemption_customer FOREIGN KEY (id_customer) REFERENCES customers(id_customer),
    CONSTRAINT fk_redemption_product FOREIGN KEY (id_product) REFERENCES products(id_product),
    CONSTRAINT fk_redemption_employee FOREIGN KEY (authorized_by) REFERENCES users(id_user)
) ENGINE=InnoDB;