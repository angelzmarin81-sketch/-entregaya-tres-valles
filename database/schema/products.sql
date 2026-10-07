CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  business_id INT,
  name VARCHAR(120),
  price NUMERIC(12,2),
  active BOOLEAN DEFAULT TRUE
);
