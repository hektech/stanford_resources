ALTER TABLE `_DATABASE_NAME_`.`Resource` ADD COLUMN `invoiceDate` date default NULL;
ALTER TABLE `_DATABASE_NAME_`.`Resource` ADD COLUMN `invoiceAlertEnabledInd` int(10) unsigned default NULL;

ALTER TABLE `_DATABASE_NAME_`.`ResourcePayment` ADD COLUMN `paymentYear` varchar(200) default NULL;
ALTER TABLE `_DATABASE_NAME_`.`ResourcePayment` ADD COLUMN `paymentDetail` varchar(200) default NULL;
