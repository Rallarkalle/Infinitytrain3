# Supabase Database Migration

## 1. Add resource_links column to subtopics table

If you're using Supabase (production), you need to run this SQL command in the Supabase SQL Editor:

```sql
ALTER TABLE subtopics 
ADD COLUMN resource_links TEXT;
```

This adds a new column to store video and document links as JSON for each subtopic.

## 2. Add sort_order column to subtopics table

Run this SQL command to enable drag-and-drop subtopic ordering:

```sql
ALTER TABLE subtopics 
ADD COLUMN sort_order INTEGER DEFAULT 0;
```

This adds a column to maintain the order of subtopics when they are reordered by admins.

## For SQLite (local development)

The SQLite database will automatically create the new columns when you restart the server, or you can delete the `training.db` file to recreate it with the new schema.
