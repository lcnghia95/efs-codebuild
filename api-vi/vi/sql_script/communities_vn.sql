-- -----------------------------------------------------
-- Table `common`.`communities_vi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `common`.`communities_vi` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'コミュニティID',
  `is_valid` TINYINT(1) NOT NULL DEFAULT '0' COMMENT 'データ有効フラグ\n0:無効、1:有効',
  `is_private` TINYINT(1) NOT NULL DEFAULT '0' COMMENT 'プライベートフラグ\n0:通常、1:プライベート（出品者以外は非公開）',
  `user_id` INT(11) NOT NULL DEFAULT '0' COMMENT '会員ID',
  `product_id` INT(11) NOT NULL DEFAULT '0' COMMENT '商品ID',
  `type_id` INT(11) NOT NULL DEFAULT '0' COMMENT '商品種別',
  `is_topic` TINYINT(1) NOT NULL DEFAULT '0' COMMENT 'トピック投稿フラグ\n0:コメント投稿、1:トピック投稿',
  `topic_community_id` INT(11) NOT NULL DEFAULT '0' COMMENT 'トピックコミュニティID\nトピック投稿のコミュニティID。トピック投稿の場合はIDと同値',
  `published_at` TIMESTAMP NULL COMMENT '投稿日時',
  `title` VARCHAR(255) NULL COMMENT 'タイトル',
  `content` TEXT NULL COMMENT '内容',
  `is_uploaded_images` TINYINT(1) NOT NULL DEFAULT '0' COMMENT '画像添付投稿フラグ\n0:画像添付なし、1:画像添付あり',
  `ip_address` VARCHAR(64) NULL COMMENT 'IPアドレス',
  `user_agent` TEXT NULL COMMENT 'ユーザーエージェント',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
COMMENT = 'communities for VN language';
