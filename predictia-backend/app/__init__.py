from tensorflow import keras

print(" ======================================> Loading Model <====================================== ")
model = keras.models.load_model("app\\ml_model\\dyslexia\\dyslexia_model\\", compile=False)
model.compile(optimizer='adam', loss='mean_squared_error',metrics=['accuracy'])
print(" ====================================== > Model Loaded <====================================== ")