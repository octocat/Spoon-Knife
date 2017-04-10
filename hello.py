from flask import Flask
app = Flask(__name__)


@app.route('/user/<name>/<age>')
def user(name,age):
    return "<h1>hello<h1> world" %name %age

if __name__ == '__main__':
    app.run(debug=True, port=9537)