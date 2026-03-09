import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping

# ==============================================================================
# 🎯 REAL DATASET TRAINING SCRIPT FOR SKIN CANCER (HAM10000)
# ==============================================================================
# Instructions:
# 1. Download the HAM10000 dataset from Kaggle:
#    https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000
# 2. Extract and organize the images into a directory structure like this:
#    dataset/
#      train/
#        actinic_keratosis/
#        basal_cell_carcinoma/
#        benign_keratosis/
#        dermatofibroma/
#        melanocytic_nevus/
#        melanoma/
#        normal_skin/       <-- Put your normal healthy skin images here!
#        vascular_lesion/
#      val/
#        (same folders as train for validation)
# 3. Update the DATASET_DIR variable below to point to your extracted dataset.
# 4. Run `python train_model.py`
# ==============================================================================

DATASET_DIR = './dataset' # <-- CHANGE THIS to your actual dataset path
MODEL_SAVE_PATH = 'skin_cancer_model.h5'
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 30

def build_model(num_classes=7):
    """
    Builds a robust CNN using MobileNetV2 pre-trained on ImageNet
    for transfer learning on the skin cancer dataset.
    """
    print("🚀 Building the model architecture...")
    base_model = MobileNetV2(
        weights='imagenet', 
        include_top=False, 
        input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3)
    )
    
    # Freeze the base model layers
    base_model.trainable = False
    
    # Add custom classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    
    model.compile(
        optimizer=Adam(learning_rate=0.0001), 
        loss='categorical_crossentropy', 
        metrics=['accuracy']
    )
    return model

def train():
    if not os.path.exists(DATASET_DIR):
        print(f"❌ ERROR: Dataset directory '{DATASET_DIR}' not found.")
        print("Please download the HAM10000 dataset from Kaggle and organize it into train/val folders as described in the comments.")
        return

    train_dir = os.path.join(DATASET_DIR, 'train')
    val_dir = os.path.join(DATASET_DIR, 'val')

    if not os.path.exists(train_dir) or not os.path.exists(val_dir):
        print("❌ ERROR: Ensure you have both 'train' and 'val' folders inside your dataset directory.")
        return

    print("📊 Loading and augmenting realistic dataset...")
    # Data Augmentation to prevent overfitting (as requested: rotation, zoom, flip)
    train_datagen = ImageDataGenerator(
        rescale=1./255, # Normalize pixel values to [0,1]
        rotation_range=30,
        zoom_range=0.2,
        brightness_range=[0.8, 1.2],
        horizontal_flip=True,
        fill_mode='nearest'
    )
    
    val_datagen = ImageDataGenerator(rescale=1./255)

    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )

    validation_generator = val_datagen.flow_from_directory(
        val_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )

    # Calculate class weights for dataset balancing
    from sklearn.utils.class_weight import compute_class_weight
    import numpy as np
    classes = train_generator.classes
    class_weights = compute_class_weight(
        class_weight='balanced',
        classes=np.unique(classes),
        y=classes
    )
    class_weight_dict = dict(enumerate(class_weights))
    print(f"⚖️ Computed class weights for balancing: {class_weight_dict}")

    # Class indices output
    print(f"🏷️ Class mapping: {train_generator.class_indices}")

    model = build_model(num_classes=train_generator.num_classes)
    
    # Callbacks
    checkpoint = ModelCheckpoint(
        MODEL_SAVE_PATH, 
        monitor='val_accuracy', 
        save_best_only=True, 
        mode='max', 
        verbose=1
    )
    early_stop = EarlyStopping(
        monitor='val_loss', 
        patience=5, 
        restore_best_weights=True
    )

    print("🚂 Starting training process on REAL dataset...")
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        epochs=EPOCHS,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // BATCH_SIZE,
        callbacks=[checkpoint, early_stop],
        class_weight=class_weight_dict
    )

    print(f"✅ Training complete! Model saved to {MODEL_SAVE_PATH}.")

            
if __name__ == '__main__':
    train()
