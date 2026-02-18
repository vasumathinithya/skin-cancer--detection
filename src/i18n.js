import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            "nav.home": "Home",
            "nav.categories": "Categories",
            "nav.detect": "AI Detector",
            "nav.doctors": "Find Doctors",
            "hero.title": "Your Personal Skin Health Guardian",
            "hero.subtitle": "Advanced AI detection for over 10 categories of skin diseases. From acne to rare conditions, get instant analysis and connect with top doctors.",
            "hero.cta_primary": "Start Free Analysis",
            "hero.cta_secondary": "Explore Diseases",
            "detect.title": "AI Diagnostic Center",
            "detect.subtitle": "Upload an image of the affected area. Our advanced neural network will analyze the texture, color, and pattern to identify potential conditions.",
            "detect.select_category": "Select Category (Improves Accuracy)",
            "detect.auto": "✨ Auto-Detect Best Category",
            "detect.analyze": "Analyze Now",
            "detect.processing": "Processing...",
            "detect.result_title": "Detection Result",
            "detect.diagnosis": "Diagnosis",
            "detect.remedies": "Recommended Remedies",
            "detect.urgent": "Urgent Attention Recommended: This condition may require professional medical intervention.",
            "detect.moderate": "Moderate Severity: Monitor closely and consult if symptoms persist.",
            "detect.button_consult": "Consult a Specialist Immediately",
            "detect.button_doctors": "Find Doctors Near You",
            "detect.download_report": "Download Medical Report",
            "files.drag_drop": "Drag & Drop Image Here",
            "files.browse": "Browse Files",
            "app.book_appointment": "Book Appointment",
            "app.confirm": "Confirm Appointment",
            "app.success": "Booking Confirmed!",
            "app.download_consult_report": "Download Consultation Report"
        }
    },
    ta: {
        translation: {
            "nav.home": "முகப்பு",
            "nav.categories": "வகைகள்",
            "nav.detect": "AI கண்டறிதல்",
            "nav.doctors": "மருத்துவர்கள்",
            "hero.title": "உங்கள் தனிப்பட்ட தோல் ஆரோக்கிய பாதுகாவலர்", // Ungal thanippatta thol arokiya paathukavalar
            "hero.subtitle": "10 க்கும் மேற்பட்ட தோல் நோய்களைக் கண்டறியும் மேம்பட்ட AI தொழில்நுட்பம். பருக்கள் முதல் அரிய நோய்கள் வரை, உடனடி பகுப்பாய்வு மற்றும் சிறந்த மருத்துவர்களுடன் தொடர்பு கொள்ளுங்கள்.",
            "hero.cta_primary": "இலவச பகுப்பாய்வு தொடங்கு",
            "hero.cta_secondary": "நோய்களை ஆராயுங்கள்",
            "detect.title": "AI கண்டறியும் மையம்",
            "detect.subtitle": "பாதிக்கப்பட்ட பகுதியின் படத்தை பதிவேற்றவும். எங்கள் மேம்பட்ட AI அமைப்பு அதன் அமைப்பு, நிறம் மற்றும் வடிவத்தை பகுப்பாய்வு செய்யும்.",
            "detect.select_category": "வகையைத் தேர்ந்தெடுக்கவும் (துல்லியத்தை மேம்படுத்தும்)",
            "detect.auto": "✨ தானாக அறியவும்",
            "detect.analyze": "பகுப்பாய்வு செய்",
            "detect.processing": "செயலாக்குகிறது...",
            "detect.result_title": "கண்டறிதல் முடிவு",
            "detect.diagnosis": "கண்டறியப்பட்ட நோய்",
            "detect.remedies": "பரிந்துரைக்கப்பட்ட remedies",
            "detect.urgent": "அவசர கவனம் தேவை: இந்த நிலைக்கு தொழில்முறை மருத்துவ சிகிச்சை தேவைப்படலாம்.",
            "detect.moderate": "மிதமான தீவிரம்: அறிகுறிகள் தொடர்ந்தால் மருத்துவரை அணுகவும்.",
            "detect.button_consult": "உடனடியாக மருத்துவரை அணுகவும்",
            "detect.button_doctors": "அருகிலுள்ள மருத்துவர்களைத் தேடுங்கள்",
            "detect.download_report": "மருத்துவ அறிக்கையைப் பதிவிறக்கவும்",
            "files.drag_drop": "படத்தை இங்கே இழுக்கவும்",
            "files.browse": "கோப்புகளைத் தேடுங்கள்",
            "app.book_appointment": "சந்திப்பை முன்பதிவு செய்",
            "app.confirm": "சந்திப்பை உறுதிப்படுத்து",
            "app.success": "முன்பதிவு உறுதி செய்யப்பட்டது!",
            "app.download_consult_report": "ஆலோசனை அறிக்கையைப் பதிவிறக்கவும்"
        }
    },
    hi: {
        translation: {
            "nav.home": "होम",
            "nav.categories": "श्रेणियाँ",
            "nav.detect": "AI डिटेक्टर",
            "nav.doctors": "डॉक्टर खोजें",
            "hero.title": "आपका व्यक्तिगत त्वचा स्वास्थ्य रक्षक",
            "hero.subtitle": "10 से अधिक प्रकार के त्वचा रोगों का पता लगाने के लिए उन्नत AI। मुहांसों से लेकर दुर्लभ स्थितियों तक, तुरंत विश्लेषण प्राप्त करें।",
            "hero.cta_primary": "निःशुल्क विश्लेषण शुरू करें",
            "hero.cta_secondary": "बीमरियों को देखें",
            "detect.title": "AI डायग्नोस्टिक सेंटर",
            "detect.subtitle": "प्रभावित क्षेत्र की छवि अपलोड करें। हमारा एडवांस न्यूरल नेटवर्क बनावट, रंग और पैटर्न का विश्लेषण करेगा।",
            "detect.select_category": "श्रेणी चुनें (सटीकता सुधारता है)",
            "detect.auto": "✨ ऑटो-डिटेक्ट",
            "detect.analyze": "अभी विश्लेषण करें",
            "detect.processing": "प्रोसेसिंग...",
            "detect.result_title": "परिणाम",
            "detect.diagnosis": "निदान",
            "detect.remedies": "सुझाए गए उपाय",
            "detect.urgent": "तत्काल ध्यान दें: इस स्थिति के लिए पेशेवर चिकित्सा की आवश्यकता हो सकती है।",
            "detect.moderate": "मध्यम गंभीरता: लक्षणों पर नज़र रखें।",
            "detect.button_consult": "विशेषज्ञ से परामर्श करें",
            "detect.button_doctors": "नज़दीकी डॉक्टर खोजें",
            "detect.download_report": "मेडिकल रिपोर्ट डाउनलोड करें",
            "files.drag_drop": "इमेज यहाँ ड्रैग करें",
            "files.browse": "फाइल ब्राउज़ करें",
            "app.book_appointment": "अपॉइंटमेंट बुक करें",
            "app.confirm": "पुष्टि करें",
            "app.success": "बुकिंग कन्फर्म!",
            "app.download_consult_report": "परामर्श रिपोर्ट डाउनलोड करें"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
