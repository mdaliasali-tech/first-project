from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
import traceback  # 👈 error details capture karne ke liye

API_KEY = "AIzaSyB9M45xKjkbDYp-fSdTduCQngnfvIta3aI"
genai.configure(api_key=API_KEY)

# Gemini model initialize
model = genai.GenerativeModel("gemini-1.5-flash")

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

@app.route("/")
def index():
    return send_from_directory("static", "front.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_msg = data.get("message", "").strip()

    if not user_msg:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Gemini API call
        response = model.generate_content(user_msg)

        # Safely extract reply
        assistant_text = response.text if response and hasattr(response, "text") else "⚠️ Empty response from Gemini"
        return jsonify({"reply": assistant_text})

    except Exception as e:
        # Print full error in terminal
        print("🔥 Gemini API Error:")
        traceback.print_exc()

        # Return error in JSON too
        return jsonify({
            "error": "Gemini API error",
            "details": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
