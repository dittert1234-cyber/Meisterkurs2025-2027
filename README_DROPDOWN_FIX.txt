Änderung in dieser Version:
- Anwesenheitsfelder sind Dropdowns mit ausschließlich zwei Optionen: Gedankenstrich (leer/keine Anwesenheit) oder das jeweilige Teilnehmerkürzel.
- Alte Werte wie ?, /, E, K, U und andere Werte, die nicht dem Kürzel der jeweiligen Person entsprechen, werden beim Laden in leere Felder umgewandelt.
- Die Bereinigung wird lokal gespeichert und beim regulären Supabase-Speichern mit übertragen.
- Service-Worker-Cache wurde geändert, damit Browser die neue App-Datei laden.

Wichtig: Vor Veröffentlichung bitte vorhandene Daten sichern. Nach dem Deploy App einmal vollständig neu laden. Syntax wurde geprüft; ein Live-Test gegen das Supabase-Projekt wurde nicht durchgeführt.
