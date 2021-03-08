# Back-end
### Database: Local MySQL Setup
```
CREATE DATABSE home8;
CREATE TABLE `home8`.`users` (
  `userid` VARCHAR(45) NOT NULL,
  `username` VARCHAR(45) NULL,
  `firstName` VARCHAR(45) NULL,
  `lastName` VARCHAR(45) NULL,
  `dob` VARCHAR(45) NULL,
  `phone` VARCHAR(15) NULL,
  `nationality` VARCHAR(20) NULL,
  `gender` VARCHAR(5) NULL,
  `genderPreference` VARCHAR(5) NULL,
  PRIMARY KEY (`userid`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE);
CREATE TABLE `home8`.`listings` (
  `lid` INT NOT NULL,
  `description` VARCHAR(500) NULL,
  `address` VARCHAR(50) NULL,
  `longitude` FLOAT NULL,
  `latitude` FLOAT NULL,
  `price` FLOAT NULL,
  `count` INT NULL,
  `active` TINYINT NULL,
  `doorman` TINYINT NULL,
  `building` VARCHAR(20) NULL,
  `laundry` VARCHAR(20) NULL,
  `bed` INT NULL,
  `bath` INT NULL,
  `roomType` VARCHAR(100) NULL,
  `rooming` VARCHAR(100) NULL,
  `fromDate` VARCHAR(200) NULL,
  `toDate` VARCHAR(200) NULL,
  `mates` VARCHAR(200) NULL,
  `owner` VARCHAR(45) NULL,
  PRIMARY KEY (`lid`));

  CREATE TABLE `home8`.`personalityQs` (
  `qid` INT NOT NULL,
  `question` VARCHAR(200) NOT NULL,
  `1` VARCHAR(20) NULL,
  `2` VARCHAR(20) NULL,
  `3` VARCHAR(20) NULL,
  `4` VARCHAR(20) NULL,
  `5` VARCHAR(20) NULL,
  PRIMARY KEY (`qid`));
  
  CREATE TABLE `home8`.`personalityAs` (
  `aid` INT NOT NULL,
  `qid` INT NOT NULL,
  `userid` VARCHAR(45) NOT NULL,
  `ans` INT NOT NULL,
  PRIMARY KEY (`aid`),
  FOREIGN KEY(`qid`) REFERENCES personalityQs(`qid`));
```
### Run
```
$npm start
```