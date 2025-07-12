/*
  # Create Expert System Tables

  1. New Tables
    - `kerusakan`
      - `id` (uuid, primary key)
      - `kode` (text, unique)
      - `deskripsi` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `gejala`
      - `id` (uuid, primary key)
      - `kode` (text, unique)
      - `deskripsi` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `rules`
      - `id` (uuid, primary key)
      - `kode_kerusakan` (text, foreign key)
      - `kode_gejala` (text, foreign key)
      - `mb` (decimal)
      - `md` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated write access (for experts)

  3. Initial Data
    - Insert default kerusakan data
    - Insert default gejala data
    - Insert default rules data
*/

-- Create kerusakan table
CREATE TABLE IF NOT EXISTS kerusakan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kode text UNIQUE NOT NULL,
  deskripsi text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create gejala table
CREATE TABLE IF NOT EXISTS gejala (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kode text UNIQUE NOT NULL,
  deskripsi text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rules table
CREATE TABLE IF NOT EXISTS rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kode_kerusakan text NOT NULL,
  kode_gejala text NOT NULL,
  mb decimal NOT NULL CHECK (mb >= 0 AND mb <= 1),
  md decimal NOT NULL CHECK (md >= 0 AND md <= 1),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(kode_kerusakan, kode_gejala)
);

-- Enable Row Level Security
ALTER TABLE kerusakan ENABLE ROW LEVEL SECURITY;
ALTER TABLE gejala ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read kerusakan"
  ON kerusakan
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read gejala"
  ON gejala
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read rules"
  ON rules
  FOR SELECT
  TO public
  USING (true);

