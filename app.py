from flask import Flask, render_template, request

app = Flask(__name__)

# ALL IMAGES!
backgrounds = ["classroom.jpg", "cafeteria.jpg", "bathroom.jpg"]
characters = ["jecka_1.png", "nicole_1.png", "jeffery_1.png"]

@app.route("/", methods=["GET", "POST"])
def index():
    selected_background = "classroom.jpg" 
    selected_character = None  

    if request.method == "POST":
        selected_background = request.form.get("background", "classroom.jpg")
        selected_character = request.form.get("character")

    return render_template("index.html", 
                           backgrounds=backgrounds, 
                           characters=characters, 
                           selected_background=selected_background, 
                           selected_character=selected_character)

if __name__ == "__main__":
    app.run(debug=True)