#!/usr/bin/env python
import os
import shutil
from flask import Flask, send_file, jsonify, request
from flask_cors import CORS, cross_origin
from werkzeug import secure_filename
import base64
# import super
import subprocess

from PIL import Image


image_shape = (256, 256, 3)
ngf = 64
n_blocks_gen = 9
channels = 3

UPLOAD_FOLDER = './LR'

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
  with open("outputs/bab.png", "rb") as img_file:
    img_string = base64.b64encode(img_file.read())

  return img_string

@app.route('/super', methods=['POST'])
@cross_origin(origins='*', send_wildcard=True)
def super_img():
  print('\t***super_img')

  if 'image' not in request.files:
    return "Where be z image?"

  shutil.rmtree(UPLOAD_FOLDER)
  os.mkdir(UPLOAD_FOLDER)
  img = request.files['image']
  img_name = secure_filename(img.filename)
  img_dir = UPLOAD_FOLDER + '/' + img_name
  img.save(img_dir)

  # deblur_img = deblur.deblur_image('./uploads', 1)
  print('calling super')
  subprocess.call(['python', 'super.py'])
  print('after super')

  deblur_name = './outputs/' + img_name

  with open(deblur_name, 'rb') as img:
    img_string = base64.b64encode(img.read())

  return img_string

@app.route('/super-64', methods=['POST'])
@cross_origin(origins='*', send_wildcard=True)
def super_img_base64():

  if 'image' not in list(request.get_json().keys()):
    return "Where be z image?"

  shutil.rmtree(UPLOAD_FOLDER)
  os.mkdir(UPLOAD_FOLDER)
  img = request.get_json()['image']
  img_name = 'base.png'
  img_dir = UPLOAD_FOLDER + '/' + img_name
  with open(img_dir, 'wb') as f:
    f.write(base64.b64decode(img))

  print('calling super')
  subprocess.call(['python', 'super.py'])
  print('after super')

  super_name = './outputs/' + img_name

  with open(super_name, 'rb') as imgSuper:
    img_string = base64.b64encode(imgSuper.read())

  return img_string


@app.route('/super-resize', methods=['POST'])
@cross_origin(origins='*', send_wildcard=True)
def super_resize():
  print('\t***super_img')

  if 'image' not in request.files:
    return "Where be z image?"

  shutil.rmtree(UPLOAD_FOLDER)
  os.mkdir(UPLOAD_FOLDER)
  img = request.files['image']
  img_name = secure_filename(img.filename)
  img_dir = UPLOAD_FOLDER + '/' + img_name
  img.save(img_dir)

  res_img = Image.open(img_dir)
  w, h = res_img.size
  a = res_img.resize(size=(w*4, h*4))
  a.save('./resize/' + img_name)

  with open('./resize/' + img_name, 'rb') as img:
    res_string = base64.b64encode(img.read())

  return res_string


@app.route('/super-resize-64', methods=['POST'])
@cross_origin(origins='*', send_wildcard=True)
def super_resize_b64():

  if 'image' not in list(request.get_json().keys()):
    return "Where be z image?"

  shutil.rmtree(UPLOAD_FOLDER)
  os.mkdir(UPLOAD_FOLDER)
  img = request.get_json()['image']
  img_name = 'base.png'
  img_dir = UPLOAD_FOLDER + '/' + img_name
  with open(img_dir, 'wb') as f:
    f.write(base64.b64decode(img))

  res_img = Image.open(img_dir)
  w, h = res_img.size
  a = res_img.resize(size=(w*4, h*4))
  a.save('./resize/' + img_name)

  with open('./resize/' + img_name, 'rb') as img:
    res_string = base64.b64encode(img.read())

  return res_string


if __name__ == '__main__':
  app.run(debug=True, use_reloader=True, port=9000)