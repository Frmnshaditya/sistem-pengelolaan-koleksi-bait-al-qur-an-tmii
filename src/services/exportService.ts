import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Collection } from '../types';

export interface ReportExportOptions {
  title?: string;
  subtitle?: string;
  generatedBy?: string;
  filterDescription?: string;
  includeSignatures?: boolean;
  sheetName?: string;
}

export const exportService = {
  // Export to PDF
  exportToPDF(collections: Collection[], options: ReportExportOptions = {}) {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const title = options.title || "LAPORAN DATA INVENTARIS KOLEKSI MUSEUM BAIT AL-QUR'AN TMII";
    const subtitle = options.subtitle || "Kompleks Bayt Al-Qur'an & Museum Istiqlal - Taman Mini Indonesia Indah, Jakarta";
    const user = options.generatedBy || "Administrator Sistem";
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Header Background
    doc.setFillColor(0, 30, 21); // #001e15 Deep Emerald
    doc.rect(0, 0, 297, 28, 'F');

    // Header Gold Stripe
    doc.setFillColor(253, 138, 66); // #fd8a42 Gold
    doc.rect(0, 28, 297, 2, 'F');

    // Header Text
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(title, 14, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(200, 220, 210);
    doc.text(subtitle, 14, 19);

    // Meta row
    doc.setTextColor(60, 70, 65);
    doc.setFontSize(9);
    doc.text(`Dicetak Oleh: ${user}`, 14, 37);
    doc.text(`Tanggal Cetak: ${dateStr}`, 150, 37);
    doc.text(`Total Koleksi: ${collections.length} Benda`, 240, 37);

    if (options.filterDescription) {
      doc.setFont('helvetica', 'italic');
      doc.text(`Kriteria Filter: ${options.filterDescription}`, 14, 43);
    }

    // Table Data
    const tableData = collections.map((item, index) => [
      index + 1,
      item.inventory_code,
      item.name,
      item.category_name || '-',
      item.origin_region || '-',
      item.period_year || '-',
      item.condition_name || '-',
      item.location_name || '-',
      item.status.toUpperCase()
    ]);

    const startY = options.filterDescription ? 48 : 42;

    autoTable(doc, {
      startY: startY,
      head: [[
        'No',
        'Kode Inv.',
        'Nama Koleksi',
        'Kategori',
        'Asal Daerah',
        'Periode / Tahun',
        'Kondisi',
        'Lokasi Simpan',
        'Status'
      ]],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        textColor: [30, 30, 30]
      },
      headStyles: {
        fillColor: [0, 53, 39], // #003527
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8.5
      },
      alternateRowStyles: {
        fillColor: [247, 248, 245]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 26, fontStyle: 'bold' },
        2: { cellWidth: 58 },
        3: { cellWidth: 32 },
        4: { cellWidth: 32 },
        5: { cellWidth: 26 },
        6: { cellWidth: 32 },
        7: { cellWidth: 42 },
        8: { cellWidth: 20, halign: 'center' }
      },
      margin: { left: 14, right: 14, bottom: 20 }
    });

    // Signature Footer
    const finalY = (doc as any).lastAutoTable.finalY || 160;
    if (finalY < 165) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text("Mengetahui,", 230, finalY + 12);
      doc.text("Kepala Kurator Museum Bait Al-Qur'an TMII", 210, finalY + 16);
      doc.text("( __________________________ )", 215, finalY + 32);
    }

    // Page Number
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(130, 130, 130);
      doc.text(
        `Dokumen Resmi Sistem Informasi Museum Bait Al-Qur'an TMII - Halaman ${i} dari ${pageCount}`,
        14,
        205
      );
    }

    // Download
    const fileName = `Laporan_Koleksi_BaitAlQuran_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  },

  // Export to Excel (.xlsx)
  exportToExcel(collections: Collection[], options: ReportExportOptions = {}) {
    const dataForSheet = collections.map((c, idx) => ({
      No: idx + 1,
      'Kode Inventaris': c.inventory_code,
      'Nama Koleksi': c.name,
      'Kategori': c.category_name || '',
      'Jenis Koleksi': c.collection_type_name || '',
      'Asal Daerah': c.origin_region,
      'Periode / Tahun': c.period_year,
      'Bahan / Material': c.material,
      'Dimensi': c.dimensions,
      'Kondisi': c.condition_name || '',
      'Lokasi Penyimpanan': c.location_name || '',
      'Sumber Perolehan': c.acquisition_source_name || '',
      'Tanggal Perolehan': c.acquisition_date,
      'Status': c.status,
      'Deskripsi': c.description,
      'Nilai Historis': c.historical_significance,
      'Keterangan Tambahan': c.additional_notes || '',
      'Jumlah Foto': c.images.length,
      'Terakhir Diperbarui': c.updated_at
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForSheet);

    // Auto-fit column widths
    const colWidths = Object.keys(dataForSheet[0] || {}).map(key => ({
      wch: Math.max(key.length + 4, 15)
    }));
    colWidths[2] = { wch: 40 }; // Nama Koleksi
    colWidths[14] = { wch: 50 }; // Deskripsi
    colWidths[15] = { wch: 50 }; // Nilai Historis
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Koleksi');

    const fileName = `Data_Koleksi_BaitAlQuran_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  },

  // Export Single Collection Curatorial Sheet to PDF
  exportSingleCollectionPDF(collection: Collection) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Header Background
    doc.setFillColor(0, 30, 21); // #001e15
    doc.rect(0, 0, 210, 30, 'F');

    // Gold Stripe
    doc.setFillColor(253, 138, 66); // #fd8a42
    doc.rect(0, 30, 210, 2.5, 'F');

    // Header Text
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.text("KEMENTERIAN AGAMA REPUBLIK INDONESIA", 14, 12);

    doc.setFontSize(11);
    doc.setTextColor(253, 138, 66);
    doc.text("BAYT AL-QUR'AN & MUSEUM ISTIQLAL (BQMI) TMII", 14, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(190, 215, 205);
    doc.text("Kompleks Taman Mini Indonesia Indah (TMII), Jakarta Timur • Telp: (021) 8779-1144", 14, 24);

    // Document Title
    doc.setTextColor(0, 30, 21);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text("LEMBAR KAJIAN KURATORIAL & SPESIFIKASI NASKAH", 14, 42);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Nomor Registrasi Vitrin: REG-${collection.inventory_code}  |  Tanggal Cetak: ${dateStr}`, 14, 48);

    // Specs Box
    doc.setFillColor(248, 249, 246);
    doc.setDrawColor(220, 225, 220);
    doc.roundedRect(14, 52, 182, 38, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 30, 21);
    doc.text(collection.name, 18, 59);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text("Kategori:", 18, 66);
    doc.text("Asal Wilayah:", 18, 72);
    doc.text("Bahan / Alas:", 18, 78);
    doc.text("Lokasi Simpan:", 18, 84);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 20, 20);
    doc.text(collection.category_name || '-', 45, 66);
    doc.text(collection.origin_region || '-', 45, 72);
    doc.text(collection.material || '-', 45, 78);
    doc.text(collection.location_name || '-', 45, 84);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text("Periode / Tahun:", 110, 66);
    doc.text("Dimensi Fisik:", 110, 72);
    doc.text("Kondisi Naskah:", 110, 78);
    doc.text("Status Pamer:", 110, 84);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 20, 20);
    doc.text(collection.period_year || '-', 142, 66);
    doc.text(collection.dimensions || '-', 142, 72);
    doc.text(collection.condition_name || '-', 142, 78);
    doc.text(collection.status.toUpperCase(), 142, 84);

    // Section 1: Physical Description
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 30, 21);
    doc.text("1. DESKRIPSI FISIK & KODIKOLOGI", 14, 98);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    const splitDesc = doc.splitTextToSize(collection.description, 182);
    doc.text(splitDesc, 14, 104);

    const descHeight = splitDesc.length * 4.5;

    // Section 2: Historical Significance
    const sigY = Math.max(104 + descHeight + 6, 140);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 30, 21);
    doc.text("2. NILAI HISTORIS & MAKNA FILOLOGIS", 14, sigY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    const splitSig = doc.splitTextToSize(collection.historical_significance, 182);
    doc.text(splitSig, 14, sigY + 6);

    const sigHeight = splitSig.length * 4.5;

    // Section 3: Notes if exists
    let noteY = sigY + 6 + sigHeight + 6;
    if (collection.additional_notes) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 30, 21);
      doc.text("3. CATATAN TAMBAHAN & KONSERVASI", 14, noteY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(50, 50, 50);
      const splitNotes = doc.splitTextToSize(collection.additional_notes, 182);
      doc.text(splitNotes, 14, noteY + 6);
      noteY += 6 + (splitNotes.length * 4.5);
    }

    // Signatures at Bottom
    const signY = Math.max(noteY + 10, 232);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);

    // Left Signature
    doc.text("Pemeriksa Konservasi Fisik,", 14, signY);
    doc.text("Laboratorium Konservasi BQMI TMII", 14, signY + 4);
    doc.setFont('helvetica', 'bold');
    doc.text("Drs. H. M. Zainuri, M.Ag", 14, signY + 24);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text("NIP. 19680512 199403 1 003", 14, signY + 28);

    // Right Signature
    doc.setFontSize(8.5);
    doc.text(`Jakarta, ${dateStr}`, 135, signY);
    doc.text("Kepala Unit Kurasi & Registrasi TMII", 135, signY + 4);
    doc.setFont('helvetica', 'bold');
    doc.text("Dr. H. Muchlis M. Hanafi, M.A.", 135, signY + 24);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text("NIP. 19710818 199803 1 002", 135, signY + 28);

    // Footer Bar
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 280, 196, 280);
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(`SIPDK Museum Bait Al-Qur'an & Museum Istiqlal TMII • Dokumen Registrasi Koleksi ${collection.inventory_code}`, 14, 284);

    doc.save(`Lembar_Kurasi_${collection.inventory_code}.pdf`);
  },

  // Print Report
  printReport() {
    window.print();
  }
};
