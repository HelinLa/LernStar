import os
import re
import time
import threading
import base64
import json
import urllib.request
from flask import Flask, request, jsonify, render_template, redirect, url_for, send_from_directory
from database import Database
from ai_engine import LernStarAI

GROQ_KEY          = "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"
GROQ_URL          = "https://api.groq.com/openai/v1/chat/completions"
LERNPLATTFORM_DIR = os.path.join(os.path.dirname(__file__), "..", "lernplattform")

app = Flask(__name__)
db  = Database()
ai  = LernStarAI(db)

# ── CORS ─────────────────────────────────────────────────────
@app.after_request
def add_cors(response):
    response.headers["Access-Control-Allow-Origin"]  = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

# ============================================================
# LERNPLATTFORM FRONTEND  →  http://localhost:5000/lernstar
# ============================================================

@app.route("/lernstar")
@app.route("/lernstar/")
def lernstar_app():
    return send_from_directory(LERNPLATTFORM_DIR, "index.html")

@app.route("/lernstar/<path:filename>")
def lernstar_static(filename):
    return send_from_directory(LERNPLATTFORM_DIR, filename)

# ============================================================
# ADMIN UI  →  http://localhost:5000
# ============================================================

@app.route("/")
def index():
    label, pct, color, count, next_t = ai.strength()
    topic_stats = ai.topic_stats()
    exercises   = db.get_all()
    return render_template("index.html",
                           exercises=exercises,
                           count=count,
                           ai_label=label,
                           ai_pct=pct,
                           ai_color=color,
                           ai_next=next_t,
                           topic_stats=topic_stats)

@app.route("/delete/<int:ex_id>", methods=["POST"])
def delete_form(ex_id):
    db.delete(ex_id)
    return redirect(url_for("index"))

# ============================================================
# AUFGABE MANUELL SPEICHERN
# ============================================================

@app.route("/api/save_manual", methods=["POST"])
def save_manual():
    data        = request.get_json(force=True)
    subject     = data.get("subject", "").strip()
    grade       = data.get("grade", "").strip()
    topic       = data.get("topic", "").strip()
    question    = data.get("question", "").strip()
    answer      = data.get("answer", "").strip()
    explanation = data.get("explanation", "").strip()
    difficulty  = int(data.get("difficulty", 1))

    if not all([subject, grade, topic, question, answer]):
        return jsonify({"error": "Pflichtfelder fehlen."}), 400

    ex_id = db.add(subject=subject, grade=grade, topic=topic,
                   question=question, answer=answer,
                   explanation=explanation, difficulty=difficulty)

    label, pct, color, count, next_t = ai.strength()
    return jsonify({"id": ex_id, "subject": subject, "grade": grade,
                    "topic": topic, "question": question,
                    "answer": answer, "explanation": explanation,
                    "ai_label": label, "ai_pct": pct, "ai_color": color,
                    "ai_next": next_t, "count": count})

# ============================================================
# BILD-EXTRAKTION  (Groq Vision)
# ============================================================

VISION_MODELS = [
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "llama-3.2-11b-vision-preview",
    "llama-3.2-90b-vision-preview",
]

