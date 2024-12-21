/*
  # Initial Database Schema

  1. New Tables
    - `products`: Store fruit product information
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `stock_quantity` (integer)
      - `category` (text)
      - `image_url` (text)
      - `organic` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on products table
    - Add policies for:
      - Public read access
      - Authenticated users can create/update products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  stock_quantity integer NOT NULL DEFAULT 0,
  category text,
  image_url text,
  organic boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to create/update products
CREATE POLICY "Authenticated users can create products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);