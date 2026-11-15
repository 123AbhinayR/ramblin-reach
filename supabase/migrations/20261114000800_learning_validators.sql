-- Restricted-search-path pure validators must run with access to their private normalizer.
alter function private.valid_tags(text[],integer) security definer;
alter function public.exchange_overlap(text[],text[]) security definer;