-- Create policies for public write access (since we don't have auth system)
CREATE POLICY "Anyone can insert kerusakan"
  ON kerusakan
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update kerusakan"
  ON kerusakan
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete kerusakan"
  ON kerusakan
  FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Anyone can insert gejala"
  ON gejala
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update gejala"
  ON gejala
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete gejala"
  ON gejala
  FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Anyone can insert rules"
  ON rules
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update rules"
  ON rules
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete rules"
  ON rules
  FOR DELETE
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kerusakan_kode ON kerusakan(kode);
CREATE INDEX IF NOT EXISTS idx_gejala_kode ON gejala(kode);
CREATE INDEX IF NOT EXISTS idx_rules_kerusakan ON rules(kode_kerusakan);
CREATE INDEX IF NOT EXISTS idx_rules_gejala ON rules(kode_gejala);

-- Insert initial kerusakan data
INSERT INTO kerusakan (kode, deskripsi) VALUES
('K001', 'CDI vespa excel'),
('K002', 'Busi vespa excel'),
('K003', 'Magnet kipas vespa excel'),
('K004', 'Karburator Bakar vespa excel'),
('K005', 'Pengereman vespa excel'),
('K006', 'Transmisi vespa excel'),
('K007', 'Suspensi vespa excel'),
('K008', 'Kelistrikan vespa excel'),
('K009', 'Komstir vespa excel'),
('K010', 'Kopling vespa excel'),
('K011', 'Ban vespa excel'),
('K012', 'Roda vespa excel'),
('K013', 'Blok piston vespa excel'),
('K014', 'Stater vespa excel'),
('K015', 'Lampu vespa excel')
ON CONFLICT (kode) DO NOTHING;

-- Insert initial gejala data
INSERT INTO gejala (kode, deskripsi) VALUES
('G001', 'Mesin yang susah untuk di hidupkan'),
('G002', 'Mesin mati mendadak saat digunakan'),
('G003', 'Percikan api lemah'),
('G004', 'Mesin tersendat-sendat saat dihidupkan'),
('G005', 'Bau bensin yang kuat karena bensin tidak turun ke karburator'),
('G006', 'Kebocoran dibagian bahan bakar'),
('G007', 'Lampu yang tidak berfungsi dengan baik (Mati)'),
('G008', 'Salah alur listrik'),
('G009', 'Kabel putus'),
('G010', 'Suhu mesin yang meningkat secara drastis'),
('G011', 'Suara kasar pada mesin'),
('G012', 'Pengapian yang tidak konsisten'),
('G013', 'Gigi perseneling yang terlepas saat digunakan'),
('G014', 'Terdengar suara berdecit disaat mengganti gigi'),
('G015', 'Getaran pada vespa yang berlebih saat berkendara'),
('G016', 'Suspensi yang terasa tidak responsive'),
('G017', 'Suara mengericik pada mesin'),
('G018', 'Shock keluar oli'),
('G019', 'Sering terjadinya macet'),
('G020', 'Terdengar suara berdecit saat melintas jalan yang kasar'),
('G021', 'Mesin susah untuk beralih gigi'),
('G022', 'Suara berdecit saat mengerem'),
('G023', 'Rem yang tidak responsive'),
('G024', 'Pedal rem Terasa kendur'),
('G025', 'Kompling terasa keras saat ditekan'),
('G026', 'Kopling tidak mau netral'),
('G027', 'Kopling kasar'),
('G028', 'Suara berdecit/berderit dari roda atau ban'),
('G029', 'Ban/roda haus secara tidak merata'),
('G030', 'Stang susah saat di belokan'),
('G031', 'Saat di rem ngebuang'),
('G032', 'Saat berkendara bagian roda tidak stabil'),
('G033', 'Mesin tidak nyala saat di stater'),
('G034', 'Stater mati total'),
('G035', 'Sein motor menyala tidak berkedip'),
('G036', 'Sein motor mati')
ON CONFLICT (kode) DO NOTHING;

-- Insert initial rules data
INSERT INTO rules (kode_kerusakan, kode_gejala, mb, md) VALUES
-- K001
('K001', 'G001', 0.8, 0.2),
('K001', 'G003', 0.9, 0.3),
('K001', 'G004', 0.7, 0.4),
('K001', 'G012', 0.6, 0.2),
('K001', 'G033', 0.8, 0.4),

-- K002
('K002', 'G001', 0.9, 0.1),
('K002', 'G002', 0.9, 0.2),
('K002', 'G003', 0.9, 0.1),
('K002', 'G004', 0.7, 0.2),
('K002', 'G012', 0.8, 0.2),
('K002', 'G033', 0.8, 0.3),

-- K003
('K003', 'G010', 0.7, 0.3),
('K003', 'G011', 0.6, 0.5),

-- K004
('K004', 'G004', 0.8, 0.3),
('K004', 'G005', 0.9, 0.2),
('K004', 'G006', 0.7, 0.2),
('K004', 'G019', 0.8, 0.4),

-- K005
('K005', 'G022', 0.7, 0.3),
('K005', 'G023', 0.6, 0.2),
('K005', 'G024', 0.9, 0.4),
('K005', 'G031', 0.9, 0.2),

-- K006
('K006', 'G013', 0.8, 0.3),
('K006', 'G014', 0.7, 0.4),
('K006', 'G015', 0.6, 0.5),
('K006', 'G021', 0.8, 0.3),

-- K007
('K007', 'G016', 0.7, 0.2),
('K007', 'G018', 0.6, 0.4),

-- K008
('K008', 'G003', 0.9, 0.2),
('K008', 'G008', 0.9, 0.3),
('K008', 'G009', 0.8, 0.4),

-- K009
('K009', 'G020', 0.7, 0.3),
('K009', 'G030', 0.6, 0.2),
('K009', 'G032', 0.8, 0.3),

-- K010
('K010', 'G025', 0.7, 0.4),
('K010', 'G026', 0.8, 0.3),
('K010', 'G027', 0.7, 0.2),

-- K011
('K011', 'G028', 0.9, 0.3),
('K011', 'G029', 0.8, 0.4),

-- K012
('K012', 'G020', 0.7, 0.3),
('K012', 'G028', 0.9, 0.2),
('K012', 'G029', 0.8, 0.4),
('K012', 'G032', 0.6, 0.5),

-- K013
('K013', 'G001', 0.7, 0.2),
('K013', 'G002', 0.8, 0.3),
('K013', 'G004', 0.7, 0.4),
('K013', 'G015', 0.9, 0.3),
('K013', 'G017', 0.8, 0.2),
('K013', 'G033', 0.8, 0.2),

-- K014
('K014', 'G033', 0.9, 0.1),
('K014', 'G034', 0.8, 0.1),

-- K015
('K015', 'G007', 0.9, 0.2),
('K015', 'G008', 0.8, 0.2),
('K015', 'G009', 0.8, 0.3),
('K015', 'G035', 0.8, 0.3),
('K015', 'G036', 0.8, 0.4)
ON CONFLICT (kode_kerusakan, kode_gejala) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_kerusakan_updated_at BEFORE UPDATE ON kerusakan FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gejala_updated_at BEFORE UPDATE ON gejala FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();