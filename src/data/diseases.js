// HAM10000 Dataset Classes
export const diseaseCategories = [
  {
    id: 1,
    name: "Melanocytic Nevi (nv)",
    description: "Common moles. Benign melanocytic proliferations.",
    diseases: [
      {
        name: "Melanocytic Nevus",
        symptoms: ["Uniform color (tan/brown)", "Regular borders", "Symmetrical"],
        remedies: ["Monitor for changes", "Sun protection", "Routine skin checks"],
        isUrgent: false
      }
    ]
  },
  {
    id: 2,
    name: "Melanoma (mel)",
    description: "Malignant neoplasm derived from melanocytes. The most dangerous form of skin cancer.",
    diseases: [
      {
        name: "Malignant Melanoma",
        symptoms: ["Asymmetrical shape", "Irregular borders", "Multiple colors", "Diameter > 6mm"],
        remedies: ["Immediate Oncologist Consultation", "Surgical Excision", "Immunotherapy", "Chemotherapy"],
        isUrgent: true
      }
    ]
  },
  {
    id: 3,
    name: "Benign Keratosis (bkl)",
    description: "Seborrheic keratoses, solar lentigo, and lichen-planus like keratoses.",
    diseases: [
      {
        name: "Seborrheic Keratosis",
        symptoms: ["Waxy, stuck-on appearance", "Brown, black or light tan", "Round or oval shape"],
        remedies: ["Cryotherapy", "Electrocautery", "Usually no treatment needed unless irritated"],
        isUrgent: false
      }
    ]
  },
  {
    id: 4,
    name: "Basal Cell Carcinoma (bcc)",
    description: "Common skin cancer arising from basal cells of the epidermis.",
    diseases: [
      {
        name: "Basal Cell Carcinoma",
        symptoms: ["Pearly or waxy bump", "Flesh-colored or brown scar-like lesion", "Bleeding or scabbing sore"],
        remedies: ["Mohs Surgery", "Excision", "Topical chemotherapy", "Radiation therapy"],
        isUrgent: true
      }
    ]
  },
  {
    id: 5,
    name: "Actinic Keratoses (akiec)",
    description: "Pre-cancerous patches caused by sun damage.",
    diseases: [
      {
        name: "Actinic Keratosis",
        symptoms: ["Rough, scaly patch", "Itching or burning", "Pink, red or brown color"],
        remedies: ["Cryotherapy", "Topical creams (5-FU)", "Photodynamic therapy"],
        isUrgent: false
      }
    ]
  },
  {
    id: 6,
    name: "Vascular Lesions (vasc)",
    description: "Angiomas, angiokeratomas, pyogenic granulomas.",
    diseases: [
      {
        name: "Vascular Lesion",
        symptoms: ["Red or purple color", "Smooth surface", "Sometimes bleeds if scratched"],
        remedies: ["Laser therapy", "Electrocautery", "Usually benign"],
        isUrgent: false
      }
    ]
  },
  {
    id: 7,
    name: "Dermatofibroma (df)",
    description: "Benign skin growths that can appear anywhere on the body.",
    diseases: [
      {
        name: "Dermatofibroma",
        symptoms: ["Small, firm bump", "Pink, brown or red", "Dimples when pinched"],
        remedies: ["Surgical removal (if bothersome)", "Cryotherapy"],
        isUrgent: false
      }
    ]
  }
];
