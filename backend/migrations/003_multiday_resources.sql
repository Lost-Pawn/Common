-- Extend existing installations without replacing resources or booking history.
ALTER TABLE resources DROP CONSTRAINT resources_max_hours_check;
ALTER TABLE resources ADD CONSTRAINT resources_max_hours_check CHECK(max_hours BETWEEN 1 AND 168);
ALTER TABLE resources DROP CONSTRAINT resources_weekly_hours_check;
ALTER TABLE resources ADD CONSTRAINT resources_weekly_hours_check CHECK(weekly_hours BETWEEN 1 AND 168);
