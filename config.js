/* Połączenie przewodnika z bazą Supabase (własne wpisy z panelu admin.html).
   Wklej tu adres projektu i klucz „anon public” — ten klucz jest publiczny z założenia,
   dostępu do zapisu pilnują reguły RLS (zapis tylko dla zalogowanego redaktora).
   NIGDY nie wklejaj tu klucza service_role.
   Puste wartości = przewodnik pokazuje tylko dane wbudowane (dane.js). */
window.PRZEWODNIK_SUPABASE = {
  url: "https://xxmgpyvbuunsihebnsqo.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4bWdweXZidXVuc2loZWJuc3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5Njk2ODksImV4cCI6MjA5NzU0NTY4OX0.X5-hH2ec_bLqyh_ssLLA5xPsvpiWoAR6CcVgfd0nRxg"
};
