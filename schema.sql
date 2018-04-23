USE bamazon;
DROP TABLE IF EXISTS products;

CREATE TABLE products(
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100),
  department_name VARCHAR(100),
  price DECIMAL(10,3),
  cost DECIMAL(10,3),
  stock_quantity INTEGER(11),
  PRIMARY KEY (item_id)
);
