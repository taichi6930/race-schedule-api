-- Populate place_id with id without last 2 characters for existing rows
UPDATE race
SET place_id = substr(id, 1, length(id) - 2)
WHERE (place_id IS NULL OR place_id = '') AND length(id) > 2;
