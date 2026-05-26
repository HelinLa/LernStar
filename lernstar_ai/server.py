import os
import time
import threading
import base64
import json
import urllib.request
from flask import Flask, request, jsonify, render_template, redirect, url_for, send_from_directory
from database import Database
from model_handler import ModelHandler

GROQ_KEY   = "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"
GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions"

LERNPLATTFORM = os.path.join(os.path.dirname(__file__), '..', 'lernplattform')

app     = Flask(__name__)
db      = Database()
handler = ModelHandler()

train_status = {
    "running":  False,
    "progress": 0,
    "message":  "Kein Training aktiv.",
    "done":     False,
    "count":    0,
}

# ── CORS ─────────────────────────────────────────────────────
@app.after_request
def add_cors(response):
    response.headers['Access-Control-Allow-Origin']  = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

# ============================================================
# LERNPLATTFORM FRONTEND
# ============================================================

@app.route("/lernstar")
@app.route("/lernstar/")
def lernstar_app():
    return send_from_directory(LERNPLATTFORM, 'index.html')

@app.route("/lernstar/<path:filename>")
def lernstar_static(filename):
    return send_from_directory(LERNPLATTFORM, filename)

# ============================================================
# ADMIN UI
# ============================================================

@app.route("/")
def index():
    exercises = db.get_all()
    trained   = handler.is_trained()
    return render_template("index.html",
                           exercises=exercises,
                           status=train_status,
                           trained=trained,
                           count=len(exercises))

@app.route("/add", methods=["POST"])
def add_form():
    db.add(
        subject     = request.form.get("subject", "").strip(),
        grade       = request.form.get("grade", "").strip(),
        topic       = request.form.get("topic", "").strip(),
        question    = request.form.get("question", "").strip(),
        answer      = request.form.get("answer", "").strip(),
        explanation = request.form.get("explanation", "").strip(),
        difficulty  = int(request.form.get("difficulty", 1)),
    )
    return redirect(url_for("index"))

@app.route("/delete/<int:ex_id>", methods=["POST"])
def delete_form(ex_id):
    db.delete(ex_id)
    return redirect(url_for("index"))

# ============================================================
# BILD-EXTRAKTION  (Groq Vision → Aufgabendaten)
# ============================================================

VISION_MODELS = [
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "llama-3.2-11b-vision-preview",
    "llama-3.2-90b-vision-preview",
]

def _groq_vision(img_b64, mime, subject, grade, topic):
    prompt = (
        f"Das ist eine Schulaufgabe. Fach: {subject}, Klasse: {grade}, Thema: {topic}. "
        "Lies die Aufgabe aus dem Bild und antworte NUR mit diesem JSON (kein Text drumherum):\n"
        '{"question":"Aufgabenstellung","answer":"Lösung","explanation":"Lösungsweg","difficulty":1}'
        "\n(difficulty: 1=einfach, 2=mittel, 3=schwer)"
    )
    last_err = None
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
                start = content.find("{")
                end   = content.rfind("}") + 1
                if start >= 0 and end > start:
                    return json.loads(content[start:end])
                return {"question": content, "answer": "Siehe Bild", "explanation": "", "difficulty": 1}
        except Exception as e:
            last_err = e
            continue
    raise Exception(str(last_err))


@app.route("/api/save_image", methods=["POST"])
def save_image():
    if "image" not in request.files:
        return jsonify({"error": "Kein Bild hochgeladen."}), 400

    file    = request.files["image"]
    subject = request.form.get("subject", "").strip()
    grade   = request.form.get("grade", "").strip()
    topic   = request.form.get("topic", "").strip()

    if not subject or not grade or not topic:
        return jsonify({"error": "Fach, Klasse und Thema sind erforderlich."}), 400

    img_b64 = base64.b64encode(file.read()).decode()
    mime    = file.mimetype or "image/jpeg"

    try:
        extracted = _groq_vision(img_b64, mime, subject, grade, topic)
    except Exception as e:
        return jsonify({"error": f"Bild konnte nicht ausgelesen werden: {e}"}), 500

    ex_id = db.add(
        subject     = subject,
        grade       = grade,
        topic       = topic,
        question    = extracted.get("question", "?"),
        answer      = extracted.get("answer", "?"),
        explanation = extracted.get("explanation", ""),
        difficulty  = int(extracted.get("difficulty", 1)),
    )

    return jsonify({
        "id":          ex_id,
        "subject":     subject,
        "grade":       grade,
        "topic":       topic,
        "question":    extracted.get("question", "?"),
        "answer":      extracted.get("answer", "?"),
        "explanation": extracted.get("explanation", ""),
    })

