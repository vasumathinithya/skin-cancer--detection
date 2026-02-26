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
        const margin = 20;

        // --- COLORS & STYLES ---
        const colors = {
            primary: [30, 64, 175],     // Dark Blue (Header)
            secondary: [59, 130, 246],  // Lighter Blue (Accents)
            success: [22, 163, 74],     // Green
            warning: [234, 88, 12],     // Orange
            danger: [220, 38, 38],      // Red
            text: [31, 41, 55],         // Dark Gray
            lightText: [107, 114, 128], // Light Gray
            bg: [243, 244, 246]         // Very Light Gray
        };

        // --- HEADER ---
        doc.setFillColor(...colors.primary);
        doc.rect(0, 0, pageWidth, 40, 'F');

        // Logo / Title area
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text("DermaAI", margin, 20);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text("Advanced Skin Diagnostic System", margin, 27);

        // Right side header info
        const now = new Date();
        doc.setFontSize(9);
        doc.text("REPORT ID", pageWidth - margin, 15, { align: 'right' });
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`#${Math.floor(100000 + Math.random() * 900000)}`, pageWidth - margin, 20, { align: 'right' });

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(now.toLocaleDateString() + " " + now.toLocaleTimeString(), pageWidth - margin, 28, { align: 'right' });

        // --- PATIENT INFO SECTION ---
        let currentY = 55;

        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(margin, currentY, pageWidth - margin, currentY); // Top line

        currentY += 10;

        const patientName = appointmentDetails?.patientName || "Guest Patient";
        const patientId = "P-" + Math.floor(1000 + Math.random() * 9000);

        // Column 1
        doc.setFontSize(10);
        doc.setTextColor(...colors.lightText);
        doc.text("PATIENT NAME", margin, currentY);

        doc.setFontSize(12);
        doc.setTextColor(...colors.text);
        doc.setFont('helvetica', 'bold');
        doc.text(patientName, margin, currentY + 7);

        // Column 2
        doc.setFontSize(10);
        doc.setTextColor(...colors.lightText);
        doc.setFont('helvetica', 'normal');
        doc.text("PATIENT ID", margin + 60, currentY);

        doc.setFontSize(12);
        doc.setTextColor(...colors.text);
        doc.setFont('helvetica', 'bold');
        doc.text(patientId, margin + 60, currentY + 7);

        // Column 3
        doc.setFontSize(10);
        doc.setTextColor(...colors.lightText);
        doc.setFont('helvetica', 'normal');
        doc.text("ASSESSMENT DATE", margin + 120, currentY);

        doc.setFontSize(12);
        doc.setTextColor(...colors.text);
        doc.setFont('helvetica', 'bold');
        doc.text(now.toLocaleDateString(), margin + 120, currentY + 7);

        currentY += 20;

        // --- APPOINTMENT DETAILS (If exists) ---
        if (appointmentDetails && appointmentDetails.doctor) {
            // Background box
            doc.setFillColor(240, 253, 244); // Light Green
            doc.setDrawColor(...colors.success);
            doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 24, 2, 2, 'FD');

            // Icon/Label
            doc.setTextColor(...colors.success);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text("UPCOMING APPOINTMENT CONFIRMED", margin + 5, currentY + 8);

            // Details Line
            doc.setTextColor(...colors.text);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');

            const doctorText = `Doctor: ${appointmentDetails.doctor}`;
            const timeText = `When: ${appointmentDetails.date} at ${appointmentDetails.time}`;
            const locText = `Location: ${appointmentDetails.location}`;

            doc.text(doctorText, margin + 5, currentY + 16);
            doc.text(timeText, margin + 70, currentY + 16);

            // Location might be long
            if (doc.getTextWidth(locText) > 80) {
                doc.setFontSize(9);
            }
            doc.text(locText, margin + 130, currentY + 16);

            currentY += 35;
        } else {
            currentY += 10;
        }

        // --- DIAGNOSIS & IMAGING SECTION ---

        // Section Title
        doc.setFillColor(...colors.bg);
        doc.rect(margin, currentY, pageWidth - (margin * 2), 8, 'F');
        doc.setTextColor(...colors.primary);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("CLINICAL ASSESSMENT & IMAGING", margin + 2, currentY + 5.5);

        currentY += 15;

        // Left Column: Image
        if (imagePreview) {
            const imgWidth = 70;
            const imgHeight = 55;

            // Image Frame
            doc.setDrawColor(220, 220, 220);
            doc.setFillColor(255, 255, 255);
            doc.rect(margin, currentY, imgWidth, imgHeight, 'FD');

            try {
                // Add margins inside the frame
                doc.addImage(imagePreview, 'JPEG', margin + 2, currentY + 2, imgWidth - 4, imgHeight - 4, undefined, 'FAST');
            } catch (e) {
                console.error("Image add error", e);
                doc.text("Image Error", margin + 10, currentY + 20);
            }

            doc.setFontSize(8);
            doc.setTextColor(...colors.lightText);
            doc.text("Captured Skin Sample", margin, currentY + imgHeight + 5);
        }

        // Right Column: Diagnosis Details
        const col2X = margin + 80;

        doc.setFontSize(10);
        doc.setTextColor(...colors.lightText);
        doc.text("PRIMARY CONDITION DETECTED", col2X, currentY + 5);

        doc.setFontSize(18);
        doc.setTextColor(220, 38, 38); // Red for condition urgency or just standard dark text
        if (!result.isUrgent) doc.setTextColor(...colors.primary);

        doc.setFont('helvetica', 'bold');
        doc.text(result.disease.name, col2X, currentY + 14);

        // Tags Line
        const categoryText = `Category: ${result.category}`;
        doc.setFontSize(10);
        doc.setTextColor(...colors.text);
        doc.setFont('helvetica', 'normal');
        doc.text(categoryText, col2X, currentY + 24);

        // Severity Badge
        const severityY = currentY + 32;
        const severityText = result.isUrgent ? "URGENT ATTENTION REQUIRED" : "Moderate Severity Pattern";
        const severityColor = result.isUrgent ? colors.danger : colors.success;

        doc.setFillColor(...severityColor);
        doc.roundedRect(col2X, severityY, doc.getTextWidth(severityText) + 6, 7, 1, 1, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(severityText, col2X + 3, severityY + 4.5);

        // Confidence Meter
        const confidenceY = severityY + 12;
        doc.setTextColor(...colors.lightText);
        doc.setFont('helvetica', 'normal');
        doc.text("AI Confidence Level", col2X, confidenceY);

        const meterWidth = 60;
        const meterHeight = 4;
        const meterY = confidenceY + 3;

        // Background track
        doc.setFillColor(229, 231, 235);
        doc.roundedRect(col2X, meterY, meterWidth, meterHeight, 1, 1, 'F');

        // Progress fill
        const fillWidth = (result.confidence / 100) * meterWidth;
        doc.setFillColor(...colors.primary);
        doc.roundedRect(col2X, meterY, fillWidth, meterHeight, 1, 1, 'F');

        doc.setFontSize(9);
        doc.setTextColor(...colors.text);
        doc.text(`${result.confidence}%`, col2X + meterWidth + 5, meterY + 3);

        currentY += 75; // Move past image/diagnosis section

        // --- ANALYSIS / REMEDIES ---

        // AI Analysis Text
        if (result.aiAnalysis) {
            doc.setFillColor(240, 248, 255); // AliceBlue
            doc.rect(margin, currentY, pageWidth - (margin * 2), 10, 'F');
            doc.setFontSize(11);
            doc.setTextColor(0, 51, 102);
            doc.setFont('helvetica', 'bold');
            doc.text("AI DETECTED CLINICAL INSIGHTS", margin + 3, currentY + 7);

            currentY += 15;

            doc.setFontSize(10);
            doc.setTextColor(55, 65, 81);
            doc.setFont('helvetica', 'normal');

            // Clean markdown
            const cleanText = result.aiAnalysis.replace(/\*\*/g, "").replace(/#/g, "").replace(/\n\n/g, "\n");
            const splitLines = doc.splitTextToSize(cleanText, pageWidth - (margin * 2));

            doc.text(splitLines, margin, currentY);
            currentY += (splitLines.length * 5) + 10;
        }

        // Remedies Table
        const remedies = result.disease.remedies || [];
        if (remedies.length > 0) {
            // Check if we need a new page
            if (currentY > pageHeight - 60) {
                doc.addPage();
                currentY = 20;
            }

            autoTable(doc, {
                startY: currentY,
                head: [['RECOMMENDED REMEDIES & ACTIONS']],
                body: remedies.map(r => [r]),
                theme: 'striped',
                headStyles: {
                    fillColor: colors.primary,
                    textColor: 255,
                    fontStyle: 'bold',
                    fontSize: 10,
                    halign: 'left'
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 6,
                    textColor: colors.text
                },
                alternateRowStyles: {
                    fillColor: [249, 250, 251]
                },
                margin: { left: margin, right: margin }
            });

            currentY = doc.lastAutoTable.finalY + 20;
        }

        // --- FOOTER ---
        const footerY = pageHeight - 25;

        doc.setDrawColor(200, 200, 200);
        doc.line(margin, footerY, pageWidth - margin, footerY);

        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.setFont('helvetica', 'italic');

        const disclaimer = "DISCLAIMER: This report is generated by an AI model for informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment.";
        const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - (margin * 2));

        doc.text(splitDisclaimer, margin, footerY + 8);

        doc.setFont('helvetica', 'bold');
        doc.text("DermaAI Confidential", pageWidth - margin, footerY + 8, { align: 'right' });


        // Save
        const filename = `DermaAI_Report_${new Date().getTime()}.pdf`;
        doc.save(filename);

    } catch (error) {
        console.error("Report Generation Failed:", error);
        alert("Failed to generate report. \n" + error.message);
    }
};
