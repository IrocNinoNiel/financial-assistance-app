import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface SchedulePDFData {
    scheduleType: 'TEST' | 'INTERVIEW';
    studentName: string;
    sponsorshipName: string;
    location: string;
    startDate: Date;
    endDate: Date;
    batchNo: number;
    documentCode?: string;
    instructions?: string[];
}

export interface GeneratedPDF {
    filePath: string;
    fileName: string;
    buffer?: Buffer;
}

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'schedules');

// Ensure uploads directory exists
const ensureUploadsDir = () => {
    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
};

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

export const generateSchedulePDF = async (data: SchedulePDFData): Promise<GeneratedPDF> => {
    ensureUploadsDir();

    const fileName = `schedule_${data.scheduleType.toLowerCase()}_${Date.now()}.pdf`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });

            const chunks: Buffer[] = [];
            const writeStream = fs.createWriteStream(filePath);

            doc.pipe(writeStream);
            doc.on('data', (chunk) => chunks.push(chunk));

            // Header
            doc.fontSize(20)
                .font('Helvetica-Bold')
                .text('FINANCIAL ASSISTANCE SYSTEM', { align: 'center' });

            doc.moveDown(0.5);

            doc.fontSize(16)
                .font('Helvetica-Bold')
                .text(`${data.scheduleType} SCHEDULE NOTIFICATION`, { align: 'center' });

            doc.moveDown(1.5);

            // Horizontal line
            doc.moveTo(50, doc.y)
                .lineTo(545, doc.y)
                .stroke();

            doc.moveDown(1);

            // Greeting
            doc.fontSize(12)
                .font('Helvetica')
                .text(`Dear ${data.studentName},`, { align: 'left' });

            doc.moveDown(0.5);

            // Main content
            const scheduleTypeText = data.scheduleType === 'TEST' ? 'examination' : 'interview';
            doc.text(`You are hereby notified that you have been scheduled for ${scheduleTypeText === 'examination' ? 'an' : 'an'} ${scheduleTypeText} for your financial assistance application.`);

            doc.moveDown(1);

            // Schedule Details Section
            doc.fontSize(14)
                .font('Helvetica-Bold')
                .text('Schedule Details', { underline: true });

            doc.moveDown(0.5);

            const detailsStartX = 50;
            const detailsValueX = 180;

            doc.fontSize(12).font('Helvetica-Bold').text('Sponsorship:', detailsStartX, doc.y);
            doc.font('Helvetica').text(data.sponsorshipName, detailsValueX, doc.y - 12);

            doc.moveDown(0.3);

            doc.font('Helvetica-Bold').text('Schedule Type:', detailsStartX, doc.y);
            doc.font('Helvetica').text(data.scheduleType, detailsValueX, doc.y - 12);

            doc.moveDown(0.3);

            doc.font('Helvetica-Bold').text('Batch No:', detailsStartX, doc.y);
            doc.font('Helvetica').text(data.batchNo.toString(), detailsValueX, doc.y - 12);

            doc.moveDown(0.3);

            doc.font('Helvetica-Bold').text('Date:', detailsStartX, doc.y);
            doc.font('Helvetica').text(formatDate(data.startDate), detailsValueX, doc.y - 12);

            doc.moveDown(0.3);

            doc.font('Helvetica-Bold').text('Time:', detailsStartX, doc.y);
            doc.font('Helvetica').text(`${formatTime(data.startDate)} - ${formatTime(data.endDate)}`, detailsValueX, doc.y - 12);

            doc.moveDown(0.3);

            doc.font('Helvetica-Bold').text('Location:', detailsStartX, doc.y);
            doc.font('Helvetica').text(data.location, detailsValueX, doc.y - 12);

            if (data.documentCode) {
                doc.moveDown(0.3);
                doc.font('Helvetica-Bold').text('Document Code:', detailsStartX, doc.y);
                doc.font('Helvetica').text(data.documentCode, detailsValueX, doc.y - 12);
            }

            doc.moveDown(1.5);

            // Instructions Section
            doc.fontSize(14)
                .font('Helvetica-Bold')
                .text('Important Reminders', { underline: true });

            doc.moveDown(0.5);

            const defaultInstructions = [
                'Please arrive at least 30 minutes before your scheduled time.',
                'Bring a valid ID and all required documents.',
                'Wear appropriate attire.',
                'Ensure you have your application reference number.',
                'Contact the coordinator if you have any concerns or need to reschedule.'
            ];

            const instructions = data.instructions || defaultInstructions;

            doc.fontSize(11).font('Helvetica');
            instructions.forEach((instruction, index) => {
                doc.text(`${index + 1}. ${instruction}`, { indent: 20 });
                doc.moveDown(0.3);
            });

            doc.moveDown(1);

            // Horizontal line
            doc.moveTo(50, doc.y)
                .lineTo(545, doc.y)
                .stroke();

            doc.moveDown(1);

            // Footer
            doc.fontSize(10)
                .font('Helvetica-Oblique')
                .text('This is a system-generated document. No signature required.', { align: 'center' });

            doc.moveDown(0.5);

            doc.fontSize(10)
                .font('Helvetica')
                .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

            doc.end();

            writeStream.on('finish', () => {
                const buffer = Buffer.concat(chunks);
                resolve({
                    filePath,
                    fileName,
                    buffer
                });
            });

            writeStream.on('error', (err) => {
                reject(err);
            });

        } catch (error) {
            reject(error);
        }
    });
};

