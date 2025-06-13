-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "init_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "desc" TEXT,
    "author" TEXT,
    "status" TEXT,
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" SERIAL NOT NULL,
    "init_id" TEXT NOT NULL,
    "story_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id", "story_id")
) PARTITION BY LIST (story_id);

-- CreateIndex
CREATE UNIQUE INDEX "Story_init_id_key" ON "Story"("init_id");

-- Corrected unique index for Chapter
CREATE UNIQUE INDEX "Chapter_init_id_key" ON "Chapter"("init_id", "story_id");

-- Optional: Remove unnecessary index if not needed
-- DROP INDEX "Chapter_story_id_key";

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create function to auto partition Chapter
CREATE OR REPLACE FUNCTION create_chapter_partition()
RETURNS TRIGGER AS $$
DECLARE
    partition_table_name TEXT;
    story_id_value INTEGER;
BEGIN
    story_id_value := NEW.story_id; -- Changed from NEW.id to NEW.story_id
    partition_table_name := 'Chapter_' || story_id_value;

    IF NOT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public' AND tablename = partition_table_name
    ) THEN
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I PARTITION OF "Chapter"
            FOR VALUES IN (%s)', partition_table_name, story_id_value);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on Story table
CREATE TRIGGER trigger_create_chapter_partition
AFTER INSERT ON "Story"
FOR EACH ROW
EXECUTE FUNCTION create_chapter_partition();