CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INT,
  method VARCHAR(40),
  amount NUMERIC(12,2),
  status VARCHAR(40)
);
