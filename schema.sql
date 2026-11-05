CREATE DATABASE IF NOT EXISTS `kts_eoffice_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `kts_eoffice_db`;

CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `doc_no` VARCHAR(100) NOT NULL,
  `doc_date` VARCHAR(100) NOT NULL,
  `urgency` VARCHAR(50) DEFAULT 'ปกติ',
  `subject` TEXT NOT NULL,
  `from_agency` VARCHAR(255) NOT NULL,
  `to_agency` VARCHAR(255) NOT NULL,
  `to_person` VARCHAR(255) NULL,
  `created_by_agency` VARCHAR(255) NOT NULL,
  `sent_by` VARCHAR(255) NULL,
  `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('sent', 'received', 'closed') DEFAULT 'sent',
  `rec_no` VARCHAR(50) NULL,
  `received_at` VARCHAR(100) NULL,
  `received_by` VARCHAR(255) NULL,
  `closed_at` VARCHAR(100) NULL,
  `file_path` VARCHAR(255) NULL,
  `file_name` VARCHAR(255) NULL,
  `file_size` VARCHAR(50) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `agency` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;