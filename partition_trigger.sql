DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'chapter_partition_trigger'
  ) THEN
    CREATE OR REPLACE FUNCTION chapter_partition_trigger()
    RETURNS TRIGGER AS $$
    BEGIN
      RAISE NOTICE 'Attempting to create partition for story_id: %', NEW.story_id;
      IF NOT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'Chapter_' || NEW.story_id
      ) THEN
        EXECUTE format(
          'CREATE TABLE "Chapter_%s" PARTITION OF "Chapter" FOR VALUES IN (%s)',
          NEW.story_id, NEW.story_id
        );
        RAISE NOTICE 'Partition Chapter_% created for story_id: %', NEW.story_id, NEW.story_id;
      ELSE
        RAISE NOTICE 'Partition Chapter_% already exists for story_id: %', NEW.story_id, NEW.story_id;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.triggers
    WHERE trigger_name = 'chapter_partition_trigger' AND event_object_table = 'Chapter'
  ) THEN
    CREATE TRIGGER chapter_partition_trigger
    BEFORE INSERT ON "Chapter"
    FOR EACH ROW EXECUTE FUNCTION chapter_partition_trigger();
    RAISE NOTICE 'Trigger chapter_partition_trigger created successfully';
  ELSE
    RAISE NOTICE 'Trigger chapter_partition_trigger already exists';
  END IF;
END;
$$;