import { useState, useEffect } from "react";
import "../../styles/admin.css";
import Swal from "sweetalert2"; 
import { adminService } from "../../services/admin.service"; // Adjust path as needed
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Search, 
  Trash2,
  Plus,
  Loader, 
  ChevronLeft,
  ChevronRight,
  AlertCircle 
} from "lucide-react";

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

export default function DokumenAdmin() {
  const [dokumen, setDokumen] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [isFetching, setIsFetching] = useState(true); 
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    file: null,
    nama: "" 
  });

  // --- 1. FETCH DOCUMENTS VIA SERVICE ---
  const fetchDocuments = async () => {
    try {
      // Fetching 100 items to handle client-side filtering/pagination easily
      // You can adjust offset/limit if you want server-side pagination later
      const result = await adminService.getDocuments(0, 100);
      
      if (result.data && result.data.document_items) { 
        const mappedDocs = result.data.document_items.map((doc) => ({
          id: doc.document_id,
          nama: doc.document_name,
          tanggalUpload: doc.time_upload,
          diuploadOleh: doc.user,
          status: doc.document_status,
        }));
        setDokumen(mappedDocs);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    
    // Auto-refresh pending documents every 5 seconds
    const interval = setInterval(() => {
        setDokumen(currentDocs => {
            const hasPending = currentDocs.some(d => d.status === 'pending');
            if(hasPending) fetchDocuments();
            return currentDocs;
        });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. FILTER LOGIC ---
  const filteredDokumen = dokumen.filter(doc => 
    doc.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.diuploadOleh.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- 3. PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDokumen.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDokumen.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        file: file,
        nama: file.name
      });
    }
  };

  // --- 5. UPLOAD DOCUMENT VIA SERVICE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) return;

    setIsLoading(true);

    try {
      // Pass the raw file; the service handles FormData creation
      await adminService.uploadDocument(formData.file);

      setFormData({ file: null, nama: "" });
      setIsUploadModalOpen(false);
      await fetchDocuments(); 
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Dokumen berhasil diupload dan sedang diproses AI.',
        confirmButtonColor: '#10B981',
        timer: 3000,
        timerProgressBar: true
      });

    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.detail || 'Gagal mengupload dokumen. Silakan coba lagi.',
        confirmButtonColor: '#c8102e'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- 6. DELETE DOCUMENT VIA SERVICE ---
  const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Dokumen yang dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#c8102e', 
        cancelButtonColor: '#6B7280', 
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    try {
      await adminService.deleteDocument(id);

      setDokumen(prev => prev.filter(doc => doc.id !== id));
      
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }

      Swal.fire({
        title: 'Terhapus!',
        text: 'Dokumen telah berhasil dihapus.',
        icon: 'success',
        confirmButtonColor: '#10B981',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.response?.data?.detail || 'Terjadi kesalahan saat menghapus dokumen.',
        confirmButtonColor: '#c8102e'
      });
    }
  };

  // --- HELPER FOR STATUS ICON ---
  const renderStatus = (status) => {
    if (status === 'done') {
      return (
        <div className="status-cell">
          <CheckCircle size={18} className="text-emerald-500" style={{marginRight: '8px'}} />
          <span className="status-text" style={{ color: "#10B981", fontWeight: 500 }}>
            Selesai
          </span>
        </div>
      );
    } else if (status === 'pending') {
      return (
        <div className="status-cell">
          <Loader size={18} className="animate-spin text-blue-500" style={{marginRight: '8px'}} />
          <span className="status-text" style={{ color: "#3B82F6", fontWeight: 500 }}>
            Proses AI...
          </span>
        </div>
      );
    } else {
      return (
        <div className="status-cell">
          <AlertCircle size={18} className="text-gray-400" style={{marginRight: '8px'}} />
          <span className="status-text" style={{ color: "#9CA3AF" }}>
            {status}
          </span>
        </div>
      );
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <h1 className="page-title">
            <FileText size={28} />
            Manajemen Dokumen
          </h1>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Plus size={20} />
            Upload Dokumen
          </button>
        </div>
      </header>

      {/* Filter & Search Bar */}
      <div className="filter-bar" style={{marginTop: '20px'}}>
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Cari nama dokumen atau uploader..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      {/* Tabel Dokumen */}
      <div className="table-container">
        <table className="dokumen-table">
          <thead>
            <tr>
              <th width="50">No</th>
              <th>Nama File</th>
              <th>Tanggal Upload</th>
              <th>Uploader</th>
              <th>Status</th>
              <th style={{textAlign: 'center', width: '80px'}}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
               <tr>
               <td colSpan="6" className="empty-state">
                 <Loader size={24} className="animate-spin" />
                 <p>Memuat data...</p>
               </td>
             </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((doc, index) => (
                <tr key={doc.id}>
                  <td className="text-center">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td>
                    <div className="file-info">
                      <FileText size={18} />
                      <span className="file-name" title={doc.nama}>
                        {doc.nama.length > 50 ? doc.nama.substring(0, 50) + "..." : doc.nama}
                      </span>
                    </div>
                  </td>
                  <td>{formatDate(doc.tanggalUpload)}</td>
                  <td>{doc.diuploadOleh}</td>
                  <td>
                    {renderStatus(doc.status)}
                  </td>
                  <td>
                    <div className="action-buttons" style={{justifyContent: 'center'}}>
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
                <td colSpan="6" className="empty-state">
                  <FileText size={48} />
                  <p>Tidak ada dokumen yang ditemukan</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!isFetching && filteredDokumen.length > 0 && (
        <div className="pagination">
          <button 
            className="page-btn" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          
          <button 
            className="page-btn active"
            style={{cursor: 'default'}}
          >
            {currentPage}
          </button>

          <button 
            className="page-btn" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
          
          <span className="page-info">
             dari {totalPages}
          </span>
        </div>
      )}

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
                <label>File Dokumen *</label>
                <div className="file-upload-area">
                  <Upload size={32} />
                  <p>Drag & drop file atau klik untuk memilih</p>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.md"
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
                      <Loader size={18} className="animate-spin" style={{marginRight: '8px'}} />
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
    </div>
  );
}