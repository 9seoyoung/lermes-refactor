-- kdt_db.TB_CALENDAR_EVENTS definition

CREATE TABLE `TB_CALENDAR_EVENTS` (
  `evt_sn` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `pic_mbl_telno` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `calendar_id` varchar(36) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `evt_title` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `evt_cn` text COLLATE utf8mb4_general_ci,
  `evt_bgng_dt` datetime NOT NULL,
  `evt_end_dt` datetime NOT NULL,
  `all_day_yn` char(1) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `evt_category` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `evt_location` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `evt_atnd_lst` text COLLATE utf8mb4_general_ci,
  `evt_stcd` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `visible_yn` char(1) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `editable_yn` char(1) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deletable_yn` char(1) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `wrter_nm` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `wrt_dt` datetime DEFAULT NULL,
  `updr_nm` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `upd_dt` datetime DEFAULT NULL,
  `is_all_day` char(1) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bg_color` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `text_color` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_private` char(1) COLLATE utf8mb4_general_ci DEFAULT NULL,
  UNIQUE KEY `evt_sn` (`evt_sn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;