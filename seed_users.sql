USE bamazon;

CREATE TABLE user(
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  username VARCHAR(100),
  passw VARCHAR(100),
  user_type VARCHAR(20),
 
  PRIMARY KEY (item_id)
);