import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model

MODEL_PATH = "backend_py/skin_cancer_model.h5"
IMAGE_PATH = r"C:\Users\vasumathi.g\Downloads\HAM10000\HAM10000_images_part_1\ISIC_0027419.jpg"

model = load_model(MODEL_PATH)

image = Image.open(IMAGE_PATH).convert("RGB").resize((224, 224))
x = np.array(image, dtype=np.float32) / 255.0
x = np.expand_dims(x, axis=0)

prediction = model.predict(x, verbose=0)[0]

assert model.input_shape == (None, 224, 224, 3)
assert model.output_shape == (None, 8)
assert len(prediction) == 8
assert np.isfinite(prediction).all()

print("A12 smoke test: PASS")
print("TensorFlow model loaded successfully")
print("Input shape:", model.input_shape)
print("Output shape:", model.output_shape)
print("Prediction vector length:", len(prediction))
print("Predicted output index:", int(np.argmax(prediction)))
print("Confidence:", round(float(np.max(prediction)), 4))