# ============================================================
# TRAINING
# ============================================================

@app.route("/api/train", methods=["POST"])
def start_training():
    if train_status["running"]:
        return jsonify({"error": "Training läuft bereits."}), 409

    exercises = db.get_all()
    if len(exercises) < 3:
        return jsonify({"error": "Mindestens 3 Aufgaben erforderlich."}), 400

    def run():
        train_status["running"]  = True
        train_status["done"]     = False
        train_status["progress"] = 0
        train_status["count"]    = len(exercises)
        try:
            from trainer import LernStarTrainer
            LernStarTrainer(exercises, train_status).train()
            train_status["message"]  = "✅ Training abgeschlossen! Modell ist jetzt aktiv."
            train_status["done"]     = True
            handler.reload()
        except Exception as e:
            train_status["message"] = f"❌ Fehler beim Training: {e}"
        finally:
            train_status["running"]  = False
            train_status["progress"] = 100

    threading.Thread(target=run, daemon=True).start()
    return jsonify({"message": "Training gestartet."})

@app.route("/api/status")
def get_status():
    return jsonify(train_status)

# ============================================================
# GROQ HELPER (serverseitig – API-Key bleibt geheim)
# ============================================================

def _groq_request(messages, max_tokens, temperature, model="llama-3.3-70b-versatile"):
    payload = json.dumps({
        "model":       model,
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

# ============================================================
# OPENAI-KOMPATIBLER CHAT-ENDPOINT
# Reihenfolge: (1) eigenes trainiertes Modell → (2) Groq
# ============================================================

@app.route("/v1/chat/completions", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return "", 204

    data     = request.get_json(force=True)
    messages = data.get("messages", [])
    max_tok  = int(data.get("max_tokens", 600))
    temp     = float(data.get("temperature", 0.7))

    user_msg = next(
        (m["content"] for m in reversed(messages) if m.get("role") == "user"),
        ""
    )
    if not user_msg:
        return jsonify({"error": {"message": "Keine Benutzernachricht."}}), 400

    # 1. Eigenes trainiertes Modell
    if handler.is_trained():
        try:
            prompt = f"Frage: {user_msg}\nAntwort:"
            answer = handler.generate(prompt, max_new_tokens=max_tok, temperature=temp)
            return jsonify({
                "id":      f"lernstar-{int(time.time())}",
                "object":  "chat.completion",
                "model":   "lernstar-finetuned",
                "choices": [{"index": 0,
                             "message": {"role": "assistant", "content": answer},
                             "finish_reason": "stop"}],
                "usage":   {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
            })
        except Exception:
            pass  # weiter zu Groq

    # 2. Groq (serverseitig – API-Key nie im Browser sichtbar)
    try:
        result = _groq_request(messages, max_tok, temp)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": {"message": f"KI nicht verfügbar: {e}"}}), 503

# ============================================================
# MODELLE-LISTE
# ============================================================

@app.route("/v1/models")
def models():
    return jsonify({
        "data": [{"id": "lernstar-finetuned", "object": "model"}]
    })

# ============================================================
# START
# ============================================================

if __name__ == "__main__":
    print("=" * 55)
    print("  LernStar AI Server")
    print("=" * 55)
    print("  Lernplattform: http://localhost:5000/lernstar")
    print("  Admin:         http://localhost:5000")
    print("  API:           http://localhost:5000/v1/chat/completions")
    print("=" * 55)
    app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False)
