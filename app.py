from flask import Flask, render_template, request
import json

app = Flask(__name__)

def load_images():
    with open("static/config/images.json") as file:
        images = json.load(file)
    return images

def load_image_counts():
    with open("static/config/people_images.json") as file:
        image_counts = json.load(file)
    return image_counts

@app.route("/", methods=["GET", "POST"])
def index():
    images = load_images()
    image_counts = load_image_counts()

    selected_background = "classroom.jpg"
    selected_character = None

    if request.method == "POST":
        selected_background = request.form.get("background", "classroom.jpg")
        selected_character = request.form.get("character")

    return render_template("index.html",
                           backgrounds=images['backgrounds'],
                           characters=images['characters'],
                           selected_background=selected_background,
                           selected_character=selected_character,
                           image_counts=image_counts)


if __name__ == "__main__":
    app.run(debug=True)
