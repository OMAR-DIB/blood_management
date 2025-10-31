-- phpMyAdmin SQL Dump
-- version 5.2.1
-- UPDATED VERSION with new features
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blood_bank_management_system`
--

-- --------------------------------------------------------

--
-- Stand-in structure for view `active_donors_by_blood_group`
--
CREATE TABLE `active_donors_by_blood_group` (
`blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-')
,`donor_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `blood_inventory`
--

CREATE TABLE `blood_inventory` (
  `inventory_id` int(11) NOT NULL,
  `hospital_id` int(11) NOT NULL,
  `blood_bag_number` varchar(50) NOT NULL,
  `blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  `volume_ml` int(11) NOT NULL DEFAULT 450,
  `donation_date` date NOT NULL,
  `expiration_date` date NOT NULL,
  `donor_id` int(11) DEFAULT NULL,
  `status` enum('Available','Reserved','Used','Expired') DEFAULT 'Available',
  `storage_location` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blood_inventory`
--

INSERT INTO `blood_inventory` (`inventory_id`, `hospital_id`, `blood_bag_number`, `blood_group`, `volume_ml`, `donation_date`, `expiration_date`, `donor_id`, `status`, `storage_location`, `created_at`) VALUES
(1, 4, 'BB-2025-001-001', 'O+', 450, '2025-10-20', '2025-11-24', 1, 'Available', 'Refrigerator A-1', '2025-10-20 15:46:59'),
(2, 4, 'BB-2025-001-002', 'A+', 450, '2025-10-20', '2025-11-24', 2, 'Available', 'Refrigerator A-2', '2025-10-20 15:46:59'),
(3, 4, 'BB-2025-001-003', 'B+', 450, '2025-10-15', '2025-11-19', NULL, 'Available', 'Refrigerator A-3', '2025-10-20 15:46:59'),
(4, 4, 'BB-2025-001-004', 'AB+', 450, '2025-10-10', '2025-11-14', NULL, 'Available', 'Refrigerator B-1', '2025-10-20 15:46:59'),
(5, 4, 'BB-2025-001-005', 'O-', 450, '2025-10-18', '2025-11-22', NULL, 'Available', 'Refrigerator B-2', '2025-10-20 15:46:59'),
(6, 4, 'BB-2025-001-006', 'A+', 450, '2025-09-20', '2025-10-25', NULL, 'Available', 'Refrigerator A-4', '2025-10-20 15:46:59'),
(7, 4, 'BB-2025-001-007', 'O+', 450, '2025-09-18', '2025-10-23', NULL, 'Available', 'Refrigerator A-5', '2025-10-20 15:46:59'),
(8, 4, 'BB-2025-001-008', 'O+', 450, '2025-10-05', '2025-11-09', NULL, 'Used', 'Refrigerator A-1', '2025-10-20 15:46:59'),
(9, 4, 'BB-2025-001-009', 'A-', 450, '2025-09-30', '2025-11-04', NULL, 'Used', 'Refrigerator B-3', '2025-10-20 15:46:59');

-- --------------------------------------------------------

--
-- Table structure for table `blood_requests`
--

CREATE TABLE `blood_requests` (
  `request_id` int(11) NOT NULL,
  `hospital_id` int(11) NOT NULL,
  `patient_name` varchar(100) NOT NULL,
  `blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  `units_required` int(11) NOT NULL,
  `urgency` enum('Critical','Urgent','Normal') DEFAULT 'Normal',
  `hospital_name` varchar(200) NOT NULL,
  `hospital_address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) DEFAULT NULL,
  `contact_person` varchar(100) NOT NULL,
  `contact_phone` varchar(20) NOT NULL,
  `required_by` date NOT NULL,
  `status` enum('Open','Fulfilled','Closed') DEFAULT 'Open',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blood_requests`
--

INSERT INTO `blood_requests` (`request_id`, `hospital_id`, `patient_name`, `blood_group`, `units_required`, `urgency`, `hospital_name`, `hospital_address`, `city`, `state`, `contact_person`, `contact_phone`, `required_by`, `status`, `description`, `created_at`, `updated_at`) VALUES
(1, 4, 'Emergency Patient', 'O+', 2, 'Critical', 'City Hospital', '789 Hospital Road', 'Beirut', 'Beirut', 'Dr. Ahmed', '1234567890', '2025-10-13', 'Open', 'Urgent need for surgery patient', '2025-10-11 19:15:20', '2025-10-11 19:15:20');

-- --------------------------------------------------------

