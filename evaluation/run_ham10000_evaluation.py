import os
import json
import pandas as pd
import numpy as np
import tensorflow as tf
from PIL import Image
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

MODEL_PATH = r".\backend_py\skin_cancer_model.h5"
MANIFEST_PATH = r".\evaluation\ham10000_test_manifest.csv"
IMAGE_ROOT = r"C:\Users\vasumathi.g\Downloads\HAM10000"

CLASSES = [
    "actinic_keratosis",
    "basal_cell_carcinoma",
    "benign_keratosis",
    "dermatofibroma",
    "melanocytic_nevus",
    "melanoma",
    "normal_skin",
    "vascular_lesion"
]

LABEL_MAP = {
    "akiec": "actinic_keratosis",
    "bcc": "basal_cell_carcinoma",
    "bkl": "benign_keratosis",
    "df": "dermatofibroma",
    "mel": "melanoma",
    "nv": "melanocytic_nevus",
    "vasc": "vascular_lesion"
}

df = pd.read_csv(MANIFEST_PATH)

model = tf.keras.models.load_model(MODEL_PATH)

rows = []

for n, row in enumerate(df.itertuples(index=False), start=1):
    image_id = row.image_id
    true_code = row.dx
    true_class = LABEL_MAP[true_code]

    image_path = os.path.join(
        IMAGE_ROOT,
        "HAM10000_images_part_1",
        image_id + ".jpg"
    )

    if not os.path.exists(image_path):
        image_path = os.path.join(
            IMAGE_ROOT,
            "HAM10000_images_part_2",
            image_id + ".jpg"
        )

    if not os.path.exists(image_path):
        print(f"[ERROR] Image not found: {image_id}")
        continue

    img = Image.open(image_path).convert("RGB").resize((224, 224))
    x = np.expand_dims(
        np.asarray(img, dtype=np.float32) / 255.0,
        axis=0
    )

    probabilities = model.predict(x, verbose=0)[0]

    predicted_index = int(np.argmax(probabilities))
    predicted_class = CLASSES[predicted_index]
    confidence = float(probabilities[predicted_index])

    rows.append({
        "image_id": image_id,
        "lesion_id": row.lesion_id,
        "true_code": true_code,
        "true_class": true_class,
        "predicted_class": predicted_class,
        "confidence": confidence,
        "predicted_index": predicted_index
    })

    if n % 100 == 0:
        print(f"Processed {n}/{len(df)}")

predictions = pd.DataFrame(rows)

predictions.to_csv(
    r".\evaluation\case_predictions.csv",
    index=False
)

# Evaluate only the 7 HAM10000 classes.
# Predictions of normal_skin are counted as incorrect for the
# corresponding HAM10000 disease class.
y_true = predictions["true_class"]
y_pred = predictions["predicted_class"]

labels = list(LABEL_MAP.values())

accuracy = accuracy_score(y_true, y_pred)

report = classification_report(
    y_true,
    y_pred,
    labels=labels,
    target_names=labels,
    zero_division=0,
    output_dict=True
)

cm = confusion_matrix(
    y_true,
    y_pred,
    labels=labels
)

metrics = {
    "dataset": "HAM10000",
    "test_images": len(predictions),
    "test_lesions": predictions["lesion_id"].nunique(),
    "evaluated_classes": labels,
    "excluded_model_class": "normal_skin",
    "accuracy": float(accuracy),
    "classification_report": report,
    "confusion_matrix_labels": labels,
    "confusion_matrix": cm.tolist(),
    "normal_skin_predictions": int(
        (predictions["predicted_class"] == "normal_skin").sum()
    )
}

with open(
    r".\evaluation\evaluation_metrics.json",
    "w",
    encoding="utf-8"
) as f:
    json.dump(metrics, f, indent=2)

print("\n===== EVALUATION COMPLETE =====")
print("Images evaluated:", len(predictions))
print("Unique lesions:", predictions["lesion_id"].nunique())
print("Accuracy:", round(accuracy * 100, 2), "%")
print("\nClassification report:")
print(
    classification_report(
        y_true,
        y_pred,
        labels=labels,
        target_names=labels,
        zero_division=0
    )
)
print("\nNormal-skin predictions:", metrics["normal_skin_predictions"])
print("\nSaved:")
print(r".\evaluation\case_predictions.csv")
print(r".\evaluation\evaluation_metrics.json")
