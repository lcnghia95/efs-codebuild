-- -----------------------------------------------------
-- SQL SCRIPT FOR VIET NAM PAGE
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Table surfaces.surface_product_details
-- -----------------------------------------------------
alter table `surfaces`.`surface_product_details` add column `product_name_vi` VARCHAR(255) NULL DEFAULT ''  COMMENT 'Product name for Viet Nam version' after `product_name_th`;
alter table `surfaces`.`surface_product_details` add column `product_outline_vi` TEXT NULL DEFAULT ''  COMMENT 'Product outline for Viet Nam version' after `product_outline_th`;

-- -----------------------------------------------------
-- Table `surfaces`.`systemtrade_ranking_best_sellers_vi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `surfaces`.`systemtrade_ranking_best_sellers_vi` (
  `id` int(11) NOT NULL COMMENT 'システムトレード売れ筋ランキングID',
  `is_valid` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'データ有効フラグ\n0:無効、1:有効',
  `platform_id` int(11) NOT NULL DEFAULT '0' COMMENT 'プラットフォームID',
  `category_id` int(11) NOT NULL DEFAULT '0' COMMENT 'カテゴリーID',
  `product_id` int(11) NOT NULL DEFAULT '0' COMMENT '商品ID',
  `product_name` varchar(255) DEFAULT NULL COMMENT '商品名',
  `catch_copy` varchar(255) DEFAULT NULL COMMENT 'キャッチコピー',
  `user_id` int(11) NOT NULL DEFAULT '0' COMMENT '会員ID',
  `nick_name` varchar(255) DEFAULT NULL COMMENT 'ニックネーム',
  `price` int(11) NOT NULL DEFAULT '0' COMMENT '販売価格',
  `is_special_discount` tinyint(1) NOT NULL DEFAULT '0' COMMENT '特別値下げフラグ\n0:通常、1:特別値下げ',
  `special_discount_price` int(11) NOT NULL DEFAULT '0' COMMENT '値下げ価格',
  `sales_count` int(11) NOT NULL DEFAULT '0' COMMENT '売上件数',
  `reviews_stars` double NOT NULL DEFAULT '0' COMMENT 'レビュー5段階評価',
  `reviews_count` int(11) NOT NULL DEFAULT '0' COMMENT 'レビュー件数',
  `profit_rate` double NOT NULL DEFAULT '0' COMMENT '収益率',
  `profit_total` double NOT NULL DEFAULT '0' COMMENT '収益額',
  `account_currency_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '口座通貨種別\n0:なし、1:日本円、2：米ドル',
  `winning_rate` double NOT NULL DEFAULT '0' COMMENT '勝率',
  `profit_factor` double NOT NULL DEFAULT '0' COMMENT 'プロフィットファクター',
  `risk_return_rate` double NOT NULL DEFAULT '0' COMMENT 'リスクリターン率',
  `time_current` text COMMENT '損益曲線対象日付\nカンマ区切り（日単位）',
  `balance_curve` text COMMENT '累積確定損益曲線\nカンマ区切り（日単位）',
  `equity_curve` text COMMENT '当日最大含み損益曲線\nカンマ区切り（日単位）',
  `pips_total` double NOT NULL DEFAULT '0' COMMENT '収益率',
  `maximal_drawdown` double NOT NULL DEFAULT '0' COMMENT '最大ドローダウン',
  `operating_months` int(11) NOT NULL DEFAULT '0' COMMENT '稼働期間',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='systemtrade ranking best sellers for Viet Nam';

