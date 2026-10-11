-- Daily rewrite counters (per user id / hashed IP). Server-only: no client access.
-- Applied to the resume-tailor Supabase project on 2026-10-12.
create table public.usage_quota (
  key text primary key,
  count integer not null default 0 check (count >= 0),
  expires_at timestamptz not null
);

alter table public.usage_quota enable row level security;
revoke all on table public.usage_quota from anon, authenticated;

create or replace function public.quota_incr(p_key text, p_ttl_seconds integer)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_count integer;
begin
  -- Opportunistic cleanup of expired windows.
  delete from public.usage_quota where expires_at < now();

  insert into public.usage_quota (key, count, expires_at)
  values (p_key, 1, now() + make_interval(secs => p_ttl_seconds))
  on conflict (key) do update set count = public.usage_quota.count + 1
  returning count into new_count;

  return new_count;
end;
$$;

create or replace function public.quota_decr(p_key text)
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.usage_quota set count = greatest(count - 1, 0)
  where key = p_key and expires_at >= now();
$$;

create or replace function public.quota_get(p_key text)
returns integer
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce((select count from public.usage_quota where key = p_key and expires_at >= now()), 0);
$$;

revoke execute on function public.quota_incr(text, integer) from public, anon, authenticated;
revoke execute on function public.quota_decr(text) from public, anon, authenticated;
revoke execute on function public.quota_get(text) from public, anon, authenticated;
grant execute on function public.quota_incr(text, integer) to service_role;
grant execute on function public.quota_decr(text) to service_role;
grant execute on function public.quota_get(text) to service_role;
grant all on table public.usage_quota to service_role;
