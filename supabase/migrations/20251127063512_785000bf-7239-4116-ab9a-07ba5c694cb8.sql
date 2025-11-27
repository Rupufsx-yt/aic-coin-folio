-- Create withdrawals table
CREATE TABLE public.withdrawals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'Completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all on withdrawals" 
ON public.withdrawals 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Insert sample withdrawal data for all existing users
INSERT INTO public.withdrawals (user_id, amount, status, created_at)
SELECT id, 50000, 'Completed', now()
FROM public.users;