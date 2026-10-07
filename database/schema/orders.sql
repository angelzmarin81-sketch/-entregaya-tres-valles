CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  business_id INT,
  customer_name VARCHAR(120),
  customer_phone VARCHAR(40),
  address VARCHAR(255),
  status VARCHAR(40),
  subtotal NUMERIC(12,2),
  delivery_fee NUMERIC(12,2),
  commission NUMERIC(12,2),
  total NUMERIC(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