-- -----------------------------------------------------
-- Table `surfaces`.`systemtrade_chart_pie_vi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `surfaces`.`systemtrade_chart_pie_vi` (
  `id` int(11) NOT NULL COMMENT 'システムトレード円グラフID',
  `is_valid` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'データ有効フラグ\n0:無効、1:有効',
  `platform_id` int(11) NOT NULL DEFAULT '0' COMMENT 'プラットフォームID',
  `category_id` int(11) NOT NULL DEFAULT '0' COMMENT 'カテゴリーID',
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `value` double NOT NULL DEFAULT '0' COMMENT '値',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='systemtrade chart pie for Viet Nam';


-- -----------------------------------------------------
-- Table `surfaces`.`systemtrade_chart_3d_scatter_vi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `surfaces`.`systemtrade_chart_3d_scatter_vi` (
  `id` int(11) NOT NULL COMMENT 'システムトレード3次元散布図ID',
  `is_valid` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'データ有効フラグ\n0:無効、1:有効',
  `platform_id` int(11) NOT NULL DEFAULT '0' COMMENT 'プラットフォームID',
  `category_id` int(11) NOT NULL DEFAULT '0' COMMENT 'カテゴリーID',
  `product_id` int(11) NOT NULL DEFAULT '0' COMMENT '商品ID',
  `product_name` varchar(255) DEFAULT NULL COMMENT '商品名',
  `catch_copy` varchar(255) DEFAULT NULL COMMENT 'キャッチコピー',
  `user_id` int(11) NOT NULL DEFAULT '0' COMMENT '会員ID',
  `nick_name` varchar(255) DEFAULT NULL COMMENT 'ニックネーム',
  `price` int(11) NOT NULL DEFAULT '0' COMMENT '販売価格',
  `is_special_discount` tinyint(1) NOT NULL DEFAULT '0' COMMENT '特別値下げフラグ\n0:通常、1:特別値下げ',
  `special_discount_price` int(11) NOT NULL DEFAULT '0' COMMENT '値下げ価格',
  `sales_count` int(11) NOT NULL DEFAULT '0' COMMENT '売上件数',
  `reviews_stars` double NOT NULL DEFAULT '0' COMMENT 'レビュー5段階評価',
  `reviews_count` int(11) NOT NULL DEFAULT '0' COMMENT 'レビュー件数',
  `profit_rate` double NOT NULL DEFAULT '0' COMMENT '収益率',
  `profit_total` double NOT NULL DEFAULT '0' COMMENT '収益額',
  `account_currency_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '口座通貨種別\n0:なし、1:日本円、2：米ドル',
  `winning_rate` double NOT NULL DEFAULT '0' COMMENT '勝率',
  `profit_factor` double NOT NULL DEFAULT '0' COMMENT 'プロフィットファクター',
  `risk_return_rate` double NOT NULL DEFAULT '0' COMMENT 'リスクリターン率',
  `maximal_drawdown` double NOT NULL DEFAULT '0' COMMENT '最大ドローダウン',
  `operating_months` int(11) NOT NULL DEFAULT '0' COMMENT '稼働期間',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='systemtrade chart 3d scatter for Viet Nam';


-- -----------------------------------------------------
-- Table `surfaces`.`systemtrade_ranking_profit_rate_vi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `surfaces`.`systemtrade_ranking_profit_rate_vi` (
  `id` int(11) NOT NULL COMMENT 'システムトレード収益率ランキングID',
  `is_valid` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'データ有効フラグ\n0:無効、1:有効',
  `platform_id` int(11) NOT NULL DEFAULT '0' COMMENT 'プラットフォームID',
  `category_id` int(11) NOT NULL DEFAULT '0' COMMENT 'カテゴリーID',
  `product_id` int(11) NOT NULL DEFAULT '0' COMMENT '商品ID',
  `product_name` varchar(255) DEFAULT NULL COMMENT '商品名',
  `catch_copy` varchar(255) DEFAULT NULL COMMENT 'キャッチコピー',
  `user_id` int(11) NOT NULL DEFAULT '0' COMMENT '会員ID',
  `nick_name` varchar(255) DEFAULT NULL COMMENT 'ニックネーム',
  `price` int(11) NOT NULL DEFAULT '0' COMMENT '販売価格',
  `is_special_discount` tinyint(1) NOT NULL DEFAULT '0' COMMENT '特別値下げフラグ\n0:通常、1:特別値下げ',
  `special_discount_price` int(11) NOT NULL DEFAULT '0' COMMENT '値下げ価格',
  `sales_count` int(11) NOT NULL DEFAULT '0' COMMENT '売上件数',
  `reviews_stars` double NOT NULL DEFAULT '0' COMMENT 'レビュー5段階評価',
  `reviews_count` int(11) NOT NULL DEFAULT '0' COMMENT 'レビュー件数',
  `profit_rate` double NOT NULL DEFAULT '0' COMMENT '収益率',
  `profit_total` double NOT NULL DEFAULT '0' COMMENT '収益額',
  `account_currency_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '口座通貨種別\n0:なし、1:日本円、2：米ドル',
  `winning_rate` double NOT NULL DEFAULT '0' COMMENT '勝率',
  `profit_factor` double NOT NULL DEFAULT '0' COMMENT 'プロフィットファクター',
  `risk_return_rate` double NOT NULL DEFAULT '0' COMMENT 'リスクリターン率',
  `time_current` text COMMENT '損益曲線対象日付\nカンマ区切り（日単位）',
  `balance_curve` text COMMENT '累積確定損益曲線\nカンマ区切り（日単位）',
  `equity_curve` text COMMENT '当日最大含み損益曲線\nカンマ区切り（日単位）',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='systemtrade ranking profit rate for Viet Nam';

-- -----------------------------------------------------
-- Table `surfaces`.`systemtrade_ranking_profit_total_vi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `surfaces`.`systemtrade_ranking_profit_total_vi` (
  `id` int(11) NOT NULL COMMENT 'システムトレード収益額ランキングID',
  `is_valid` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'データ有効フラグ\n0:無効、1:有効',
  `platform_id` int(11) NOT NULL DEFAULT '0' COMMENT 'プラットフォームID',
  `category_id` int(11) NOT NULL DEFAULT '0' COMMENT 'カテゴリーID',
  `product_id` int(11) NOT NULL DEFAULT '0' COMMENT '商品ID',
  `product_name` varchar(255) DEFAULT NULL COMMENT '商品名',
  `catch_copy` varchar(255) DEFAULT NULL COMMENT 'キャッチコピー',
  `user_id` int(11) NOT NULL DEFAULT '0' COMMENT '会員ID',
  `nick_name` varchar(255) DEFAULT NULL COMMENT 'ニックネーム',
  `price` int(11) NOT NULL DEFAULT '0' COMMENT '販売価格',
  `is_special_discount` tinyint(1) NOT NULL DEFAULT '0' COMMENT '特別値下げフラグ\n0:通常、1:特別値下げ',
  `special_discount_price` int(11) NOT NULL DEFAULT '0' COMMENT '値下げ価格',
  `sales_count` int(11) NOT NULL DEFAULT '0' COMMENT '売上件数',
  `reviews_stars` double NOT NULL DEFAULT '0' COMMENT 'レビュー5段階評価',
  `reviews_count` int(11) NOT NULL DEFAULT '0' COMMENT 'レビュー件数',
  `profit_rate` double NOT NULL DEFAULT '0' COMMENT '収益率',
  `profit_total` double NOT NULL DEFAULT '0' COMMENT '収益額',
  `account_currency_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '口座通貨種別\n0:なし、1:日本円、2：米ドル',
  `winning_rate` double NOT NULL DEFAULT '0' COMMENT '勝率',
  `profit_factor` double NOT NULL DEFAULT '0' COMMENT 'プロフィットファクター',
  `risk_return_rate` double NOT NULL DEFAULT '0' COMMENT 'リスクリターン率',
  `time_current` text COMMENT '損益曲線対象日付\nカンマ区切り（日単位）',
  `balance_curve` text COMMENT '累積確定損益曲線\nカンマ区切り（日単位）',
  `equity_curve` text COMMENT '当日最大含み損益曲線\nカンマ区切り（日単位）',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='systemtrade ranking profit total for Viet Nam';


-- -----------------------------------------------------
-- Table `surfaces`.`systemtrade_ranking_pf_vi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `surfaces`.`systemtrade_ranking_pf_vi` (
  `id` int(11) NOT NULL COMMENT 'システムトレードPFランキングID',
  `is_valid` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'データ有効フラグ\n0:無効、1:有効',
  `platform_id` int(11) NOT NULL DEFAULT '0' COMMENT 'プラットフォームID',
  `category_id` int(11) NOT NULL DEFAULT '0' COMMENT 'カテゴリーID',
  `product_id` int(11) NOT NULL DEFAULT '0' COMMENT '商品ID',
  `product_name` varchar(255) DEFAULT NULL COMMENT '商品名',
  `catch_copy` varchar(255) DEFAULT NULL COMMENT 'キャッチコピー',
  `user_id` int(11) NOT NULL DEFAULT '0' COMMENT '会員ID',
  `nick_name` varchar(255) DEFAULT NULL COMMENT 'ニックネーム',
  `price` int(11) NOT NULL DEFAULT '0' COMMENT '販売価格',
  `is_special_discount` tinyint(1) NOT NULL DEFAULT '0' COMMENT '特別値下げフラグ\n0:通常、1:特別値下げ',
  `special_discount_price` int(11) NOT NULL DEFAULT '0' COMMENT '値下げ価格',
  `sales_count` int(11) NOT NULL DEFAULT '0' COMMENT '売上件数',
  `reviews_stars` double NOT NULL DEFAULT '0' COMMENT 'レビュー5段階評価',
  `reviews_count` int(11) NOT NULL DEFAULT '0' COMMENT 'レビュー件数',
  `profit_rate` double NOT NULL DEFAULT '0' COMMENT '収益率',
  `profit_total` double NOT NULL DEFAULT '0' COMMENT '収益額',
  `account_currency_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '口座通貨種別\n0:なし、1:日本円、2：米ドル',
  `winning_rate` double NOT NULL DEFAULT '0' COMMENT '勝率',
  `profit_factor` double NOT NULL DEFAULT '0' COMMENT 'プロフィットファクター',
  `risk_return_rate` double NOT NULL DEFAULT '0' COMMENT 'リスクリターン率',
  `time_current` text COMMENT '損益曲線対象日付\nカンマ区切り（日単位）',
  `balance_curve` text COMMENT '累積確定損益曲線\nカンマ区切り（日単位）',
  `equity_curve` text COMMENT '当日最大含み損益曲線\nカンマ区切り（日単位）',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='systemtrade ranking profit factor for Viet Nam';

-- -----------------------------------------------------
-- Table `surfaces`.`systemtrade_ranking_risk_return_vi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `surfaces`.`systemtrade_ranking_risk_return_vi` (
  `id` int(11) NOT NULL COMMENT 'システムトレードリスクリターン率ランキングID',
  `is_valid` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'データ有効フラグ\n0:無効、1:有効',
  `platform_id` int(11) NOT NULL DEFAULT '0' COMMENT 'プラットフォームID',
  `category_id` int(11) NOT NULL DEFAULT '0' COMMENT 'カテゴリーID',
  `product_id` int(11) NOT NULL DEFAULT '0' COMMENT '商品ID',
  `product_name` varchar(255) DEFAULT NULL COMMENT '商品名',
  `catch_copy` varchar(255) DEFAULT NULL COMMENT 'キャッチコピー',
  `user_id` int(11) NOT NULL DEFAULT '0' COMMENT '会員ID',
  `nick_name` varchar(255) DEFAULT NULL COMMENT 'ニックネーム',
  `price` int(11) NOT NULL DEFAULT '0' COMMENT '販売価格',
  `is_special_discount` tinyint(1) NOT NULL DEFAULT '0' COMMENT '特別値下げフラグ\n0:通常、1:特別値下げ',
  `special_discount_price` int(11) NOT NULL DEFAULT '0' COMMENT '値下げ価格',
  `sales_count` int(11) NOT NULL DEFAULT '0' COMMENT '売上件数',
  `reviews_stars` double NOT NULL DEFAULT '0' COMMENT 'レビュー5段階評価',
  `reviews_count` int(11) NOT NULL DEFAULT '0' COMMENT 'レビュー件数',
  `profit_rate` double NOT NULL DEFAULT '0' COMMENT '収益率',
  `profit_total` double NOT NULL DEFAULT '0' COMMENT '収益額',
  `account_currency_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '口座通貨種別\n0:なし、1:日本円、2：米ドル',
  `winning_rate` double NOT NULL DEFAULT '0' COMMENT '勝率',
  `profit_factor` double NOT NULL DEFAULT '0' COMMENT 'プロフィットファクター',
  `risk_return_rate` double NOT NULL DEFAULT '0' COMMENT 'リスクリターン率',
  `time_current` text COMMENT '損益曲線対象日付\nカンマ区切り（日単位）',
  `balance_curve` text COMMENT '累積確定損益曲線\nカンマ区切り（日単位）',
  `equity_curve` text COMMENT '当日最大含み損益曲線\nカンマ区切り（日単位）',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='systemtrade ranking risk return for Viet Nam';

-- -----------------------------------------------------
-- Table `surfaces`.`systemtrade_chart_column_vi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `surfaces`.`systemtrade_chart_column_vi` (
  `id` int(11) NOT NULL COMMENT 'システムトレード縦棒グラフID',
  `is_valid` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'データ有効フラグ\n0:無効、1:有効',
  `platform_id` int(11) NOT NULL DEFAULT '0' COMMENT 'プラットフォームID',
  `category_id` int(11) NOT NULL DEFAULT '0' COMMENT 'カテゴリーID',
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `value` double NOT NULL DEFAULT '0' COMMENT '値',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='systemtrade chart column for Viet Nam';

-- -----------------------------------------------------
-- Table `surfaces`.`systemtrade_chart_scatter_line_vi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `surfaces`.`systemtrade_chart_scatter_line_vi` (
  `id` INT(11) NOT NULL COMMENT 'システムトレード散布図・回帰直線ID',
  `is_valid` TINYINT(1) NOT NULL DEFAULT '0' COMMENT 'データ有効フラグ\n0:無効、1:有効',
  `platform_id` INT(11) NOT NULL DEFAULT '0' COMMENT 'プラットフォームID',
  `category_id` INT(11) NOT NULL DEFAULT '0' COMMENT 'カテゴリーID',
  `product_id` INT(11) NOT NULL DEFAULT '0' COMMENT '商品ID',
  `product_name` VARCHAR(255) NULL COMMENT '商品名',
  `catch_copy` VARCHAR(255) NULL COMMENT 'キャッチコピー',
  `user_id` INT(11) NOT NULL DEFAULT '0' COMMENT '会員ID',
  `nick_name` VARCHAR(255) NULL COMMENT 'ニックネーム',
  `price` INT(11) NOT NULL DEFAULT '0' COMMENT '販売価格',
  `is_special_discount` TINYINT(1) NOT NULL DEFAULT '0' COMMENT '特別値下げフラグ\n0:通常、1:特別値下げ',
  `special_discount_price` INT(11) NOT NULL DEFAULT '0' COMMENT '値下げ価格',
  `sales_count` INT(11) NOT NULL DEFAULT '0' COMMENT '売上件数',
  `reviews_stars` DOUBLE NOT NULL DEFAULT '0' COMMENT 'レビュー5段階評価',
  `reviews_count` INT(11) NOT NULL DEFAULT '0' COMMENT 'レビュー件数',
  `profit_rate` DOUBLE NOT NULL DEFAULT '0' COMMENT '収益率',
  `profit_total` DOUBLE NOT NULL DEFAULT '0' COMMENT '収益額',
  `account_currency_type` TINYINT(1) NOT NULL DEFAULT '0' COMMENT '口座通貨種別\n0:なし、1:日本円、2：米ドル',
  `winning_rate` DOUBLE NOT NULL DEFAULT '0' COMMENT '勝率',
  `profit_factor` DOUBLE NOT NULL DEFAULT '0' COMMENT 'プロフィットファクター',
  `risk_return_rate` DOUBLE NOT NULL DEFAULT '0' COMMENT 'リスクリターン率',
  `maximal_drawdown` DOUBLE NOT NULL DEFAULT '0' COMMENT '最大ドローダウン',
  `operating_months` INT(11) NOT NULL DEFAULT '0' COMMENT '稼働期間',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='systemtrade chart scatter line for Viet Nam';

-- -----------------------------------------------------
-- Table `surfaces`.`systemtrade_recent_products_en`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `surfaces`.`systemtrade_recent_products_vi` (
  `id` int(11) NOT NULL COMMENT 'システムトレード新着商品ID',
  `is_valid` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'データ有効フラグ\n0:無効、1:有効',
  `platform_id` int(11) NOT NULL DEFAULT '0' COMMENT 'プラットフォームID',
  `category_id` int(11) NOT NULL DEFAULT '0' COMMENT 'カテゴリーID',
  `product_id` int(11) NOT NULL DEFAULT '0' COMMENT '商品ID',
  `product_name` varchar(255) DEFAULT NULL COMMENT '商品名',
  `catch_copy` varchar(255) DEFAULT NULL COMMENT 'キャッチコピー',
  `user_id` int(11) NOT NULL DEFAULT '0' COMMENT '会員ID',
  `nick_name` varchar(255) DEFAULT NULL COMMENT 'ニックネーム',
  `price` int(11) NOT NULL DEFAULT '0' COMMENT '販売価格',
  `is_special_discount` tinyint(1) NOT NULL DEFAULT '0' COMMENT '特別値下げフラグ\n0:通常、1:特別値下げ',
  `special_discount_price` int(11) NOT NULL DEFAULT '0' COMMENT '値下げ価格',
  `sales_count` int(11) NOT NULL DEFAULT '0' COMMENT '売上件数',
  `reviews_stars` double NOT NULL DEFAULT '0' COMMENT 'レビュー5段階評価',
  `reviews_count` int(11) NOT NULL DEFAULT '0' COMMENT 'レビュー件数',
  `profit_rate` double NOT NULL DEFAULT '0' COMMENT '収益率',
  `profit_total` double NOT NULL DEFAULT '0' COMMENT '収益額',
  `account_currency_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '口座通貨種別\n0:なし、1:日本円、2：米ドル',
  `winning_rate` double NOT NULL DEFAULT '0' COMMENT '勝率',
  `profit_factor` double NOT NULL DEFAULT '0' COMMENT 'プロフィットファクター',
  `risk_return_rate` double NOT NULL DEFAULT '0' COMMENT 'リスクリターン率',
  `time_current` text COMMENT '損益曲線対象日付\nカンマ区切り（日単位）',
  `balance_curve` text COMMENT '累積確定損益曲線\nカンマ区切り（日単位）',
  `equity_curve` text COMMENT '当日最大含み損益曲線\nカンマ区切り（日単位）',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='systemtrade recent products for Viet Nam';


-- -----------------------------------------------------
-- Table `surfaces`.`systemtrade_search_vi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `surfaces`.`systemtrade_search_vi` (
  `id` INT(11) NOT NULL COMMENT 'システムトレード検索ID',
  `is_valid` TINYINT(1) NOT NULL DEFAULT '0' COMMENT 'データ有効フラグ\n0:無効、1:有効',
  `easy_search_type` TEXT NULL COMMENT '簡単検索種別\n0：なし　1：人気、2：新着、3:高勝率、4.損小利大、5:コツコツ、6:ドカンと、7:利益更新、8:右肩上昇、9:キャンペーン',
  `platform_id` INT(11) NOT NULL DEFAULT '0' COMMENT 'プラットフォームID',
  `category_id` INT(11) NOT NULL DEFAULT '0' COMMENT 'カテゴリーID',
  `product_id` INT(11) NOT NULL DEFAULT '0' COMMENT '商品ID',
  `product_name` VARCHAR(255) NULL COMMENT '商品名',
  `catch_copy` VARCHAR(255) NULL COMMENT 'キャッチコピー',
  `user_id` INT(11) NOT NULL DEFAULT '0' COMMENT '会員ID',
  `nick_name` VARCHAR(255) NULL COMMENT 'ニックネーム',
  `price` INT(11) NOT NULL DEFAULT '0' COMMENT '販売価格',
  `is_special_discount` TINYINT(1) NOT NULL DEFAULT '0' COMMENT '特別値下げフラグ\n0:通常、1:特別値下げ',
  `special_discount_price` INT(11) NOT NULL DEFAULT '0' COMMENT '値下げ価格',
  `price_on_sale` INT(11) NOT NULL DEFAULT '0' COMMENT '比較用の価格',
  `forward_at` TIMESTAMP NULL COMMENT 'フォワード開始日時',
  `version_updated_at` TIMESTAMP NULL COMMENT 'バージョンアップ日時',
  `account_currency_type` TINYINT(1) NOT NULL DEFAULT '0' COMMENT '口座通貨種別\n0:なし、1:日本円、2：米ドル',
  `months` INT(11) NOT NULL DEFAULT '0' COMMENT '集計期間月数\n0:全期間、1:1ヶ月、3:3ヶ月、6:6ヶ月、12:1年、24:2年、36:3年',
  `time_current` TEXT NULL COMMENT '損益曲線対象日付\nカンマ区切り（日単位）',
  `balance_curve` TEXT NULL COMMENT '累積確定損益曲線\nカンマ区切り（日単位）',
  `equity_curve` TEXT NULL COMMENT '当日最大含み損益曲線\nカンマ区切り（日単位）',
  `profit_rate` DOUBLE NOT NULL DEFAULT '0' COMMENT '収益率',
  `maximal_drawdown_rate` DOUBLE NOT NULL DEFAULT '0' COMMENT '最大ドローダウン%',
  `risk_return_rate` DOUBLE NOT NULL DEFAULT '0' COMMENT 'リスクリターン率',
  `winning_rate` DOUBLE NOT NULL DEFAULT '0' COMMENT '勝率',
  `expected_payoff` DOUBLE NOT NULL DEFAULT '0' COMMENT '期待利得',
  `profit_total` DOUBLE NOT NULL DEFAULT '0' COMMENT '収益額',
  `profit` DOUBLE NOT NULL DEFAULT '0' COMMENT '収益額',
  `profit_factor` DOUBLE NOT NULL DEFAULT '0' COMMENT 'プロフィットファクター',
  `total_trades` INT(11) NOT NULL DEFAULT '0' COMMENT '総取引数',
  `operating_months` INT(11) NOT NULL DEFAULT '0' COMMENT '稼働期間',
  `search_contents` TEXT NULL COMMENT '検索内容\n検索用に関連文字列をカンマで文字連結する',
  `currency_pairs` TEXT NULL COMMENT '通貨ペア\n複数の場合はIDをカンマ区切り',
  `trading_styles` TEXT NULL COMMENT '取引スタイル\n複数の場合はIDをカンマ区切り',
  `technical_indicators` TEXT NULL COMMENT 'テクニカル指標\n複数の場合はIDをカンマ区切り',
  `max_positions` INT(11) NOT NULL DEFAULT '0' COMMENT '最大ポジション数',
  `sales_count` INT(11) NOT NULL DEFAULT '0' COMMENT '売上件数',
  `reviews_stars` DOUBLE NOT NULL DEFAULT '0' COMMENT 'レビュー5段階評価',
  `reviews_count` INT(11) NOT NULL DEFAULT '0' COMMENT 'レビュー件数',
  `is_operating` TINYINT(1) NOT NULL DEFAULT '0' COMMENT '稼働フラグ\n0:停止中、1:稼働中',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='systemtrade search for Viet Nam';


-- -----------------------------------------------------
-- Table `surfaces`.`systemtrade_ranking_new_popular_vi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `surfaces`.`systemtrade_ranking_new_popular_vi` (
  `id` int(11) NOT NULL COMMENT 'システムトレード新着人気ランキングID',
  `is_valid` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'データ有効フラグ\n0:無効、1:有効',
  `platform_id` int(11) NOT NULL DEFAULT '0' COMMENT 'プラットフォームID',
  `category_id` int(11) NOT NULL DEFAULT '0' COMMENT 'カテゴリーID',
  `product_id` int(11) NOT NULL DEFAULT '0' COMMENT '商品ID',
  `product_name` varchar(255) DEFAULT NULL COMMENT '商品名',
  `catch_copy` varchar(255) DEFAULT NULL COMMENT 'キャッチコピー',
  `user_id` int(11) NOT NULL DEFAULT '0' COMMENT '会員ID',
  `nick_name` varchar(255) DEFAULT NULL COMMENT 'ニックネーム',
  `price` int(11) NOT NULL DEFAULT '0' COMMENT '販売価格',
  `is_special_discount` tinyint(1) NOT NULL DEFAULT '0' COMMENT '特別値下げフラグ\n0:通常、1:特別値下げ',
  `special_discount_price` int(11) NOT NULL DEFAULT '0' COMMENT '値下げ価格',
  `sales_count` int(11) NOT NULL DEFAULT '0' COMMENT '売上件数',
  `reviews_stars` double NOT NULL DEFAULT '0' COMMENT 'レビュー5段階評価',
  `reviews_count` int(11) NOT NULL DEFAULT '0' COMMENT 'レビュー件数',
  `profit_rate` double NOT NULL DEFAULT '0' COMMENT '収益率',
  `profit_total` double NOT NULL DEFAULT '0' COMMENT '収益額',
  `account_currency_type` tinyint(1) NOT NULL DEFAULT '0' COMMENT '口座通貨種別\n0:なし、1:日本円、2：米ドル',
  `winning_rate` double NOT NULL DEFAULT '0' COMMENT '勝率',
  `profit_factor` double NOT NULL DEFAULT '0' COMMENT 'プロフィットファクター',
  `risk_return_rate` double NOT NULL DEFAULT '0' COMMENT 'リスクリターン率',
  `time_current` text COMMENT '損益曲線対象日付\nカンマ区切り（月単位）',
  `balance_curve` text COMMENT '累積確定損益曲線\nカンマ区切り（月単位）',
  `equity_curve` text COMMENT '当日最大含み損益曲線\nカンマ区切り（月単位）',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='systemtrade ranking new popular for Viet Nam';


--
-- Indexes for table `systemtrade_ranking_best_sellers_vi`
--
ALTER TABLE `surfaces`.`systemtrade_ranking_best_sellers_vi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `systemtrade_ranking_best_sellers_vi`
--
ALTER TABLE `surfaces`.`systemtrade_ranking_best_sellers_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'システムトレード売れ筋ランキングID';

--
-- Indexes for table `systemtrade_chart_pie_vi`
--
ALTER TABLE `surfaces`.`systemtrade_chart_pie_vi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `systemtrade_chart_pie_vi`
--
ALTER TABLE `surfaces`.`systemtrade_chart_pie_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'システムトレード円グラフID';

--
-- Indexes for table `systemtrade_chart_3d_scatter_vi`
--
ALTER TABLE `surfaces`.`systemtrade_chart_3d_scatter_vi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `systemtrade_chart_3d_scatter_vi`
--
ALTER TABLE `surfaces`.`systemtrade_chart_3d_scatter_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'システムトレード3次元散布図ID';

--
-- Indexes for table `systemtrade_ranking_profit_rate_vi`
--
ALTER TABLE `surfaces`.`systemtrade_ranking_profit_rate_vi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `systemtrade_ranking_profit_rate_vi`
--
ALTER TABLE `surfaces`.`systemtrade_ranking_profit_rate_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'システムトレード収益率ランキングID';

--
-- Indexes for table `systemtrade_ranking_profit_total_vi`
--
ALTER TABLE `surfaces`.`systemtrade_ranking_profit_total_vi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `systemtrade_ranking_profit_total_vi`
--
ALTER TABLE `surfaces`.`systemtrade_ranking_profit_total_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'システムトレード収益額ランキングID';

--
-- Indexes for table `systemtrade_ranking_pf_vi`
--
ALTER TABLE `surfaces`.`systemtrade_ranking_pf_vi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `systemtrade_ranking_pf_vi`
--
ALTER TABLE `surfaces`.`systemtrade_ranking_pf_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'システムトレードPFランキングID';

--
-- Indexes for table `systemtrade_ranking_risk_return_vi`
--
ALTER TABLE `surfaces`.`systemtrade_ranking_risk_return_vi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `systemtrade_ranking_risk_return_vi`
--
ALTER TABLE `surfaces`.`systemtrade_ranking_risk_return_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'システムトレードリスクリターン率ランキングID';

--
-- Indexes for table `systemtrade_chart_column_vi`
--
ALTER TABLE `surfaces`.`systemtrade_chart_column_vi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `systemtrade_chart_column_vi`
--
ALTER TABLE `surfaces`.`systemtrade_chart_column_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'システムトレード縦棒グラフID';

--
-- Indexes for table `systemtrade_chart_scatter_line_vi`
--
ALTER TABLE `surfaces`.`systemtrade_chart_scatter_line_vi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `systemtrade_chart_scatter_line_vi`
--
ALTER TABLE `surfaces`.`systemtrade_chart_scatter_line_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'システムトレード散布図・回帰直線ID';

--
-- Indexes for table `systemtrade_recent_products_vi`
--
ALTER TABLE `surfaces`.`systemtrade_recent_products_vi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `systemtrade_recent_products_vi`
--
ALTER TABLE `surfaces`.`systemtrade_recent_products_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'システムトレード新着商品ID';

--
-- Indexes for table `systemtrade_search_vi`
--
ALTER TABLE `surfaces`.`systemtrade_search_vi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `systemtrade_search_vi`
--
ALTER TABLE `surfaces`.`systemtrade_search_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'システムトレード検索ID';

--
-- Indexes for table `systemtrade_ranking_new_popular_vi`
--
ALTER TABLE `surfaces`.`systemtrade_ranking_new_popular_vi`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `systemtrade_ranking_new_popular_vi`
--
ALTER TABLE `surfaces`.`systemtrade_ranking_new_popular_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'システムトレード新着人気ランキングID';
