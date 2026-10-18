Anwesenheits-App – Synchronisierung v6 (Prüfstand)

Enthalten:
- Monatliche Anwesenheitsliste und Monatsablage zum späteren Öffnen/Bearbeiten
- Teilnehmerübersicht mit Stunden-/Prozentberechnung und Korrekturfaktor
- Supabase-Anmeldung und gemeinsamer Datenspeicher wie im Ausgangsprojekt
- Neuer Button „Datenbackup herunterladen“ exportiert lokale Anwesenheitsdaten und Einstellungen als JSON
- Beim initialen Laden werden lokale Monatsdaten nicht mehr pauschal gelöscht. Lokale nichtleere Einträge bleiben im Merge erhalten; Cloud-Daten ergänzen fehlende Einträge.
- Service-Worker-Cache auf v6 angehoben

WICHTIG:
Diese Version wurde statisch geprüft (JavaScript-Syntaxprüfung), aber nicht live gegen das Supabase-Projekt getestet. Deshalb bitte vor Veröffentlichung zunächst lokale Daten sichern und die Tests unten durchführen. Kein Code kann hier aus der Ferne bestätigen, dass RLS, Kontofreigabe und echte Datenbankzugriffe im konkreten Projekt funktionieren.

Empfohlene Reihenfolge:
1. Auf dem Gerät mit den vollständigsten Daten zuerst das vorhandene Backup/den lokalen Datenbestand sichern.
2. Erst danach veröffentlichen.
3. Nach Anmeldung prüfen: vorhandene Monate, Teilnehmer, Einträge, neuen Unterrichtstag hinzufügen, ändern, Speichern.
4. Auf dem zweiten Gerät anmelden und kontrollieren, dass dieselben Daten erscheinen.
5. Einen Eintrag auf Gerät B ändern und prüfen, dass er nach erneutem Öffnen auf Gerät A ankommt.

Hinweis zur Konfliktregel:
Beim initialen Zusammenführen haben lokale nichtleere Werte Vorrang vor Cloud-Werten; fehlende lokale Daten werden aus der Cloud ergänzt. Ein bewusstes Leeren eines Feldes ist bei einem Konflikt nicht eindeutig als neuere Änderung erkennbar. Deshalb sind Sicherung und Tests vor dem Produktiveinsatz wichtig.
