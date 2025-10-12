-- Placeholder migration to match remote migration history entry 20251012 (2/3)
-- Non-destructive no-op to reconcile local repo with remote migration table
DO $$ BEGIN
  PERFORM 1;
END $$;
