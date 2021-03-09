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
  `email` VARCHAR(45) NULL,
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

  CREATE TABLE `home8`.`messages` (
  `mid` INT NOT NULL,
  `from` VARCHAR(45) NOT NULL,
  `to` VARCHAR(45) NOT NULL,
  `type` VARCHAR(45) NOT NULL,
  `lid` INT NOT NULL,
  `content` VARCHAR(500) NULL,
  `time` DATETIME NOT NULL DEFAULT NOW(),
  `read` TINYINT NOT NULL,
  PRIMARY KEY (`mid`),
  FOREIGN KEY(`lid`) REFERENCES listings(`lid`));

  CREATE TABLE `home8`.`mates` (
  `idmates` INT NOT NULL,
  `userid` VARCHAR(45) NOT NULL,
  `friendid` VARCHAR(45) NOT NULL,
  `review` VARCHAR(500) NULL,
  PRIMARY KEY (`idmates`),
  FOREIGN KEY(`userid`) REFERENCES users(`userid`),
  FOREIGN KEY (`friendid`) REFERENCES users(`userid`));

  CREATE TABLE `home8`.`filter` (
  `idfilter` INT NOT NULL,
  `current` TINYINT NOT NULL,
  `past` TINYINT NOT NULL,
  `lid` INT NOT NULL,
  `userid` VARCHAR(45) NOT NULL,
  `favorite` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`idfilter`),
  FOREIGN KEY (`lid`) REFERENCES listings(`lid`),
  FOREIGN KEY (`userid`) REFERENCES users(`userid`));


```
### Run
```
$npm start
```