import os
import shutil
import pandas as pd
from sklearn.model_selection import train_test_split

def organize_dataset():
    print("Welcome to the Dataset Organizer!")
    print("This script will automatically sort your 10,000 images into the correct training folders.")
    
    raw_dir = input("👉 Enter the full path to the folder containing your downloaded CSV and image folders (where HAM10000_metadata.csv is located): ").strip()
    
    # Remove quotes if user pastes with quotes
    if raw_dir.startswith('"') and raw_dir.endswith('"'):
        raw_dir = raw_dir[1:-1]
    
    metadata_path = os.path.join(raw_dir, 'HAM10000_metadata.csv')
    
    if not os.path.exists(metadata_path):
        print(f"ERROR: Could not find HAM10000_metadata.csv in {raw_dir}")
        print("Please make sure you entered the correct folder path.")
        return

    print("Found metadata file. Reading data...")
    df = pd.read_csv(metadata_path)
    
    # The target output directory (the ones we made earlier)
    base_out_dir = 'dataset'
    train_dir = os.path.join(base_out_dir, 'train')
    val_dir = os.path.join(base_out_dir, 'val')
    
    # The new target folder structure with full descriptive names
    class_mapping = {
        'nv': 'melanocytic_nevus',
        'mel': 'melanoma',
        'bkl': 'benign_keratosis',
        'bcc': 'basal_cell_carcinoma',
        'akiec': 'actinic_keratosis',
        'vasc': 'vascular_lesion',
        'df': 'dermatofibroma'
    }
    
    # Create output directories including the new 'normal_skin' class
    classes = list(class_mapping.values()) + ['normal_skin']
    for cls in classes:
        os.makedirs(os.path.join(train_dir, cls), exist_ok=True)
        os.makedirs(os.path.join(val_dir, cls), exist_ok=True)

    # Split the dataset 80% train, 20% validation
    # Using stratify ensures equal distribution of classes in train and val
    print("Splitting data into 80% Training and 20% Validation...")
    train_df, val_df = train_test_split(df, test_size=0.2, stratify=df['dx'], random_state=42)
    
    image_folders = ['HAM10000_images_part_1', 'HAM10000_images_part_2']
    
    def copy_images(dataframe, target_folder_name):
        copied = 0
        not_found = 0
        total = len(dataframe)
        
        for index, row in dataframe.iterrows():
            img_id = row['image_id']
            img_class = row['dx']
            filename = f"{img_id}.jpg"
            
            # Find which folder the image is in
            src_path = None
            for folder in image_folders:
                potential_path = os.path.join(raw_dir, folder, filename)
                if os.path.exists(potential_path):
                    src_path = potential_path
                    break
            
            if src_path:
                full_class_name = class_mapping[img_class]
                dst_path = os.path.join(base_out_dir, target_folder_name, full_class_name, filename)
                shutil.copy2(src_path, dst_path)
                copied += 1
            else:
                not_found += 1
            
            if (copied + not_found) % 500 == 0:
                print(f"   ... Processed {copied + not_found}/{total} images for {target_folder_name}")
                
        return copied, not_found

    print("Copying Training Images (this may take a few minutes)...")
    t_copied, t_missed = copy_images(train_df, 'train')
    
    print("Copying Validation Images...")
    v_copied, v_missed = copy_images(val_df, 'val')
    
    print("\nORGANIZATION COMPLETE!")
    print(f"Training images sorted: {t_copied}")
    print(f"Validation images sorted: {v_copied}")
    if t_missed > 0 or v_missed > 0:
        print(f"Warning: Could not find {t_missed + v_missed} images. Ensure both partial image folders are extracted.")
        
    print("\nYou can now run: python train_model.py")

if __name__ == '__main__':
    organize_dataset()
