-- Add block_name column to plan_exercises
-- Stores the top-level exercise block (e.g. "MUSCLE UP", "SKILLS", "BÁSICOS")
-- Run this in Supabase SQL Editor

ALTER TABLE plan_exercises ADD COLUMN IF NOT EXISTS block_name text;
