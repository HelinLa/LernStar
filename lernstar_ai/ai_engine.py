"""
LernStar AI Engine
==================
Retrieval-basierte KI – lernt aus jeder gespeicherten Aufgabe.
Keine externen APIs, kein Training nötig. Wird mit jeder Aufgabe klüger.
"""

import random
import re


class LernStarAI:

    # ── KI-Stärke-Level ──────────────────────────────────────
    LEVELS = [
        (0,   "Noch kein Training",  0,   "#9CA3AF"),
        (1,   "Anfänger",           12,   "#F59E0B"),
        (6,   "Lernend",            28,   "#F97316"),
        (15,  "Fortgeschritten",    48,   "#3B82F6"),
        (30,  "Gut",               68,   "#8B5CF6"),
        (60,  "Sehr Gut",          84,   "#7C3AED"),
        (100, "Experte",           100,  "#059669"),
    ]

    def __init__(self, db):
        self.db = db

    # ── ÖFFENTLICHE API ───────────────────────────────────────

    def generate_mc(self, subject=None, grade=None, topic=None, difficulty=2):
        """Generiert eine Multiple-Choice-Aufgabe als dict."""
        # Suche vom spezifischsten zum allgemeinsten
        for s, g, t, d in [
            (subject, grade, topic,   difficulty),
            (subject, grade, topic,   None),
            (subject, grade, None,    difficulty),
            (subject, grade, None,    None),
            (subject, None,  None,    None),
            (None,    None,  None,    None),
        ]:
            pool = self._find(s, g, t, d)
            if pool:
                break

        if not pool:
            return None

        base = random.choice(pool)
        return self._to_mc(base, pool)

    def is_ready(self):
        """KI ist sofort einsatzbereit sobald ≥1 Aufgabe vorhanden ist."""
        return self.db.count() > 0

    def strength(self):
        """Gibt (label, percent, color, count, next_threshold) zurück."""
        n = self.db.count()
        label, pct, color = "Noch kein Training", 0, "#9CA3AF"
        next_threshold = 1
        for i, (threshold, lbl, percent, col) in enumerate(self.LEVELS):
            if n >= threshold:
                label, pct, color = lbl, percent, col
                # Nächstes Level
                if i + 1 < len(self.LEVELS):
                    next_threshold = self.LEVELS[i + 1][0]
                else:
                    next_threshold = None
        return label, pct, color, n, next_threshold

    def topic_stats(self):
        """Gibt Aufgabenanzahl pro (Fach, Klasse, Thema) zurück."""
        stats = {}
        for ex in self.db.get_all():
            key = (ex["subject"], ex["grade"], ex["topic"])
            stats[key] = stats.get(key, 0) + 1
        return stats

    # ── INTERNE LOGIK ─────────────────────────────────────────

    def _find(self, subject, grade, topic, difficulty):
        """Findet passende Aufgaben mit fuzzy Matching."""
        kws = [w.lower() for w in (topic or "").split() if len(w) > 2]
        results = []

        for ex in self.db.get_all():
            # Klasse
            if grade and str(ex.get("grade", "")) != str(grade):
                continue
            # Schwierigkeit
            if difficulty is not None and ex.get("difficulty", 1) != difficulty:
                continue
            # Fach (enthält-Prüfung)
            if subject:
                s1 = subject.lower()
                s2 = ex["subject"].lower()
                if s1 not in s2 and s2 not in s1:
                    continue
            # Thema (Schlüsselwort-Matching)
            if kws:
                topic_ex = ex.get("topic", "").lower()
                q_ex     = ex.get("question", "").lower()
                if not any(kw in topic_ex or kw in q_ex for kw in kws):
                    continue
            results.append(ex)

        return results

    def _to_mc(self, base, pool):
        """Wandelt eine gespeicherte Aufgabe in ein Multiple-Choice-Format um."""
        correct = str(base.get("answer", "")).strip()
        wrongs  = self._generate_wrongs(correct, base, pool)

        options = [correct] + wrongs[:3]
        while len(options) < 4:
            options.append(["A", "B", "C", "D"][len(options)])
        options = options[:4]
        random.shuffle(options)
        correct_idx = options.index(correct)

        return {
            "title":       base.get("topic", "Aufgabe"),
            "question":    base.get("question", ""),
            "options":     [str(o) for o in options],
            "correct":     correct_idx,
            "explanation": base.get("explanation", ""),
            "hint":        self._hint(base),
        }

    def _generate_wrongs(self, correct, base, pool):
        """Erzeugt 3 plausible Falschantworten."""
        # Zuerst: numerische Varianten (für Mathe)
        numeric = self._numeric_wrongs(correct)
        if len(numeric) >= 3:
            return numeric[:3]

        # Dann: Antworten anderer Aufgaben im Pool
        others = []
        for ex in pool:
            ans = str(ex.get("answer", "")).strip()
            if ans and ans != correct:
                others.append(ans)
        random.shuffle(others)

        combined = numeric + others
        seen, result = {correct}, []
        for o in combined:
            if o not in seen:
                seen.add(o)
                result.append(o)
            if len(result) >= 3:
                break

        # Fallback-Füller
        fallback = ["Keine dieser Antworten", "Nicht berechenbar", "Unmöglich"]
        while len(result) < 3:
            result.append(fallback[len(result)])

        return result[:3]

    def _numeric_wrongs(self, val_str):
        """Erzeugt falsche Zahlen in der Nähe der richtigen Antwort."""
        match = re.search(r"-?\d+([.,]\d+)?", val_str)
        if not match:
            return []
        try:
            val = float(match.group().replace(",", "."))
        except ValueError:
            return []

        use_comma = "," in val_str
        is_int    = (val == int(val)) and "." not in val_str and "," not in val_str
        results   = []

        if is_int:
            v = int(val)
            for delta in [1, -1, 2, -2, 5, -5, 10]:
                c = v + delta
                if c > 0 and c != v:
                    results.append(str(c))
                if len(results) >= 3:
                    break
        else:
            for delta in [0.5, 1.0, -0.5, 1.5, 2.0, -1.0]:
                c = round(val + delta, 2)
                if c > 0 and c != val:
                    s = str(c).replace(".", ",") if use_comma else str(c)
                    results.append(s)
                if len(results) >= 3:
                    break

        return results[:3]

    def _hint(self, ex):
        expl  = ex.get("explanation", "")
        topic = ex.get("topic", "")
        if expl:
            first = re.split(r"[.!?]", expl)[0].strip()
            return (first[:100] + "…") if len(first) > 100 else first + "."
        return f"Denke an das Thema {topic}." if topic else "Überprüfe deine Rechnung."
