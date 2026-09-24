import time
import statistics
import numpy as np
import tensorflow as tf
from PIL import Image

MODEL_PATH = "skin_cancer_model.h5"
MODEL = tf.keras.models.load_model(MODEL_PATH)

# Synthetic 224x224 RGB image for controlled inference timing.
# This measures model inference only, not upload/network latency.
img = Image.new("RGB", (224, 224), (128, 128, 128))
img_array = np.asarray(img, dtype=np.float32)
img_array = np.expand_dims(img_array, axis=0) / 255.0

# Warm-up runs: exclude model initialization/JIT-related startup effects.
for _ in range(5):
    MODEL.predict(img_array, verbose=0)

times_ms = []

for _ in range(30):
    start = time.perf_counter()
    MODEL.predict(img_array, verbose=0)
    end = time.perf_counter()
    times_ms.append((end - start) * 1000)

times_ms.sort()

def percentile(values, p):
    index = int(np.ceil((p / 100) * len(values))) - 1
    return values[max(0, min(index, len(values) - 1))]

print("A06 MODEL INFERENCE LATENCY")
print("============================")
print(f"Runs: {len(times_ms)}")
print(f"Environment: Python 3.10 / TensorFlow 2.15.0 / CPU")
print(f"Input: 224x224 RGB")
print(f"Mean: {statistics.mean(times_ms):.2f} ms")
print(f"Median (P50): {statistics.median(times_ms):.2f} ms")
print(f"P95: {percentile(times_ms, 95):.2f} ms")
print(f"Minimum: {min(times_ms):.2f} ms")
print(f"Maximum: {max(times_ms):.2f} ms")
