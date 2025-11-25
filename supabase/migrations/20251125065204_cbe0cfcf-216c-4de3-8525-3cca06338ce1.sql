-- Create users table
CREATE TABLE public.users (
  id TEXT PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  balance DECIMAL(10, 2) DEFAULT 0,
  referral_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  pack_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  total_return DECIMAL(10, 2) NOT NULL,
  upi_id TEXT,
  payment_screenshot TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table for app-wide configurations
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default QR code setting
INSERT INTO public.app_settings (setting_key, setting_value) 
VALUES ('payment_qr', NULL);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Users can view all users (needed for admin panel and referrals)
CREATE POLICY "Users can view all users"
ON public.users FOR SELECT
USING (true);

-- Users can update their own data
CREATE POLICY "Users can update own data"
ON public.users FOR UPDATE
USING (id = current_setting('app.current_user_id', true));

-- Allow insert for new users (signup)
CREATE POLICY "Allow user creation"
ON public.users FOR INSERT
WITH CHECK (true);

-- RLS Policies for orders table
-- Users can view their own orders
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (user_id = current_setting('app.current_user_id', true) OR current_setting('app.is_admin', true)::boolean);

-- Users can create their own orders
CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT
WITH CHECK (user_id = current_setting('app.current_user_id', true));

-- Only admin can update orders
CREATE POLICY "Admin can update orders"
ON public.orders FOR UPDATE
USING (current_setting('app.is_admin', true)::boolean);

-- RLS Policies for app_settings
-- Everyone can read settings
CREATE POLICY "Everyone can read settings"
ON public.app_settings FOR SELECT
USING (true);

-- Only admin can update settings
CREATE POLICY "Admin can update settings"
ON public.app_settings FOR UPDATE
USING (current_setting('app.is_admin', true)::boolean);

-- Create indexes for better performance
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_users_phone ON public.users(phone);