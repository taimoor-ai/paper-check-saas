import os
from supabase import create_client, Client
from dotenv import load_dotenv
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # ← add this

# Regular client — used for auth (respects RLS)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Admin client — used for server-side DB operations (bypasses RLS)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)