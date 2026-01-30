import { useState } from "react";
import "../../styles/admin.css";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  Download,
  Eye,
  Trash2,
  Plus,
  Edit
} from "lucide-react";

export default function DokumenAdmin() {
  const [dokumen, setDokumen] = useState([
    {
      id: 1,
      nama: "Panduan Penggunaan KASBI.pdf",
      ukuran: "2.5 MB",
      tipe: "PDF",
      tanggalUpload: "2024-03-15",
      status: "Approved",
      diuploadOleh: "Admin BPMP"
    },
    {
      id: 2,
      nama: "SOP Pengaduan Layanan.docx",
      ukuran: "1.8 MB",
      tipe: "DOCX",
      tanggalUpload: "2024-03-14",
      status: "Pending",
      diuploadOleh: "Staff ULT"
    },
    {
      id: 3,
      nama: "Jadwal Kegiatan 2024.xlsx",
      ukuran: "4.1 MB",
      tipe: "EXCEL",
      tanggalUpload: "2024-03-12",
      status: "Approved",
      diuploadOleh: "Admin Kalender"
    },
    {
      id: 4,
      nama: "Laporan Triwulan I.pdf",
      ukuran: "5.7 MB",
      tipe: "PDF",
      tanggalUpload: "2024-03-10",
      status: "Pending",
      diuploadOleh: "Staff Laporan"
    }
  ]);

  const [formData, setFormData] = useState({
    nama: "",
    file: null,
    kategori: "",
    deskripsi: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter dokumen berdasarkan search dan filter
  const filteredDokumen = dokumen.filter(doc => {
    const matchesSearch = doc.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.diuploadOleh.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file: file,
        nama: file.name
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi upload
    setTimeout(() => {
      const newDokumen = {
        id: dokumen.length + 1,
        nama: formData.nama || formData.file?.name || "File Baru",
        ukuran: `${(formData.file?.size / (1024 * 1024)).toFixed(1)} MB`,
        tipe: formData.file?.type?.split('/')[1]?.toUpperCase() || "FILE",
        tanggalUpload: new Date().toISOString().split('T')[0],
        status: "Pending",
        diuploadOleh: "Admin Sekarang"
      };

      setDokumen([newDokumen, ...dokumen]);
      setFormData({ nama: "", file: null, kategori: "", deskripsi: "" });
      setIsUploadModalOpen(false);
      setIsLoading(false);
      
      alert("Dokumen berhasil diupload! Status: Pending Review");
    }, 1500);
  };

  const handleStatusChange = (id, status) => {
    setDokumen(dokumen.map(doc => 
      doc.id === id ? { ...doc, status } : doc
    ));
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
      setDokumen(dokumen.filter(doc => doc.id !== id));
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Approved": return <CheckCircle className="status-icon approved" />;
      case "Pending": return <Clock className="status-icon pending" />;
      default: return <Clock className="status-icon pending" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Approved": return "#10B981";
      case "Pending": return "#F59E0B";
      default: return "#6B7280";
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <h1 className="page-title">
            <FileText size={28} />
            Manajemen Dokumen BPMP Papua
          </h1>
           <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Plus size={20} />
            Upload Dokumen Baru
          </button>
        </div>
        </div>
       
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Dokumen</h3>
            <p className="stat-number">{dokumen.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon approved">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Approved</h3>
            <p className="stat-number">
              {dokumen.filter(d => d.status === "Approved").length}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p className="stat-number">
              {dokumen.filter(d => d.status === "Pending").length}
            </p>
          </div>
        </div>

        
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Cari nama dokumen atau uploader..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <Filter size={20} />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Semua Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Tabel Dokumen */}
      <div className="table-container">
        <table className="dokumen-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama File</th>
              <th>Tipe</th>
              <th>Ukuran</th>
              <th>Tanggal Upload</th>
              <th>Uploader</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredDokumen.length > 0 ? (
              filteredDokumen.map((doc, index) => (
                <tr key={doc.id}>
                  <td className="text-center">{index + 1}</td>
                  <td>
                    <div className="file-info">
                      <FileText size={18} />
                      <span className="file-name">{doc.nama}</span>
                    </div>
                  </td>
                  <td>
                    <span className="file-type">{doc.tipe}</span>
                  </td>
                  <td>{doc.ukuran}</td>
                  <td>{doc.tanggalUpload}</td>
                  <td>{doc.diuploadOleh}</td>
                  <td>
                    <div className="status-cell">
                      {getStatusIcon(doc.status)}
                      <span 
                        className="status-text"
                        style={{ color: getStatusColor(doc.status) }}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon view"
                        onClick={() => setPreviewFile(doc)}
                        title="Preview"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="btn-icon download"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        className="btn-icon edit"
                        onClick={() => {
                          if (doc.status === "Pending") {
                            handleStatusChange(doc.id, "Approved");
                          }
                        }}
                        title="Approve"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                        className="btn-icon delete"
                        onClick={() => handleDelete(doc.id)}
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-state">
                  <FileText size={48} />
                  <p>Tidak ada dokumen yang ditemukan</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Upload Dokumen */}
      {isUploadModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>
                <Upload size={24} />
                Upload Dokumen Baru
              </h2>
              <button 
                className="modal-close"
                onClick={() => setIsUploadModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-group">
                <label>Nama Dokumen *</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  placeholder="Contoh: SOP Layanan 2024"
                  required
                />
              </div>

              <div className="form-group">
                <label>Kategori</label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                >
                  <option value="">Pilih Kategori</option>
                  <option value="sop">SOP</option>
                  <option value="formulir">Formulir</option>
                  <option value="laporan">Laporan</option>
                  <option value="panduan">Panduan</option>
                  <option value="jadwal">Jadwal</option>
                </select>
              </div>

              <div className="form-group">
                <label>Deskripsi</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  placeholder="Deskripsi singkat tentang dokumen..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>File Dokumen *</label>
                <div className="file-upload-area">
                  <Upload size={32} />
                  <p>Drag & drop file atau klik untuk memilih</p>
                  <p className="file-hint">Format: PDF, DOCX, XLSX, JPG (Max: 10MB)</p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    required
                  />
                  {formData.file && (
                    <div className="file-preview">
                      <FileText size={20} />
                      <span>{formData.file.name}</span>
                      <span className="file-size">
                        ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Mengupload...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Upload Dokumen
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview File */}
      {previewFile && (
        <div className="modal-overlay">
          <div className="modal-container preview-modal">
            <div className="modal-header">
              <h2>Preview Dokumen</h2>
              <button 
                className="modal-close"
                onClick={() => setPreviewFile(null)}
              >
                &times;
              </button>
            </div>
            
            <div className="preview-content">
              <div className="preview-header">
                <div className="file-icon-large">
                  <FileText size={48} />
                </div>
                <div className="preview-info">
                  <h3>{previewFile.nama}</h3>
                  <div className="file-meta">
                    <span>Tipe: {previewFile.tipe}</span>
                    <span>Ukuran: {previewFile.ukuran}</span>
                    <span>Upload: {previewFile.tanggalUpload}</span>
                  </div>
                  <div className="preview-status">
                    {getStatusIcon(previewFile.status)}
                    <span style={{ color: getStatusColor(previewFile.status) }}>
                      {previewFile.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="preview-actions">
                <button className="btn-primary">
                  <Download size={20} />
                  Download
                </button>
                {previewFile.status === "Pending" && (
                  <>
                    <button 
                      className="btn-success"
                      onClick={() => {
                        handleStatusChange(previewFile.id, "Approved");
                        setPreviewFile(null);
                      }}
                    >
                      <CheckCircle size={20} />
                      Approve
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={() => {
                        handleStatusChange(previewFile.id, "Rejected");
                        setPreviewFile(null);
                      }}
                    >
                      <XCircle size={20} />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button className="page-btn" disabled>‹ Prev</button>
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <button className="page-btn">Next ›</button>
      </div>
    </div>
  );
}