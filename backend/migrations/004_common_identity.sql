-- The former garment categories remain valid historical data; preserve resource descriptions and bookings.
UPDATE resources SET category=CASE category WHEN 'embroidery' THEN 'tools' WHEN 'sewing' THEN 'creative' WHEN 'cutting' THEN 'spaces' ELSE category END;
-- Only the five explicitly fictional demo identities are renamed. Keep passwords and IDs intact.
UPDATE users SET email=replace(email,'@knitwork.test','@common.test')
WHERE email IN ('asha@knitwork.test','ravi@knitwork.test','manager@knitwork.test','owner@knitwork.test','admin@knitwork.test')
AND NOT EXISTS (SELECT 1 FROM users other WHERE other.email=replace(users.email,'@knitwork.test','@common.test'));
DELETE FROM help_docs WHERE title='Booking equipment';