--
-- NEW TABLE: donation_responses
-- Tracks which donors responded to which requests
--

CREATE TABLE `donation_responses` (
  `response_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `donor_id` int(11) NOT NULL,
  `response_type` enum('Interested','Confirmed','Donated','Cancelled') DEFAULT 'Interested',
  `response_message` text DEFAULT NULL,
  `appointment_date` datetime DEFAULT NULL,
  `donation_completed` tinyint(1) DEFAULT 0,
  `donation_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donors`
-- UPDATED with availability schedule fields
--

CREATE TABLE `donors` (
  `donor_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `last_donation_date` date DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `medical_conditions` text DEFAULT NULL,
  `availability_days` varchar(100) DEFAULT NULL COMMENT 'Comma-separated days: Mon,Tue,Wed,Thu,Fri,Sat,Sun',
  `availability_time_start` time DEFAULT NULL COMMENT 'Start time for availability (e.g., 09:00)',
  `availability_time_end` time DEFAULT NULL COMMENT 'End time for availability (e.g., 17:00)',
  `preferred_contact_method` enum('Phone','Email','Both') DEFAULT 'Both',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donors`
--

INSERT INTO `donors` (`donor_id`, `user_id`, `blood_group`, `date_of_birth`, `gender`, `weight`, `city`, `state`, `address`, `last_donation_date`, `is_available`, `medical_conditions`, `availability_days`, `availability_time_start`, `availability_time_end`, `preferred_contact_method`, `created_at`, `updated_at`) VALUES
(1, 2, 'O+', '1995-05-15', 'Male', 75.50, 'Beirut', 'Beirut', '123 Main Street', NULL, 1, NULL, 'Mon,Tue,Wed,Thu,Fri', '09:00:00', '17:00:00', 'Both', '2025-10-11 19:15:20', '2025-10-11 19:15:20'),
(2, 3, 'A+', '1992-08-22', 'Female', 62.00, 'Tripoli', 'North Lebanon', '456 Oak Avenue', NULL, 1, NULL, 'Mon,Wed,Fri', '10:00:00', '16:00:00', 'Phone', '2025-10-11 19:15:20', '2025-10-11 19:15:20'),
(3, 5, 'A+', '2013-03-13', 'Male', 55.00, 'Tripoli', 'north', '', NULL, 1, NULL, NULL, NULL, NULL, 'Both', '2025-10-12 10:54:14', '2025-10-12 10:54:14'),
(4, 8, 'B-', '2005-10-10', 'Male', 75.00, 'Beirut', 'north', '', NULL, 1, '', NULL, NULL, NULL, 'Both', '2025-10-28 10:21:31', '2025-10-28 10:23:08');

-- --------------------------------------------------------

--
-- Stand-in structure for view `donors_by_city`
--
CREATE TABLE `donors_by_city` (
`city` varchar(100)
,`blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-')
,`donor_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `inventory_by_blood_group`
--
CREATE TABLE `inventory_by_blood_group` (
`hospital_id` int(11)
,`blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-')
,`total_units` bigint(21)
,`total_volume_ml` decimal(32,0)
,`earliest_expiration` date
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `inventory_expiring_soon`
--
CREATE TABLE `inventory_expiring_soon` (
`inventory_id` int(11)
,`hospital_id` int(11)
,`blood_bag_number` varchar(50)
,`blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-')
,`volume_ml` int(11)
,`donation_date` date
,`expiration_date` date
,`donor_id` int(11)
,`status` enum('Available','Reserved','Used','Expired')
,`storage_location` varchar(100)
,`created_at` timestamp
,`days_until_expiration` int(7)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `inventory_low_stock`
--
CREATE TABLE `inventory_low_stock` (
`hospital_id` int(11)
,`blood_group` enum('A+','A-','B+','B-','AB+','AB-','O+','O-')
,`units_available` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `open_requests_by_urgency`
--
CREATE TABLE `open_requests_by_urgency` (
`urgency` enum('Critical','Urgent','Normal')
,`request_count` bigint(21)
);

-- --------------------------------------------------------

--
-- NEW VIEW: request_response_summary
-- Shows how many responses each request has received
--

CREATE TABLE `request_response_summary` (
`request_id` int(11)
,`total_responses` bigint(21)
,`interested_count` bigint(21)
,`confirmed_count` bigint(21)
,`donated_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('admin','hospital','donor') DEFAULT 'donor',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password`, `phone`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'System Administrator', 'admin@bloodbank.com', '$2b$10$waiDzV4luVKJPVPug4LM2O41BBpmxDS0n0hoVNOkIl6MasbmV7crO', '1234567890', 'admin', 1, '2025-10-11 19:15:20', '2025-10-15 18:35:29'),
(2, 'John Doe', 'john@example.com', '$2b$10$xJ8Xz.rYKGZmW7qBYKpZZe5BqLKMJ.BM4tJn0vKXYx.QW8P7Zm0L6', '9876543210', 'donor', 1, '2025-10-11 19:15:20', '2025-10-11 19:15:20'),
(3, 'Sarah Smith', 'sarah@example.com', '$2b$10$xJ8Xz.rYKGZmW7qBYKpZZe5BqLKMJ.BM4tJn0vKXYx.QW8P7Zm0L6', '9876543211', 'donor', 1, '2025-10-11 19:15:20', '2025-10-11 19:15:20'),
(4, 'City Hospital', 'hospital@example.com', '$2b$10$xJ8Xz.rYKGZmW7qBYKpZZe5BqLKMJ.BM4tJn0vKXYx.QW8P7Zm0L6', '9876543212', 'hospital', 1, '2025-10-11 19:15:20', '2025-10-11 19:15:20'),
(5, 'samir', 'samir@gmail.com', '$2b$10$nB.Bdy2pKrmf6SRU3OA0IOdXA9nbQ95r9N4hXtXsLSBMXdC2u/1ee', '70583481', 'donor', 1, '2025-10-12 10:54:14', '2025-10-28 10:25:27'),
(6, 'che5', 'che5@gmail.com', '$2b$10$ad5GoirW/lqIvGc/MGnHrOuoZZvpBP7xEQO8PGy1PC8xPuNeXwNCi', '70583481', 'hospital', 1, '2025-10-15 18:39:25', '2025-10-28 10:25:35'),
(7, 'hospital', 'hospital@gmail.com', '$2b$10$wpg2xt/2WDvRiHUvaa91iOJR4U8rxAHtR1PpGgX1JkpfQT2.gEYpS', '70583481', 'hospital', 1, '2025-10-20 20:31:30', '2025-10-20 20:31:30'),
(8, 'adnan', 'adnan@gmail.com', '$2b$10$/U2Yob4b4BGr7IVCy3MKwuoUOLoBvrZk4RdDGqePexf3M6OB9gK2i', '70583481', 'donor', 1, '2025-10-28 10:21:31', '2025-10-28 10:21:31');

-- --------------------------------------------------------

--
-- Structure for view `active_donors_by_blood_group`
--
DROP TABLE IF EXISTS `active_donors_by_blood_group`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `active_donors_by_blood_group`  AS SELECT `donors`.`blood_group` AS `blood_group`, count(0) AS `donor_count` FROM `donors` WHERE `donors`.`is_available` = 1 GROUP BY `donors`.`blood_group` ;

-- --------------------------------------------------------

--
-- Structure for view `donors_by_city`
--
DROP TABLE IF EXISTS `donors_by_city`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `donors_by_city`  AS SELECT `donors`.`city` AS `city`, `donors`.`blood_group` AS `blood_group`, count(0) AS `donor_count` FROM `donors` WHERE `donors`.`is_available` = 1 GROUP BY `donors`.`city`, `donors`.`blood_group` ;

-- --------------------------------------------------------

--
-- Structure for view `inventory_by_blood_group`
--
DROP TABLE IF EXISTS `inventory_by_blood_group`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `inventory_by_blood_group`  AS SELECT `blood_inventory`.`hospital_id` AS `hospital_id`, `blood_inventory`.`blood_group` AS `blood_group`, count(0) AS `total_units`, sum(`blood_inventory`.`volume_ml`) AS `total_volume_ml`, min(`blood_inventory`.`expiration_date`) AS `earliest_expiration` FROM `blood_inventory` WHERE `blood_inventory`.`status` = 'Available' GROUP BY `blood_inventory`.`hospital_id`, `blood_inventory`.`blood_group` ;

-- --------------------------------------------------------

--
-- Structure for view `inventory_expiring_soon`
--
DROP TABLE IF EXISTS `inventory_expiring_soon`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `inventory_expiring_soon`  AS SELECT `i`.`inventory_id` AS `inventory_id`, `i`.`hospital_id` AS `hospital_id`, `i`.`blood_bag_number` AS `blood_bag_number`, `i`.`blood_group` AS `blood_group`, `i`.`volume_ml` AS `volume_ml`, `i`.`donation_date` AS `donation_date`, `i`.`expiration_date` AS `expiration_date`, `i`.`donor_id` AS `donor_id`, `i`.`status` AS `status`, `i`.`storage_location` AS `storage_location`, `i`.`created_at` AS `created_at`, to_days(`i`.`expiration_date`) - to_days(curdate()) AS `days_until_expiration` FROM `blood_inventory` AS `i` WHERE `i`.`status` = 'Available' AND `i`.`expiration_date` <= curdate() + interval 7 day AND `i`.`expiration_date` >= curdate() ORDER BY `i`.`expiration_date` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `inventory_low_stock`
--
DROP TABLE IF EXISTS `inventory_low_stock`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `inventory_low_stock`  AS SELECT `blood_inventory`.`hospital_id` AS `hospital_id`, `blood_inventory`.`blood_group` AS `blood_group`, count(0) AS `units_available` FROM `blood_inventory` WHERE `blood_inventory`.`status` = 'Available' GROUP BY `blood_inventory`.`hospital_id`, `blood_inventory`.`blood_group` HAVING count(0) < 3 ;

-- --------------------------------------------------------

--
-- Structure for view `open_requests_by_urgency`
--
DROP TABLE IF EXISTS `open_requests_by_urgency`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `open_requests_by_urgency`  AS SELECT `blood_requests`.`urgency` AS `urgency`, count(0) AS `request_count` FROM `blood_requests` WHERE `blood_requests`.`status` = 'Open' GROUP BY `blood_requests`.`urgency` ;

-- --------------------------------------------------------

--
-- NEW Structure for view `request_response_summary`
--
DROP TABLE IF EXISTS `request_response_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `request_response_summary`  AS
SELECT
  `dr`.`request_id` AS `request_id`,
  COUNT(*) AS `total_responses`,
  SUM(CASE WHEN `dr`.`response_type` = 'Interested' THEN 1 ELSE 0 END) AS `interested_count`,
  SUM(CASE WHEN `dr`.`response_type` = 'Confirmed' THEN 1 ELSE 0 END) AS `confirmed_count`,
  SUM(CASE WHEN `dr`.`response_type` = 'Donated' THEN 1 ELSE 0 END) AS `donated_count`
FROM `donation_responses` dr
GROUP BY `dr`.`request_id`;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blood_inventory`
--
ALTER TABLE `blood_inventory`
  ADD PRIMARY KEY (`inventory_id`),
  ADD UNIQUE KEY `blood_bag_number` (`blood_bag_number`),
  ADD KEY `donor_id` (`donor_id`),
  ADD KEY `idx_hospital_bloodgroup` (`hospital_id`,`blood_group`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_expiration` (`expiration_date`);

--
-- Indexes for table `blood_requests`
--
ALTER TABLE `blood_requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `hospital_id` (`hospital_id`),
  ADD KEY `idx_request_status` (`status`),
  ADD KEY `idx_request_blood_group` (`blood_group`);

--
-- NEW Indexes for table `donation_responses`
--
ALTER TABLE `donation_responses`
  ADD PRIMARY KEY (`response_id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `donor_id` (`donor_id`),
  ADD KEY `idx_response_type` (`response_type`),
  ADD KEY `idx_donation_completed` (`donation_completed`);

--
-- Indexes for table `donors`
--
ALTER TABLE `donors`
  ADD PRIMARY KEY (`donor_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_blood_group` (`blood_group`),
  ADD KEY `idx_city` (`city`),
  ADD KEY `idx_is_available` (`is_available`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_user_email` (`email`),
  ADD KEY `idx_user_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blood_inventory`
--
ALTER TABLE `blood_inventory`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `blood_requests`
--
ALTER TABLE `blood_requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- NEW AUTO_INCREMENT for table `donation_responses`
--
ALTER TABLE `donation_responses`
  MODIFY `response_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `donors`
--
ALTER TABLE `donors`
  MODIFY `donor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blood_inventory`
--
ALTER TABLE `blood_inventory`
  ADD CONSTRAINT `blood_inventory_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `blood_inventory_ibfk_2` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`donor_id`);

--
-- Constraints for table `blood_requests`
--
ALTER TABLE `blood_requests`
  ADD CONSTRAINT `blood_requests_ibfk_1` FOREIGN KEY (`hospital_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- NEW Constraints for table `donation_responses`
--
ALTER TABLE `donation_responses`
  ADD CONSTRAINT `donation_responses_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `blood_requests` (`request_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `donation_responses_ibfk_2` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`donor_id`) ON DELETE CASCADE;

--
-- Constraints for table `donors`
--
ALTER TABLE `donors`
  ADD CONSTRAINT `donors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
