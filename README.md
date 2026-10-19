# Anwesenheits-App – Supabase-Version

## Enthalten
- `index.html`, `style.css`, `app.js`: App mit Supabase-Anmeldung, Zugangsanfrage, Freigabeprüfung, Cloud-Speichern und Monatsablage.
- `SUPABASE_SETUP.sql`: SQL zum Abgleichen/Einrichten der RLS-Regeln und Hinweise zur ersten Administratorfreigabe.

## Supabase einrichten
1. Öffne das Supabase-Dashboard des Projekts `yfkijeyujeclgupjfkdi`.
2. Unter Authentication die E-Mail-Bestätigungseinstellung prüfen. Wenn sie aktiv ist, muss ein neuer Nutzer erst die Bestätigungs-E-Mail anklicken.
3. Führe `SUPABASE_SETUP.sql` im SQL Editor aus. Das Skript setzt voraus, dass die Tabellen und Funktionen aus den vorigen Schritten schon angelegt sind.
4. Registriere dein eigenes Konto über die App und bestätige ggf. die E-Mail.
5. Öffne Authentication → Users und kopiere die Konto-E-Mail. Führe danach den auskommentierten Admin-Bootstrap aus dem SQL-Skript separat aus, nachdem du deine E-Mail eingesetzt hast. Nur dein eigenes Konto zum Admin machen.
6. Für neue Teilnehmer: Sie wählen in der App „Zugang anfordern“. Nach Registrierung und ggf. E-Mail-Bestätigung erscheint das Profil unter Table Editor → `app_profiles`. Setze bei der passenden Zeile `approved` auf `true` und speichere. Damit erhält der Teilnehmer Zugriff auf die gemeinsame Anwesenheitsliste.
7. Lade diese Dateien zu GitHub Pages hoch.

## Speichern / Aktualisieren
- `Speichern` schreibt Teilnehmer und alle im lokalen Browser gespeicherten Monats-Tage in Supabase.
- `Aktualisieren` lädt Teilnehmer und Anwesenheitstage aus Supabase und aktualisiert die Anzeige.
- Die erste Synchronisierung: Auf dem Gerät mit den bisherigen lokalen Daten anmelden und einmal `Speichern` drücken, um diese Daten hochzuladen.

## Hinweise
- Der Publishable-Key ist im Frontend vorgesehen; die Datenbank wird durch Row Level Security geschützt.
- Alle freigegebenen Nutzer dürfen alle Anwesenheitsdaten sehen und bearbeiten – entsprechend deiner Vorgabe.
- Die Daten aus einem Browser werden nicht automatisch hochgeladen, bevor du dich anmeldest und `Speichern` verwendest.
- Die Datenbank speichert Anwesenheit pro Teilnehmer und Datum. Einstellungen für Stunden/Quote verbleiben vorerst lokal im Browser.


## Handy / Startbildschirm
Nach Veröffentlichung über HTTPS: Android (Chrome): Menü → „Installieren“ oder „Zum Startbildschirm hinzufügen“. iPhone (Safari): Teilen → „Zum Home-Bildschirm“. Die App-Oberfläche wird zwischengespeichert; Supabase-Daten benötigen weiterhin Internet.


## Kompakte Monatsansicht
- Der aktuell ausgewählte Monat steht oben und bleibt bearbeitbar.
- Vergangene Monate werden darunter als Ablage angezeigt. „Öffnen / bearbeiten“ lädt den bestehenden Monat, erzeugt keine Kopie.
- Die Teilnehmeranwesenheit ist eine reine Anzeige und zählt die Unterrichtseinheiten aller gespeicherten Monate zusammen.
- Es ist keine zusätzliche SQL-Änderung für die Oberfläche vorgesehen. Die bestehenden Tabellen `course_participants` und `attendance_days` werden weiterverwendet.


### Stundenkorrektur je Teilnehmer
In der Teilnehmerübersicht kann pro Person eine Stundenkorrektur eingetragen werden. Positive Werte (z. B. `5`) addieren Stunden, negative Werte (z. B. `-10`) ziehen Stunden ab. Die korrigierte Stundenzahl und Anwesenheitsquote werden neu berechnet. Die Korrekturen werden im Browser gespeichert und sind unabhängig von den Anwesenheitseinträgen. Für andere Geräte oder Browser müssen sie separat übertragen werden; diese Korrekturen werden nicht automatisch in Supabase synchronisiert.


## Fehlerbehebung Anmeldung (17.10.2026)
- Der Zugriff auf das in der aktuellen HTML-Datei nicht vorhandene Element `useCourseTotal` wurde abgesichert. Ohne dieses Element brach `app.js` vor dem Einrichten des Anmelde-Handlers ab.
- Der Service-Worker-Cache wurde auf `anwesenheit-shell-v3` angehoben, damit Geräte aktualisierte Dateien neu laden.


### PDF-Ausgabe
- Das Kürzel „STS“ wird mit schmalerem Zellinnenabstand und kleinerer Schrift ohne unnötigen Zeilenumbruch ausgegeben.
- Leere Anwesenheitsfelder an eingetragenen Unterrichtstagen werden in der PDF als „X“ dargestellt. Nicht belegte Zusatzspalten bleiben leer.


### Stundenübersicht und Handyansicht
- Beim Aktualisieren mit vorhandenen Supabase-Anwesenheitsdaten werden lokale Monats-Caches ersetzt, damit keine alten Monate auf einzelnen Geräten stehen bleiben.
- Die Teilnehmerübersicht wird auf kleinen Bildschirmen kompakter dargestellt; die Desktop-Regeln bleiben außerhalb des mobilen Breakpoints unverändert.


## Neue gemeinsame Stundenkorrektur (v9)
Vor Veröffentlichung die Datei `SUPABASE_MIGRATION_GEMEINSAME_KORREKTUR.sql` einmal im SQL Editor des aktuellen Supabase-Projekts ausführen. Sie legt die Tabelle `course_settings` mit RLS an, damit die gemeinsame Korrektur geräteübergreifend gespeichert werden kann. Danach die Dateien aus diesem Paket zu GitHub Pages hochladen. Die Anwesenheitsfelder sind nun Dropdowns; vorhandene Fragezeichen werden in der Auswahl als leer angezeigt, aber nicht automatisch aus den gespeicherten historischen Daten gelöscht.


## Backup wiederherstellen (v12)
- „Backup wiederherstellen“ nimmt JSON-Backups im Format `meisterhaft-anwesenheit-backup-v1` an, wie sie die App selbst erstellt.
- Vor dem Import wird zusätzlich ein Backup des aktuellen Browserstands heruntergeladen.
- Nach dem Import auf „Speichern“ klicken. Bei aktiver, freigegebener Supabase-Anmeldung wird zuerst der Cloud-Bestand geladen und zusammengeführt: vorhandene Cloud-Zellen haben Vorrang, lokale Backup-Einträge ergänzen nur Zellen ohne Cloud-Datensatz. Fehlende lokale Unterrichtstage führen nicht zu Cloud-Löschungen.
- Teilnehmer werden anhand KST, Nachname und Vorname zugeordnet. Nicht eindeutig zuordenbare Teilnehmer werden beim Backup-Import ausgelassen und gemeldet.
- Die Wiederherstellung muss mit dem produktiven Supabase-Projekt getestet werden. Vor Nutzung immer ein separates Backup aufbewahren.
