from flask import Flask, render_template, request
import json

app = Flask(__name__)

# Function to load images from JSON
def load_images():
    with open("static/config/images.json") as file:
        images = json.load(file)
    return images

@app.route("/", methods=["GET", "POST"])
def index():
    images = load_images()  # Load images once

    selected_background = "classroom.jpg"
    selected_character = None

    if request.method == "POST":
        selected_background = request.form.get("background", "classroom.jpg")
        selected_character = request.form.get("character")

    return render_template("index.html", 
                           backgrounds=images['backgrounds'], 
                           characters=images['characters'], 
                           selected_background=selected_background, 
                           selected_character=selected_character)


if __name__ == "__main__":
    app.run(debug=True)
