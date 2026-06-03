/**
 * LernStar AI Engine – läuft komplett im Browser
 * Speichert Aufgaben in localStorage, keine Server nötig.
 * Wird mit jeder neuen Aufgabe automatisch klüger.
 */
class LernStarAI {

  static KEY = 'ls_exercises';

  static LEVELS = [
    [0,   'Noch kein Training',  0,   '#9CA3AF'],
    [1,   'Anfänger',           12,   '#F59E0B'],
    [6,   'Lernend',            28,   '#F97316'],
    [15,  'Fortgeschritten',    48,   '#3B82F6'],
    [30,  'Gut',               68,   '#8B5CF6'],
    [60,  'Sehr Gut',          84,   '#7C3AED'],
    [100, 'Experte',           100,  '#059669'],
  ];

  // ── Datenverwaltung ───────────────────────────────────────

  static getAll() {
    try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); }
    catch { return []; }
  }

  static save(ex) {
    const all = this.getAll();
    const id  = Date.now();
    all.unshift({ ...ex, id, created_at: new Date().toISOString() });
    localStorage.setItem(this.KEY, JSON.stringify(all));
    return id;
  }

  static remove(id) {
    const all = this.getAll().filter(e => e.id !== id);
    localStorage.setItem(this.KEY, JSON.stringify(all));
  }

  static count() { return this.getAll().length; }

  // ── KI-Stärke ─────────────────────────────────────────────

  static strength() {
    const n = this.count();
    let label = 'Noch kein Training', pct = 0, color = '#9CA3AF', next = 1;
    for (let i = 0; i < this.LEVELS.length; i++) {
      const [threshold, lbl, percent, col] = this.LEVELS[i];
      if (n >= threshold) {
        label = lbl; pct = percent; color = col;
        next  = i + 1 < this.LEVELS.length ? this.LEVELS[i + 1][0] : null;
      }
    }
    return { label, pct, color, count: n, next };
  }

  // ── Aufgaben-Generierung ──────────────────────────────────

  static generateMC(subject, grade, topic, difficulty = 2) {
    // Suche vom spezifischsten zum allgemeinsten
    const tries = [
      [subject, grade, topic,   difficulty],
      [subject, grade, topic,   null],
      [subject, grade, null,    null],
      [subject, null,  null,    null],
      [null,    null,  null,    null],
    ];
    let pool = [];
    for (const [s, g, t, d] of tries) {
      pool = this._find(s, g, t, d);
      if (pool.length) break;
    }
    if (!pool.length) return null;

    const base = pool[Math.floor(Math.random() * pool.length)];
    return this._toMC(base, pool);
  }

  // ── Themen-Statistik ──────────────────────────────────────

  static topicStats() {
    const stats = {};
    for (const ex of this.getAll()) {
      const key = `${ex.subject}||${ex.grade}||${ex.topic}`;
      stats[key] = (stats[key] || 0) + 1;
    }
    return stats;
  }

  // ── Interne Methoden ──────────────────────────────────────

  static _find(subject, grade, topic, difficulty) {
    const kws = (topic || '').split(/\s+/)
      .filter(w => w.length > 2).map(w => w.toLowerCase());

    return this.getAll().filter(ex => {
      if (grade !== null && grade !== undefined &&
          String(ex.grade) !== String(grade)) return false;
      if (difficulty !== null && difficulty !== undefined &&
          Number(ex.difficulty) !== Number(difficulty)) return false;
      if (subject) {
        const s1 = subject.toLowerCase(), s2 = (ex.subject || '').toLowerCase();
        if (!s1.includes(s2) && !s2.includes(s1)) return false;
      }
      if (kws.length) {
        const t = (ex.topic    || '').toLowerCase();
        const q = (ex.question || '').toLowerCase();
        if (!kws.some(kw => t.includes(kw) || q.includes(kw))) return false;
      }
      return true;
    });
  }

  static _toMC(base, pool) {
    const correct = String(base.answer || '').trim();
    const wrongs  = this._wrongs(correct, pool);

    const opts = [correct, ...wrongs.slice(0, 3)];
    while (opts.length < 4) opts.push(['A','B','C','D'][opts.length]);
    opts.length = 4;

    // Fisher-Yates shuffle
    for (let i = 3; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }

    return {
      title:       base.topic       || 'Aufgabe',
      question:    base.question    || '',
      options:     opts,
      correct:     opts.indexOf(correct),
      explanation: base.explanation || '',
      hint:        this._hint(base),
    };
  }

  static _wrongs(correct, pool) {
    const numeric = this._numericWrongs(correct);
    if (numeric.length >= 3) return numeric;

    const others = pool
      .map(e => String(e.answer || '').trim())
      .filter(a => a && a !== correct)
      .sort(() => Math.random() - 0.5);

    const seen = new Set([correct]);
    const result = [...numeric];
    for (const o of others) {
      if (!seen.has(o)) { seen.add(o); result.push(o); }
      if (result.length >= 3) break;
    }
    const fallback = ['Keine dieser Antworten', 'Nicht berechenbar', 'Unmöglich'];
    while (result.length < 3) result.push(fallback[result.length]);
    return result;
  }

  static _numericWrongs(val) {
    const m = val.match(/-?\d+([.,]\d+)?/);
    if (!m) return [];
    const num = parseFloat(m[0].replace(',', '.'));
    if (isNaN(num)) return [];
    const useComma = val.includes(',');
    const isInt    = Number.isInteger(num) && !val.includes('.') && !val.includes(',');
    const results  = [];

    if (isInt) {
      for (const d of [1, -1, 2, -2, 5, -5, 10]) {
        const c = num + d;
        if (c > 0 && c !== num) results.push(String(c));
        if (results.length >= 3) break;
      }
    } else {
      for (const d of [0.5, 1.0, -0.5, 1.5, 2.0]) {
        const c = Math.round((num + d) * 100) / 100;
        if (c > 0 && c !== num) {
          results.push(useComma ? String(c).replace('.', ',') : String(c));
        }
        if (results.length >= 3) break;
      }
    }
    return results;
  }

  static _hint(ex) {
    const expl  = ex.explanation || '';
    const topic = ex.topic       || '';
    if (expl) {
      const first = expl.split(/[.!?]/)[0].trim();
      return first.length > 100 ? first.slice(0, 100) + '…' : first + '.';
    }
    return topic ? `Denke an das Thema ${topic}.` : 'Überprüfe deine Rechnung.';
  }
}
