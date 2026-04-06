-- Add admin_note column to plans table
-- Run this in Supabase SQL Editor

ALTER TABLE plans ADD COLUMN IF NOT EXISTS admin_note text;
