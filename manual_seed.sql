-- Insert a new Customer and capture their ID
WITH new_customer AS (
  INSERT INTO "Customer" (name, email, phone, plate, company)
  VALUES (
    'Test Customer', 
    'test@example.com', 
    '+1234567890', 
    'TEST-PLATE-01', 
    'Test Company Ltd'
  )
  RETURNING id
),
-- Insert an Invoice linked to that Customer
new_invoice AS (
  INSERT INTO "Invoices" (
    "customerId", 
    plate, 
    services, 
    "totalAmount", 
    "totalTax", 
    "createdAt", 
    "updatedAt"
  )
  SELECT 
    id, 
    'TEST-PLATE-01', 
    ARRAY['Tyre Hotel', 'Wheel Balancing']::text[], 
    99.50, 
    19.90, 
    NOW(), 
    NOW()
  FROM new_customer
  RETURNING id
)
-- Insert a Tyre set linked to that Customer
INSERT INTO "Tyre" (
  "customerId", 
  number, 
  plate, 
  location, 
  "dateStored"
)
SELECT 
  id, 
  '4/Summer', 
  'TEST-PLATE-01', 
  'Rack-A-01', 
  NOW()
FROM new_customer;
