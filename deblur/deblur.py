#!/usr/bin/env python
# coding: utf-8

# In[1]:


from keras.layers import Input, Activation, Add, UpSampling2D
from keras.layers.advanced_activations import LeakyReLU
from keras.layers.convolutional import Conv2D
from keras.layers.core import Dense, Flatten, Lambda
from keras.layers.normalization import BatchNormalization
from keras.models import Model 

from layer_utils import ReflectionPadding2D, res_block
from utils import load_images, deprocess_image

from PIL import Image
import numpy as np
import os
import subprocess
import shutil
import tensorflow as tf
tf.logging.set_verbosity(tf.logging.ERROR)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

HEIGHT = 256
WIDTH = 256
image_shape = (256, 256, 3)
ngf = 64
n_blocks_gen = 9
channels = 3

def get_image_name():
    files = os.listdir('uploads/A')
    return files[0]


# In[3]:


def generator_model():
    """Build generator architecture."""
    # Current version : ResNet block
    inputs = Input(shape=image_shape)

    x = ReflectionPadding2D((3, 3))(inputs)
    x = Conv2D(filters=ngf, kernel_size=(7, 7), padding='valid')(x)
    x = BatchNormalization()(x)
    x = Activation('relu')(x)

    n_downsampling = 2
    for i in range(n_downsampling):
        mult = 2**i
        x = Conv2D(filters=ngf*mult*2, kernel_size=(3, 3), strides=2, padding='same')(x)
        x = BatchNormalization()(x)
        x = Activation('relu')(x)

    mult = 2**n_downsampling
    for i in range(n_blocks_gen):
        x = res_block(x, ngf*mult, use_dropout=True)

    for i in range(n_downsampling):
        mult = 2**(n_downsampling - i)
        # x = Conv2DTranspose(filters=int(ngf * mult / 2), kernel_size=(3, 3), strides=2, padding='same')(x)
        x = UpSampling2D()(x)
        x = Conv2D(filters=int(ngf * mult / 2), kernel_size=(3, 3), padding='same')(x)
        x = BatchNormalization()(x)
        x = Activation('relu')(x)

    x = ReflectionPadding2D((3, 3))(x)
    x = Conv2D(filters=channels, kernel_size=(7, 7), padding='valid')(x)
    x = Activation('tanh')(x)

    outputs = Add()([x, inputs])
    # outputs = Lambda(lambda z: K.clip(z, -1, 1))(x)
    outputs = Lambda(lambda z: z/2)(outputs)

    model = Model(inputs=inputs, outputs=outputs, name='Generator')
    return model


def deblur_image(img_dir, batch_size):
    if os.path.exists('./result'):
        shutil.rmtree('./result')
    os.makedirs('./result')

    gen = generator_model()
    gen.load_weights('generator.h5')
    
    print('\tdeblur image')
    data = load_images(img_dir, batch_size)
    img_names = os.listdir(img_dir + '/A')
    print('Names', img_names)
    x_test = data['A']
    
    print('\tGenerator')
    generated_images = gen.predict(x=x_test, batch_size=batch_size)
    print('\tGenerated')
    generated = np.array([deprocess_image(img) for img in generated_images])
    x_test = deprocess_image(x_test)

    for i in range(generated_images.shape[0]):
        print("\tPredicting", i)
        x = x_test[i, :, :, :]
        img = generated[i, :, :, :]
        im = Image.fromarray(img.astype(np.uint8))
        print('saving result/{}'.format(img_names[i]))
        im.save('result/{}'.format(img_names[i]))

def crop_image(img, extension):
    if os.path.exists('./split_uploads'):
        shutil.rmtree('./split_uploads')
    os.makedirs('./split_uploads/A')

    height = 256
    width = 256
    (img_width, img_height) = img.size
    
    boxMap = {}
    k = 0
    for i in range(0, img_height, height):
        for j in range(0, img_width, width):
            box = (j, i, j+width, i+height)
            boxMap['img' + chr(k+65)] = box
            a = img.crop(box)
            a.save('./split_uploads/A/img{}.{}'.format(chr(k+65), extension))
            k += 1 
    
    return boxMap

def deblur_image_split():
    files = os.listdir('./uploads/A')
    ext = os.path.basename(files[0]).split('.')[1]
    img = Image.open('./uploads/A/' + files[0])
    new_img = Image.new('RGB', img.size)
    box_map = crop_image(img, ext)

    img_keys = list(box_map.keys())

    if os.path.exists('./result'):
        shutil.rmtree('./result')
    os.makedirs('./result')

    gen = generator_model()
    gen.load_weights('generator.h5')

    img_dir = './split_uploads'
    batch_size = len(img_keys)

    data = load_images(img_dir, batch_size)
    x_test = data['A']
    
    generated_images = gen.predict(x=x_test, batch_size=batch_size)
    generated = np.array([deprocess_image(img) for img in generated_images])
    x_test = deprocess_image(x_test)

    for i in range(generated_images.shape[0]):
        print("Predicting", img_keys[i])
        x = x_test[i, :, :, :]
        img = generated[i, :, :, :]

        print(box_map[img_keys[i]])
        new_img.paste(Image.fromarray(img), box_map[img_keys[i]])

        output = np.concatenate((x, img), axis=1)
        im = Image.fromarray(output.astype(np.uint8))
        im.save('./result/img{}.{}'.format(chr(i+65), ext))

    new_img.save('result/{}'.format(files[0]))
    print("Saving", files[0])
        
    print(img_keys)


if __name__ == "__main__":
    # shutil.rmtree('result')
    # os.mkdir('result')
    deblur_image('./uploads', 1)
    # deblur_image_split()



#%%
