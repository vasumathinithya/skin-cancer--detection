import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

export const generateReport = (result, imagePreview, appointmentDetails = null) => {
    try {
        if (!result) {
            throw new Error("No diagnosis result available to generate report.");
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Header
        doc.setFillColor(63, 81, 181); // Indigo color - similar to app theme
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("AI Skin Diagnostic Report", 20, 25);

        // Date and Time
        const now = new Date();
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${now.toLocaleString()}`, pageWidth - 20, 25, { align: 'right' });

        // Patient Info
        const patientName = appointmentDetails?.patientName || "Guest User";

        doc.setTextColor(33, 33, 33);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Patient Information", 20, 55);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Patient Name: ${patientName}`, 20, 65);
        doc.text(`Patient ID: P-${Math.floor(1000 + Math.random() * 9000)}`, 120, 65);
        doc.text(`Assessment Date: ${now.toLocaleDateString()}`, 20, 72);

        // Appointment Details (if available)
        if (appointmentDetails && appointmentDetails.doctor) {
            doc.setFillColor(240, 253, 244); // Light green bg
            doc.setDrawColor(22, 163, 74);
            doc.rect(20, 80, pageWidth - 40, 25, 'FD'); // Filled and Draw border

            doc.setTextColor(22, 101, 52); // Green text
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text("Confirmed Appointment Details", 25, 90);

            doc.setTextColor(33, 33, 33);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Doctor: ${appointmentDetails.doctor}`, 25, 98);
            doc.text(`Date: ${appointmentDetails.date}`, 85, 98);
            doc.text(`Time: ${appointmentDetails.time}`, 140, 98);
            doc.text(`Location: ${appointmentDetails.location}`, 25, 103);
        }

        // Adjust content start position based on appointment block
        let startY = (appointmentDetails && appointmentDetails.doctor) ? 115 : 85;

        if (imagePreview) {
            try {
                // Add image - standard A4 width is ~210mm
                // We'll place it on the left side
                const imgWidth = 80;
                const imgHeight = 60;

                doc.addImage(imagePreview, 'JPEG', 20, startY, imgWidth, imgHeight);

                // Draw border around image
                doc.setDrawColor(200, 200, 200);
                doc.rect(20, startY, imgWidth, imgHeight);

                doc.setFontSize(9);
                doc.setTextColor(150, 150, 150);
                doc.text("Scanned Image", 20, startY + imgHeight + 5);
            } catch (e) {
                console.error("Error adding image to PDF", e);
            }
        }

        // Diagnosis Section (Right Side)
        const col2X = 120;

        // Background box for diagnosis
        doc.setFillColor(245, 247, 250);
        doc.rect(col2X - 10, startY - 10, pageWidth - col2X - 10, 80, 'F');

        doc.setFontSize(14);
        doc.setTextColor(33, 33, 33);
        doc.setFont('helvetica', 'bold');
        doc.text("Analysis Results", col2X, startY);

        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text("Identified Condition:", col2X, startY + 15);

        doc.setFontSize(16);
        doc.setTextColor(236, 72, 153); // Pink-500 equivalent
        doc.setFont('helvetica', 'bold');
        doc.text(result.disease.name, col2X, startY + 25);

        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text("Category:", col2X, startY + 40);
        doc.setTextColor(0, 0, 0);
        doc.text(result.category, col2X, startY + 48);

        doc.setTextColor(100, 100, 100);
        doc.text("Confidence:", col2X, startY + 60);
        doc.setTextColor(0, 0, 0);
        doc.text(`${result.confidence}% Match`, col2X, startY + 68);

        // Status Indicator
        if (result.isUrgent) {
            doc.setTextColor(220, 38, 38); // Red
            doc.setFont('helvetica', 'bold');
            doc.text("(!) URGENT ATTENTION", col2X, startY - 15); // Above the box maybe? Or inside
        } else {
            doc.setTextColor(22, 163, 74); // Green
            doc.setFont('helvetica', 'bold');
            doc.text("Moderate Severity", col2X, startY - 15);
        }

        // Remedies Table
        const tableStartY = startY + 90;

        const remediesData = result.disease.remedies.map(r => [r]);

        autoTable(doc, {
            startY: tableStartY,
            head: [['Recommended Actions & Remedies']],
            body: remediesData,
            theme: 'grid',
            headStyles: { fillColor: [236, 72, 153], textColor: 255, halign: 'left' },
            styles: { fontSize: 11, cellPadding: 5 },
            margin: { left: 20, right: 20 }
        });

        // Footer / Disclaimer
        const disclaimerText = "DISCLAIMER: This report is generated by an AI model and is for informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.";

        // Safe access to lastAutoTable
        const lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY : tableStartY + 50;
        const finalY = lastY + 20;

        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.setFont('helvetica', 'italic');

        // Split text to fit
        const splitText = doc.splitTextToSize(disclaimerText, pageWidth - 40);
        doc.text(splitText, 20, Math.min(finalY, pageHeight - 15));

        // Save
        const filename = `Skin_Diagnosis_Report_${new Date().getTime()}.pdf`;
        doc.save(filename);
        console.log("PDF Saved as:", filename);

    } catch (error) {
        console.error("Report Generation Failed:", error);
        alert("Failed to generate report. Please try again.\n\nError details: " + error.message);
    }
};
