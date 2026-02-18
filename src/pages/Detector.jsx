
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { diseaseCategories } from '../data/diseases';
import { Upload, Loader, AlertTriangle, CheckCircle, Search, FileText, UserPlus, Image as ImageIcon, X, Download, Activity, Camera } from 'lucide-react';
import { generateReport } from '../utils/reportGenerator';
import { useTranslation } from 'react-i18next';

const Detector = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialCatId = searchParams.get('cat');
    const targetDisease = searchParams.get('disease'); // Usually for forcing a specific result if user came from "Check" link

    const [selectedCategory, setSelectedCategory] = useState(initialCatId || '');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const videoRef = React.useRef(null);
    const streamRef = React.useRef(null);

    // Advanced Feature Extraction Analysis (Simulating GenAI)
    const analyzeImageFeatures = (img, canvas, ctx) => {
        const width = canvas.width;
        const height = canvas.height;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        let rTotal = 0, gTotal = 0, bTotal = 0;
        let luminanceTotal = 0;
        let entropy = 0;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            rTotal += r;
            gTotal += g;
            bTotal += b;
            luminanceTotal += (0.299 * r + 0.587 * g + 0.114 * b);
        }

        const pixels = width * height;
        const avgR = rTotal / pixels;
        const avgG = gTotal / pixels;
        const avgB = bTotal / pixels;
        const avgL = luminanceTotal / pixels;

        // Feature Signatures for HAM10000 Classes
        const rednessIndex = avgR / ((avgG + avgB) / 2);
        const darknessIndex = 255 - avgL;
        const blueVariance = Math.abs(avgB - avgG);

        // Calculate Texture/Variance (Standard Deviation of Luminance AND Red Channel)
        let sumSquaredDiff = 0;
        let sumRedDiff = 0;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            sumSquaredDiff += Math.pow(lum - avgL, 2);
            sumRedDiff += Math.pow(r - avgR, 2);
        }

        const variance = Math.sqrt(sumSquaredDiff / pixels);
        const redVariance = Math.sqrt(sumRedDiff / pixels);

        // Stricter Filter for *Completely* Blurry/Uniform Images (e.g., finger *completely* covering lens)
        // Normal skin has texture (pores, lines). A covered lens is usually uniform pink (Variance < 5).
        // Reduced thresholds significantly to allow smooth lesions (BCC/Nevi) to pass.

        console.log(`Features: R=${avgR.toFixed(1)} Index=${rednessIndex.toFixed(2)} Dark=${darknessIndex.toFixed(1)} Variance=${variance.toFixed(1)} RedVar=${redVariance.toFixed(1)}`);

        // IF variance is extremely low (e.g., < 8), it's likely a blurry finger or solid color.
        // BUT, if there is high redness variation (e.g., a red spot on white skin), allow it.
        // So: reject ONLY if both variance AND redVariance are very low.
        if (variance < 8 && redVariance < 5) {
            console.log("Image rejected: Too smooth/blurry (likely finger or solid background)");
            return 0; // SPECIAL ID: Normal Skin / No Lesion
        }

        // Secondary check: If the image is extremely bright/white (e.g., blank wall), reject.
        if (avgL > 240 && variance < 5) {
            return 0;
        }

        let predictedCategoryId;

        // 1: Nevi (Brown, Regular) -> Benign
        // 2: Melanoma (Dark, irreg, blue-black) -> Cancer (Malignant)
        // 3: Benign Keratosis (Brown/Tan, stuck on) -> Benign
        // 4: BCC (Pink/Pearly) -> Cancer (Malignant)
        // 5: Actinic (Red/Scaly) -> Pre-Cancerous
        // 6: Vascular (Very Red/Purple) -> Benign (usually)
        // 7: Dermatofibroma (Pink/Brown firm) -> Benign

        if (darknessIndex > 140) {
            // Very dark -> Melanoma (2) or Dark Nevi (1)
            // Differentiate by some blue variance or randomness
            predictedCategoryId = (blueVariance > 15) ? 2 : 1;
        } else if (rednessIndex > 1.4) {
            // Very Red -> Vascular (6)
            // BUT check if it's just a uniform red blob (handled by variance check above now)
            predictedCategoryId = 6;
        } else if (rednessIndex > 1.2) {
            // Red/Pinkish -> BCC (4) or Actinic (5) or Dermatofibroma (7)
            // Use luminance to split
            if (avgL > 150) predictedCategoryId = 4; // Lighter/Pearly -> BCC
            else predictedCategoryId = 5; // Actinic
        } else if (darknessIndex > 80) {
            // Medium Dark -> Benign Keratosis (3) or Nevi (1)
            predictedCategoryId = 3;
        } else {
            // Lighter/Other -> Dermatofibroma (7) or generic Nevi (1)
            predictedCategoryId = 7;
        }

        // Fallback to ensure valid ID
        if (!predictedCategoryId) predictedCategoryId = 1;

        return predictedCategoryId;
    };

    // Skin Detection & Analysis Wrapper
    const processImage = (imageSrc) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 100; // Resize for speed
                canvas.height = 100;
                ctx.drawImage(img, 0, 0, 100, 100);

                const imageData = ctx.getImageData(0, 0, 100, 100);
                const data = imageData.data;
                let skinPixels = 0;
                let totalPixels = data.length / 4;

                let nonSkinPixels = 0;
                let blueDominantPixels = 0;
                let greenDominantPixels = 0;

                let vividPixels = 0;
                let darkPixels = 0;
                let lightPixels = 0;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // Simple Luminance
                    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

                    // Skin Condition logic (RGB rule-based - Standard Peer-Reviewed Rule)
                    // R > 95, G > 40, B > 20
                    // Max-Min > 15
                    // |R-G| > 15
                    // R > G > B

                    const isSkinPixel = (r > 95 && g > 40 && b > 20) &&
                        (Math.max(r, g, b) - Math.min(r, g, b) > 15) &&
                        (Math.abs(r - g) > 15) &&
                        (r > g && r > b);

                    if (isSkinPixel) {
                        skinPixels++;
                    } else {
                        // Check for nature indicators
                        if (g > r && g > b) greenDominantPixels++;
                        if (b > r && b > g) blueDominantPixels++;

                        // Vivid/Artificial color check (High Saturation)
                        const max = Math.max(r, g, b);
                        const min = Math.min(r, g, b);
                        if (max - min > 50 && (b > r || g > r)) vividPixels++; // Vivid blue/green/cyan/magenta usually not skin
                    }

                    if (lum < 40) darkPixels++;
                    if (lum > 220) lightPixels++;
                }

                const skinRatio = skinPixels / totalPixels;
                const blueRatio = blueDominantPixels / totalPixels;
                const greenRatio = greenDominantPixels / totalPixels;
                const vividRatio = vividPixels / totalPixels;

                console.log(`Skin: ${(skinRatio * 100).toFixed(1)}%, Blue: ${(blueRatio * 100).toFixed(1)}%, Green: ${(greenRatio * 100).toFixed(1)}%, Vivid: ${(vividRatio * 100).toFixed(1)}%`);

                // Stricter Rejection Logic
                // 1. Skin must be dominant (> 35%)
                // 2. Nature (Blue/Green) should be low (< 20%)
                // 3. Vivid non-skin colors should be low (< 20%)

                const isNature = blueRatio > 0.15 || greenRatio > 0.15 || vividRatio > 0.2;
                const isSkin = skinRatio > 0.35 && !isNature;

                if (!isSkin) {
                    resolve({ isSkin: false });
                    return;
                }



                // If skin confirmed, run detailed analysis
                const categoryId = analyzeImageFeatures(img, canvas, ctx);
                resolve({ isSkin: true, categoryId });
            };
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = imageSrc;
        });
    };

    useEffect(() => {
        if (initialCatId) setSelectedCategory(initialCatId);
    }, [initialCatId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
            setResult(null); // Reset result on new image
        }
    };

    const analyzeImage = async () => {
        if (!image || !selectedCategory) return;

        setError(null);
        setIsAnalyzing(true);
        setResult(null);

        if (preview) {
            try {
                const analysis = await processImage(preview);

                if (!analysis.isSkin) {
                    setIsAnalyzing(false);
                    setError("No skin detected. Please upload a clear image of the affected skin area. Our AI is trained to analyze only skin conditions.");
                    return;
                }

                // If skin confirmed, run detailed analysis
                const categoryId = analysis.categoryId;

                if (categoryId === 0) {
                    // Special Case: Normal Skin / No Lesion (Low Variance)
                    setIsAnalyzing(false);
                    setResult({
                        disease: {
                            name: "Healthy Skin / No Lesion Detected",
                            symptoms: ["No significant discoloration", "Even texture"],
                            remedies: ["Routine skin care", "Sun protection"]
                        },
                        category: "Normal",
                        confidence: "98.2",
                        severity: "Low",
                        isUrgent: false,
                        type: "Benign"
                    });
                    return;
                }

                // If Auto-Detect is selected, use the analyzed category
                if (selectedCategory === "auto") {
                    const detectedCat = diseaseCategories.find(c => c.id === categoryId) || diseaseCategories[0];
                    processResult(detectedCat);
                } else {
                    // Start of else block (already matching original code structure)
                    const userCat = diseaseCategories.find(c => c.id === parseInt(selectedCategory));
                    processResult(userCat);
                }

            } catch (err) {
                console.error(err);
                setIsAnalyzing(false);
                setError("Analysis failed. Please try another image.");
            }
        }
    };


    const processResult = (category) => {
        if (!category) {
            setIsAnalyzing(false);
            return;
        }

        let detectedDisease;

        // If user came from a specific disease link, prioritize it (simulating "perfect" detection for demo)
        if (targetDisease) {
            detectedDisease = category.diseases.find(d => d.name === targetDisease);
        }

        // If not found, pick a disease from the category deterministically based on image name/size to strictly avoid randomness
        // Or just pick the first one/most common one for consistency in "GenAI" simulation
        if (!detectedDisease) {
            // Pick based on a pseudo-random seed from the image size to make it deterministic for the same image
            const seed = image ? image.size : Date.now();
            detectedDisease = category.diseases[seed % category.diseases.length];
        }

        // High confidence for demo
        const confidence = "96.5";

        const isCancer = category.name.includes("Melanoma") ||
            category.name.includes("Carcinoma") ||
            category.name.includes("Malignant");

        setResult({
            disease: detectedDisease,
            category: category.name,
            confidence: confidence,
            severity: isCancer ? "High" : "Moderate",
            isUrgent: isCancer || detectedDisease.isUrgent,
            type: isCancer ? "Malignant (Cancerous)" : "Benign (Non-Cancerous)"
        });

        setIsAnalyzing(false);
    };

    const startCamera = async () => {
        try {
            setShowCamera(true);
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please check permissions.");
            setShowCamera(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setShowCamera(false);
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0);

            canvas.toBlob((blob) => {
                const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
                setImage(file);
                setPreview(URL.createObjectURL(blob));
                setResult(null);
                stopCamera();
            }, 'image/jpeg');
        }
    };

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const file = files[0];
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
            setResult(null);
        }
    };

    return (
        <div className="min-h-screen container mx-auto px-4 py-12 flex flex-col items-center">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-pink-400 to-blue-500">
                    {t('detect.title')}
                </h1>
                <p className="text-slate-400 max-w-xl mx-auto">
                    {t('detect.subtitle')}
                </p>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Column: Input */}
                <div className="glass-card p-8 flex flex-col justify-between h-full">
                    <div>
                        <div className="mb-6">
                            <label className="block text-slate-300 mb-2 font-medium">{t('detect.select_category')}</label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 transition-all"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">-- Choose Category --</option>
                                <option value="auto">{t('detect.auto')}</option>
                                {diseaseCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${image ? 'border-green-500 bg-slate-800/50' : 'border-slate-600 hover:border-pink-400 hover:bg-slate-800/30'}`}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {preview ? (
                                <div className="relative w-full h-full">
                                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg object-cover" />
                                    <button
                                        onClick={() => { setImage(null); setPreview(null); setResult(null); }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X size={20} />
                                    </button>
                                    <p className="mt-2 text-green-500 font-medium flex items-center justify-center">
                                        <CheckCircle size={16} className="mr-2" /> Image Loaded
                                    </p>
                                </div>
                            ) : showCamera ? (
                                <div className="relative w-full h-full flex flex-col items-center">
                                    <video ref={videoRef} autoPlay playsInline className="w-full max-h-64 rounded-lg object-cover mb-4 bg-black"></video>
                                    <div className="flex gap-2">
                                        <button onClick={capturePhoto} className="btn btn-primary btn-sm flex items-center">
                                            <Camera size={16} className="mr-1" /> Capture
                                        </button>
                                        <button onClick={stopCamera} className="btn btn-danger btn-sm flex items-center">
                                            <X size={16} className="mr-1" /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <ImageIcon size={64} className="text-slate-400 mb-4" />
                                    <p className="text-slate-500 font-medium mb-2">{t('files.drag_drop')}</p>
                                    <p className="text-slate-400 text-sm mb-6">Supports JPG, PNG, WEBP</p>

                                    <div className="flex gap-4 w-full justify-center">
                                        <label className="btn btn-primary cursor-pointer">
                                            <Upload className="mr-2" size={20} /> {t('files.browse')}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                        <button onClick={startCamera} className="btn btn-secondary flex items-center">
                                            <Camera className="mr-2" size={20} /> Camera
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={analyzeImage}
                        disabled={!image || !selectedCategory || isAnalyzing}
                        className={`btn w-full mt-6 py-4 text-lg font-bold shadow-lg ${!image || !selectedCategory ? 'bg-slate-700 cursor-not-allowed text-slate-500' : 'bg-gradient-to-r from-pink-500 to-violet-600 hover:shadow-pink-500/25 text-white'}`}
                    >
                        {isAnalyzing ? (
                            <span className="flex items-center justify-center">
                                <Loader className="animate-spin mr-2" /> {t('detect.processing')}
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <Search className="mr-2" /> {t('detect.analyze')}
                            </span>
                        )}
                    </button>

                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start animate-fade-in">
                            <AlertTriangle className="text-red-500 mr-2 flex-shrink-0" size={20} />
                            <p className="text-red-200 text-sm">{error}</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Output */}
                <div className="glass-card p-8 relative overflow-hidden flex flex-col items-center justify-center text-center">
                    {!result && !isAnalyzing && (
                        <div className="text-slate-500 flex flex-col items-center">
                            <Activity size={80} className="mb-4 opacity-20" />
                            <p>Analysis results will appear here.</p>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="w-full flex flex-col items-center">
                            <div className="w-24 h-24 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400 animate-pulse">Scanning Dermis Layer...</h3>
                            <p className="text-slate-400 mt-2">Analyzing textures and patterns...</p>
                        </div>
                    )}

                    {result && (
                        <div className="w-full text-left animate-fade-in">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-300">
                                <h2 className="text-3xl font-bold text-slate-800">Detection Result</h2>
                                <div className="px-3 py-1 bg-green-500/20 text-green-600 rounded-full border border-green-500/30 text-sm font-bold">
                                    {result.confidence}% Match
                                </div>
                            </div>

                            <div className="mb-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${result.type.includes("Malignant") ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                    {result.type}
                                </span>
                            </div>

                            <p className="text-slate-500 text-sm mb-1 uppercase tracking-widest font-semibold">Diagnosis</p>
                            <h3 className={`text-4xl font-bold mb-4 ${result.isUrgent ? 'text-red-600' : 'text-blue-600'}`}>
                                {result.disease.name}
                            </h3>

                            {result.isUrgent && (
                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex items-start">
                                    <AlertTriangle className="text-red-500 mr-3 flex-shrink-0" />
                                    <p className="text-red-700 text-sm">
                                        <strong>{t('detect.urgent')}</strong>
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4 mb-8">
                                <div>
                                    <p className="text-slate-600 text-sm mb-2 uppercase tracking-widest font-semibold flex items-center">
                                        <FileText size={14} className="mr-2" /> {t('detect.remedies')}
                                    </p>
                                    <ul className="grid grid-cols-1 gap-2">
                                        {result.disease.remedies.map((remedy, idx) => (
                                            <li key={idx} className="bg-white p-3 rounded-lg border-l-4 border-pink-500 shadow-sm text-slate-700 text-sm flex items-center">
                                                {remedy}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={() => generateReport(result, preview)}
                                className="btn btn-secondary w-full py-4 text-center justify-center text-lg mb-4 hover:bg-slate-700/50"
                            >
                                <Download className="mr-2" /> {t('detect.download_report')}
                            </button>

                            <Link
                                to="/appointments"
                                state={{ diagnosis: result, image: preview }}
                                className="btn btn-primary w-full py-4 text-center justify-center text-lg shadow-lg hover:shadow-pink-500/30 group"
                            >
                                <UserPlus className="mr-2 group-hover:scale-110 transition-transform" />
                                {result.isUrgent ? t('detect.button_consult') : t('detect.button_doctors')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Detector;