export const generateSchedulePDFBuffer = async (data: SchedulePDFData): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });

            const chunks: Buffer[] = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Header
            doc.fontSize(20)
                .font('Helvetica-Bold')
                .text('FINANCIAL ASSISTANCE SYSTEM', { align: 'center' });

            doc.moveDown(0.5);

            doc.fontSize(16)
                .font('Helvetica-Bold')
                .text(`${data.scheduleType} SCHEDULE NOTIFICATION`, { align: 'center' });

            doc.moveDown(1.5);

            // Horizontal line
            doc.moveTo(50, doc.y)
                .lineTo(545, doc.y)
                .stroke();

            doc.moveDown(1);

            // Greeting
            doc.fontSize(12)
                .font('Helvetica')
                .text(`Dear ${data.studentName},`, { align: 'left' });

            doc.moveDown(0.5);

            // Main content
            const scheduleTypeText = data.scheduleType === 'TEST' ? 'examination' : 'interview';
            doc.text(`You are hereby notified that you have been scheduled for ${scheduleTypeText === 'examination' ? 'an' : 'an'} ${scheduleTypeText} for your financial assistance application.`);

            doc.moveDown(1);

            // Schedule Details Section
            doc.fontSize(14)
                .font('Helvetica-Bold')
                .text('Schedule Details', { underline: true });

            doc.moveDown(0.5);

            const detailsStartX = 50;
            const detailsValueX = 180;

            doc.fontSize(12).font('Helvetica-Bold').text('Sponsorship:', detailsStartX, doc.y);
            doc.font('Helvetica').text(data.sponsorshipName, detailsValueX, doc.y - 12);

            doc.moveDown(0.3);

            doc.font('Helvetica-Bold').text('Schedule Type:', detailsStartX, doc.y);
            doc.font('Helvetica').text(data.scheduleType, detailsValueX, doc.y - 12);

            doc.moveDown(0.3);

            doc.font('Helvetica-Bold').text('Batch No:', detailsStartX, doc.y);
            doc.font('Helvetica').text(data.batchNo.toString(), detailsValueX, doc.y - 12);

            doc.moveDown(0.3);

            doc.font('Helvetica-Bold').text('Date:', detailsStartX, doc.y);
            doc.font('Helvetica').text(formatDate(data.startDate), detailsValueX, doc.y - 12);

            doc.moveDown(0.3);

            doc.font('Helvetica-Bold').text('Time:', detailsStartX, doc.y);
            doc.font('Helvetica').text(`${formatTime(data.startDate)} - ${formatTime(data.endDate)}`, detailsValueX, doc.y - 12);

            doc.moveDown(0.3);

            doc.font('Helvetica-Bold').text('Location:', detailsStartX, doc.y);
            doc.font('Helvetica').text(data.location, detailsValueX, doc.y - 12);

            if (data.documentCode) {
                doc.moveDown(0.3);
                doc.font('Helvetica-Bold').text('Document Code:', detailsStartX, doc.y);
                doc.font('Helvetica').text(data.documentCode, detailsValueX, doc.y - 12);
            }

            doc.moveDown(1.5);

            // Instructions Section
            doc.fontSize(14)
                .font('Helvetica-Bold')
                .text('Important Reminders', { underline: true });

            doc.moveDown(0.5);

            const defaultInstructions = [
                'Please arrive at least 30 minutes before your scheduled time.',
                'Bring a valid ID and all required documents.',
                'Wear appropriate attire.',
                'Ensure you have your application reference number.',
                'Contact the coordinator if you have any concerns or need to reschedule.'
            ];

            const instructions = data.instructions || defaultInstructions;

            doc.fontSize(11).font('Helvetica');
            instructions.forEach((instruction, index) => {
                doc.text(`${index + 1}. ${instruction}`, { indent: 20 });
                doc.moveDown(0.3);
            });

            doc.moveDown(1);

            // Horizontal line
            doc.moveTo(50, doc.y)
                .lineTo(545, doc.y)
                .stroke();

            doc.moveDown(1);

            // Footer
            doc.fontSize(10)
                .font('Helvetica-Oblique')
                .text('This is a system-generated document. No signature required.', { align: 'center' });

            doc.moveDown(0.5);

            doc.fontSize(10)
                .font('Helvetica')
                .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};

export const deletePDFFile = (filePath: string): boolean => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting PDF file:', error);
        return false;
    }
};
