#!/usr/bin/env python
import os
import shutil
from flask import Flask, send_file, jsonify, request
from flask_cors import CORS, cross_origin
from werkzeug import secure_filename
import base64
import deblur
import subprocess


image_shape = (256, 256, 3)
ngf = 64
n_blocks_gen = 9
channels = 3


UPLOAD_FOLDER = './uploads/A'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
cors = CORS(app, resources={r"/": {"origins": "*", "Access-Control-Allow-Origin": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/', methods=['GET'])
def test():
    return "Hello"

@app.route('/image', methods=['GET'])
@cross_origin(origins='*', send_wildcard=True)
def get_img():
  with open("pic.jpg", "rb") as img_file:
    img_string = base64.b64encode(img_file.read())

  return img_string

@app.route('/deblur', methods=['POST'])
@cross_origin(origins='*', send_wildcard=True)
def deblur_img():
  print('\t***deblur_img')

  if 'image' not in request.files:
    return "Where be z image?"

  shutil.rmtree(UPLOAD_FOLDER)
  os.mkdir(UPLOAD_FOLDER)
  img = request.files['image']
  img_name = secure_filename(img.filename)
  img_dir = UPLOAD_FOLDER + '/' + img_name
  img.save(img_dir)

  # deblur_img = deblur.deblur_image('./uploads', 1)
  print('calling deblur')
  subprocess.call(['python', 'deblur.py'])
  print('after deblur')

  deblur_name = './result/' + img_name

  with open(deblur_name, 'rb') as img:
    img_string = base64.b64encode(img.read())

  return img_string


if __name__ == '__main__':
  app.run(debug=True, use_reloader=False, port=5000)