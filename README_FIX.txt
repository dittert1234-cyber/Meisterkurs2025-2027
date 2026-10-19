Version 12 – Backup wiederherstellen

Die App hat nun eine Schaltfläche „Backup wiederherstellen“ für JSON-Dateien, die von der App selbst erstellt wurden. Nach dem Import bitte „Speichern“ drücken. Die App lädt dann zuerst den aktuellen Supabase-Bestand und führt ihn zusammen: vorhandene Cloud-Zellen bleiben maßgeblich, fehlende Cloud-Einträge werden ergänzt; es werden keine Unterrichtstage aus Supabase gelöscht, nur weil sie lokal fehlen.

Vor dem Import wird zusätzlich ein Backup des aktuellen Browserstands heruntergeladen. Nicht eindeutig zuordenbare Teilnehmer werden beim Import ausgelassen. Die Funktion wurde syntaktisch geprüft, aber nicht mit dem echten Supabase-Projekt live getestet. Vor dem produktiven Einsatz eine separate Sicherung erstellen.
