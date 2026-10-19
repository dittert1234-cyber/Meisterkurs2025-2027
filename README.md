# Anwesenheits-App – repariertes Paket

## Dateien
GitHub Pages benötigt die Dateien im selben Verzeichnis: `index.html`, `app.js`, `style.css`, `service-worker.js`, `manifest.webmanifest`, `icon.svg`. Die SQL-Migration liegt zur Dokumentation bei.

## Vor dem Hochladen
1. In Supabase ein Datenbank-Backup erstellen.
2. Falls noch nicht geschehen, `SUPABASE_MIGRATION_GEMEINSAME_KORREKTUR.sql` einmal im SQL-Editor des verwendeten Projekts ausführen.
3. Alle Paketdateien ins GitHub-Pages-Verzeichnis hochladen und bestehende Dateien ersetzen.
4. App auf Computer und iPhone neu laden. Falls eine alte Version angezeigt wird, Website-Daten/Service-Worker-Cache für diese App aktualisieren.

## Reparaturen
- Synchronisations-Merge bevorzugt bereits vorhandene Cloud-Zellen (auch explizit leere Einträge) vor einem lokalen Cache.
- Lokale Unterrichtstage werden beim Zusammenführen ergänzt, nicht als Löschsignal für Cloud-Tage interpretiert.
- Der Speicherpfad löscht keine `attendance_days`-Zeilen mehr.
- Anwesenheits-Dropdowns bieten ausschließlich das Teilnehmerkürzel und `–` an; andere historische Werte werden beim lokalen Laden nicht als gültige Auswahl übernommen.
- Die gemeinsame Stundenkorrektur wird über `course_settings` geladen und gespeichert.

## Wichtige Grenzen / noch gemeinsam testen
Die JavaScript-Syntax wurde mit Node.js geprüft. Das ist kein Live-Test gegen das echte Supabase-Projekt und kein vollständiger Browser-/iPhone-Test. Die erste Anmeldung und Synchronisierung bitte mit einem vorherigen Backup testen. Besonders prüfen: ob die SQL-Migration erfolgreich ist, ob RLS-Zugriffe passen und ob Änderungen auf beiden Geräten ankommen.

## Datensicherheit
Es werden keine Cloud-Anwesenheitstage automatisch gelöscht. Dadurch können bewusst entfernte Unterrichtstage in der Cloud bestehen bleiben; das ist absichtlich sicherer als eine Löschung anhand eines möglicherweise veralteten lokalen Monats-Caches.
