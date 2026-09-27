-- How the buyer and seller agree to settle. The app does not take payment.

alter table public.books
  add column if not exists payment_arrangement text;

alter table public.books
  drop constraint if exists books_payment_arrangement_check;

alter table public.books
  add constraint books_payment_arrangement_check
  check (
    payment_arrangement is null
    or payment_arrangement in ('A combinar', 'Transferência', 'Dinheiro')
  );
