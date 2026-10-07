CREATE TABLE commissions (
  id SERIAL PRIMARY KEY,
  order_id INT,
  business_id INT,
  amount NUMERIC(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