def _groq_vision(img_b64, mime, subject, grade, topic):
    prompt = (
        f"Schulaufgabe. Fach: {subject}, Klasse: {grade}, Thema: {topic}. "
        "Antworte NUR mit diesem JSON:\n"
        '{"question":"Aufgabenstellung","answer":"Lösung","explanation":"Lösungsweg","difficulty":1}'
        "\n(difficulty: 1=einfach, 2=mittel, 3=schwer)"
    )
    for model in VISION_MODELS:
        try:
            payload = json.dumps({
                "model": model,
                "messages": [{"role": "user", "content": [
                    {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{img_b64}"}},
                    {"type": "text", "text": prompt}
                ]}],
                "max_tokens": 500
            }).encode()
            req = urllib.request.Request(
                GROQ_URL, data=payload,
                headers={"Authorization": f"Bearer {GROQ_KEY}",
                         "Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                data    = json.loads(resp.read())
                content = data["choices"][0]["message"]["content"]
                start   = content.find("{")
                end     = content.rfind("}") + 1
                if start >= 0 and end > start:
                    return json.loads(content[start:end])
                return {"question": content, "answer": "Siehe Bild",
                        "explanation": "", "difficulty": 1}
        except Exception:
            continue
    raise Exception("Bild konnte nicht ausgelesen werden.")

@app.route("/api/save_image", methods=["POST"])
def save_image():
    if "image" not in request.files:
        return jsonify({"error": "Kein Bild hochgeladen."}), 400

    file    = request.files["image"]
    subject = request.form.get("subject", "").strip()
    grade   = request.form.get("grade", "").strip()
    topic   = request.form.get("topic", "").strip()

    if not all([subject, grade, topic]):
        return jsonify({"error": "Fach, Klasse und Thema sind erforderlich."}), 400

    img_b64 = base64.b64encode(file.read()).decode()
    mime    = file.mimetype or "image/jpeg"

    try:
        extracted = _groq_vision(img_b64, mime, subject, grade, topic)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    ex_id = db.add(subject=subject, grade=grade, topic=topic,
                   question=extracted.get("question", "?"),
                   answer=extracted.get("answer", "?"),
                   explanation=extracted.get("explanation", ""),
                   difficulty=int(extracted.get("difficulty", 1)))

    label, pct, color, count, next_t = ai.strength()
    return jsonify({"id": ex_id, "subject": subject, "grade": grade,
                    "topic": topic,
                    "question":    extracted.get("question", "?"),
                    "answer":      extracted.get("answer", "?"),
                    "explanation": extracted.get("explanation", ""),
                    "ai_label": label, "ai_pct": pct, "ai_color": color,
                    "ai_next": next_t, "count": count})

# ============================================================
# BILD-CHAT  (Herr Lala analysiert ein Bild)
# ============================================================

@app.route("/api/chat_image", methods=["POST", "OPTIONS"])
def chat_image():
    if request.method == "OPTIONS":
        return "", 204
    data     = request.get_json(force=True)
    img_b64  = data.get("image_b64", "")
    mime     = data.get("mime", "image/jpeg")
    question = data.get("question") or "Bitte löse diese Aufgabe Schritt für Schritt auf Deutsch."
    system   = data.get("system", "Du bist Herr Lala, ein freundlicher Lernassistent.")
    history  = data.get("history", [])

    user_content = [
        {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{img_b64}"}},
        {"type": "text", "text": question}
    ]
    messages = [{"role": "system", "content": system}] + history + \
               [{"role": "user", "content": user_content}]

    for model in VISION_MODELS:
        try:
            payload = json.dumps({
                "model": model, "messages": messages,
                "max_tokens": 700, "temperature": 0.7
            }).encode()
            req = urllib.request.Request(
                GROQ_URL, data=payload,
                headers={"Authorization": f"Bearer {GROQ_KEY}",
                         "Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                d = json.loads(resp.read())
                return jsonify({"answer": d["choices"][0]["message"]["content"]})
        except Exception:
            continue
    return jsonify({"error": "Bild-Analyse nicht verfügbar (Vision-Modell nicht erreichbar)."}), 503

# ============================================================
# KI-STATUS
# ============================================================

@app.route("/api/ai_strength")
def ai_strength():
    label, pct, color, count, next_t = ai.strength()
    return jsonify({"label": label, "pct": pct, "color": color,
                    "count": count, "next": next_t})

# ============================================================
# OPENAI-KOMPATIBLER CHAT-ENDPOINT
# Reihenfolge: (1) eigene KI  →  (2) Groq Fallback
# ============================================================

def _parse_request(messages):
    """Extrahiert Fach, Klasse, Thema, Schwierigkeit aus dem Prompt."""
    user_msg = next(
        (m["content"] for m in reversed(messages) if m.get("role") == "user"), ""
    )
    grade_m   = re.search(r"Klasse\s+(\d+)", user_msg)
    subject_m = re.search(r"Klasse\s+\d+\s+(\w+)", user_msg)
    topic_m   = re.search(r"Thema\s+[„\"]?([^\".!\n]+)", user_msg)

    diff = 2
    if "einfach"      in user_msg.lower(): diff = 1
    elif "schwer"     in user_msg.lower(): diff = 3

    return (
        subject_m.group(1) if subject_m else None,
        grade_m.group(1)   if grade_m   else None,
        topic_m.group(1).strip(" \"„"") if topic_m else None,
        diff
    )

def _groq_chat(messages, max_tokens, temperature):
    payload = json.dumps({
        "model":       "llama-3.3-70b-versatile",
        "messages":    messages,
        "max_tokens":  max_tokens,
        "temperature": temperature,
    }).encode()
    req = urllib.request.Request(
        GROQ_URL, data=payload,
        headers={"Authorization": f"Bearer {GROQ_KEY}",
                 "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())

@app.route("/v1/chat/completions", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return "", 204

    data     = request.get_json(force=True)
    messages = data.get("messages", [])
    max_tok  = int(data.get("max_tokens", 600))
    temp     = float(data.get("temperature", 0.7))

    # 1. Eigene KI
    if ai.is_ready():
        subject, grade, topic, difficulty = _parse_request(messages)
        exercise = ai.generate_mc(subject, grade, topic, difficulty)
        if exercise:
            return jsonify({
                "id":      f"lernstar-{int(time.time())}",
                "object":  "chat.completion",
                "model":   "lernstar-eigen",
                "choices": [{
                    "index":         0,
                    "message":       {"role": "assistant",
                                      "content": json.dumps(exercise, ensure_ascii=False)},
                    "finish_reason": "stop"
                }],
                "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
            })

    # 2. Groq Fallback
    try:
        return jsonify(_groq_chat(messages, max_tok, temp))
    except Exception as e:
        return jsonify({"error": {"message": str(e)}}), 503

@app.route("/v1/models")
def models():
    return jsonify({"data": [{"id": "lernstar-eigen", "object": "model"}]})

# ============================================================
# START
# ============================================================

if __name__ == "__main__":
    print("=" * 55)
    print("  LernStar AI Server")
    print("=" * 55)
    print("  Lernplattform : http://localhost:5000/lernstar")
    print("  Admin-Panel   : http://localhost:5000")
    print("  KI-Endpunkt   : http://localhost:5000/v1/chat/completions")
    print("=" * 55)
    app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False)
