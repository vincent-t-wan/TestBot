import tensorflow as tf
import tensorflow_hub as hub
import tensorflow_text as text

# train with the whole dataset since we don't have much data
bert_preprocess = hub.KerasLayer("https://tfhub.dev/tensorflow/bert_en_uncased_preprocess/3")
bert_encoder = hub.KerasLayer("https://tfhub.dev/tensorflow/bert_en_uncased_L-12_H-768_A-12/4")

def get_course_name_embedding(coursenames):
    preprocessed_course_names = bert_preprocess(coursenames)
    return bert_encoder(preprocessed_course_names)['pooled_output']

# Build Model

# Bert layers
course_name_input = tf.keras.layers.Input(shape=(), dtype=tf.string, name='course_name')
preprocessed_course_names = bert_preprocess(course_name_input)
outputs = bert_encoder(preprocessed_course_names)

# Neural network layers
l = tf.keras.layers.Dropout(0.1, name="dropout")(outputs['pooled_output'])

l = tf.keras.layers.Dense(1, activation='linear', name="output")(l)

# Use inputs and outputs to construct a final model
model = tf.keras.Model(inputs=[course_name_input], outputs = [l])

# model.summary()

# define metrics for training
METRICS = [
      tf.keras.metrics.RootMeanSquaredError(name='regression'),
      tf.keras.metrics.Precision(name='precision'),
      tf.keras.metrics.Recall(name='recall')
]

# compile the model
model.compile(optimizer='adam',
              loss='mean_squared_error',
              metrics=METRICS)