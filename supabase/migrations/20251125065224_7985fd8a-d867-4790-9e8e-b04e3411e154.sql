-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Allow user creation" ON public.users;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;
DROP POLICY IF EXISTS "Everyone can read settings" ON public.app_settings;
DROP POLICY IF EXISTS "Admin can update settings" ON public.app_settings;

-- Create simpler policies for demo app
-- Users table - allow all operations
CREATE POLICY "Allow all on users"
ON public.users FOR ALL
USING (true)
WITH CHECK (true);

-- Orders table - allow all operations
CREATE POLICY "Allow all on orders"
ON public.orders FOR ALL
USING (true)
WITH CHECK (true);

-- Settings table - allow all operations
CREATE POLICY "Allow all on settings"
ON public.app_settings FOR ALL
USING (true)
WITH CHECK (true);