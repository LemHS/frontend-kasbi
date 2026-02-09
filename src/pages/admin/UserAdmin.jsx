import { useState, useEffect } from "react";
import { 
  Shield, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { adminService } from "../../services/admin.service";

export default function AdminsPage() {
  // --- STATE ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination State
  const [offset, setOffset] = useState(0);
  const limit = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [currentUser, setCurrentUser] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    is_active: true
  });

  // --- FETCH DATA ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers(offset, limit);
      const fetchedUsers = response.data?.user_items || [];
      setUsers(fetchedUsers);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Gagal memuat data admin. Pastikan server berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  // --- HANDLERS ---

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const openCreateModal = () => {
    setModalMode("create");
    // Removed full_name
    setFormData({ username: "", email: "", password: "", is_active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    setCurrentUser(user);
    // Removed full_name
    setFormData({ 
      username: user.username, 
      email: user.email, 
      password: "", 
      is_active: true 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modalMode === "create") {
        await adminService.createUser({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        alert("Admin berhasil ditambahkan!");
      } else {
        const updatePayload = {};
        if (formData.password) updatePayload.password = formData.password;
        if (formData.username) updatePayload.username = formData.username;
        updatePayload.email = formData.email;

        await adminService.updateUser(parseInt(currentUser.id), updatePayload);
        alert("Data admin berhasil diperbarui!");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Yakin ingin menghapus admin "${user.username}"?`)) return;

    try {
      await adminService.deleteUser({
        username: user.username,
        email: user.email
      });
      alert("Admin berhasil dihapus.");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus admin.");
    }
  };

  // --- RENDER ---
  
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Kelola Admin</h2>
          <p style={styles.subtitle}>Manajemen akun akses dashboard admin</p>
        </div>
        <button onClick={openCreateModal} style={styles.addButton}>
          <Plus size={18} />
          <span>Tambah Admin</span>
        </button>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <Search size={18} style={{ color: '#9ca3af' }} />
          <input 
            type="text" 
            placeholder="Cari username atau email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Content Table */}
      <div style={styles.tableCard}>
        {loading && users.length === 0 ? (
          <div style={styles.loadingState}>
            <Loader2 size={32} className="animate-spin" />
            <p>Memuat data...</p>
          </div>
        ) : error ? (
          <div style={styles.errorState}>
            <AlertCircle size={32} />
            <p>{error}</p>
          </div>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.thAction}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          <div style={styles.avatarPlaceholder}>{user.username[0].toUpperCase()}</div>
                          <span style={{fontWeight: 500}}>{user.username}</span>
                        </div>
                      </td>
                      <td style={styles.td}>{user.email}</td>
                      <td style={styles.td}>
                        <span style={styles.roleBadge}>
                          <Shield size={12} /> ADMIN
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.activeBadge}>Aktif</span>
                      </td>
                      <td style={styles.tdAction}>
                        <button 
                          onClick={() => openEditModal(user)} 
                          style={styles.actionBtnEdit}
                          title="Edit Password/Data"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user)} 
                          style={styles.actionBtnDelete}
                          title="Hapus User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={styles.emptyState}>
                      Tidak ada data admin ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div style={styles.pagination}>
          <button 
            disabled={offset === 0} 
            onClick={() => setOffset(Math.max(0, offset - limit))}
            style={{...styles.pageBtn, opacity: offset === 0 ? 0.5 : 1}}
          >
            <ChevronLeft size={16} /> Sebelumnya
          </button>
          <span style={styles.pageInfo}>
            Menampilkan {offset + 1}-{offset + filteredUsers.length}
          </span>
          <button 
            disabled={filteredUsers.length < limit} 
            onClick={() => setOffset(offset + limit)}
            style={{...styles.pageBtn, opacity: filteredUsers.length < limit ? 0.5 : 1}}
          >
            Selanjutnya <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {modalMode === 'create' ? 'Tambah Admin Baru' : 'Edit Admin'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Username</label>
                <input 
                  type="text" 
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  style={modalMode === 'edit' ? {...styles.input, ...styles.inputDisabled} : styles.input}
                  disabled={modalMode === 'edit'}
                />
                {modalMode === 'edit' && (
                  <p style={styles.helperText}>Email tidak dapat diubah.</p>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  {modalMode === 'edit' ? 'Password Baru (Kosongkan jika tidak ubah)' : 'Password'}
                </label>
                <input 
                  type="password" 
                  name="password"
                  required={modalMode === 'create'}
                  value={formData.password}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="********"
                />
              </div>

              <div style={styles.modalFooter}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  style={styles.cancelBtn}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  style={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : (modalMode === 'create' ? 'Buat Admin' : 'Simpan Perubahan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- STYLES ---
const styles = {
  container: {
    padding: '0 10px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 5px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#c8102e',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(200, 16, 46, 0.3)',
    transition: 'background 0.2s'
  },
  toolbar: {
    marginBottom: '20px',
    display: 'flex',
    gap: '15px'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '10px 15px',
    flex: 1,
    maxWidth: '400px'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '14px'
  },
  tableCard: {
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  th: {
    textAlign: 'left',
    padding: '15px 20px',
    background: '#f9fafb',
    color: '#4b5563',
    fontWeight: '600',
    borderBottom: '1px solid #e5e7eb'
  },
  thAction: {
    textAlign: 'right',
    padding: '15px 20px',
    background: '#f9fafb',
    color: '#4b5563',
    fontWeight: '600',
    borderBottom: '1px solid #e5e7eb'
  },
  tr: {
    borderBottom: '1px solid #f3f4f6',
    transition: 'background 0.1s'
  },
  td: {
    padding: '15px 20px',
    color: '#1f2937',
    verticalAlign: 'middle'
  },
  tdAction: {
    padding: '15px 20px',
    textAlign: 'right',
    verticalAlign: 'middle'
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatarPlaceholder: {
    width: '32px',
    height: '32px',
    background: '#e0e7ff',
    color: '#4338ca',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px'
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '12px',
    background: '#eff6ff',
    color: '#2563eb',
    fontSize: '11px',
    fontWeight: '600',
    border: '1px solid #dbeafe'
  },
  activeBadge: {
    padding: '2px 8px',
    borderRadius: '12px',
    background: '#ecfdf5',
    color: '#059669',
    fontSize: '11px',
    fontWeight: '600',
    border: '1px solid #d1fae5'
  },
  actionBtnEdit: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    cursor: 'pointer',
    padding: '6px',
    marginRight: '5px',
    borderRadius: '4px'
  },
  actionBtnDelete: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '4px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280'
  },
  loadingState: {
    padding: '40px',
    textAlign: 'center',
    color: '#6b7280',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  errorState: {
    padding: '40px',
    textAlign: 'center',
    color: '#ef4444',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    background: '#f9fafb',
    borderTop: '1px solid #e5e7eb'
  },
  pageBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    background: 'white',
    border: '1px solid #d1d5db',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    color: '#374151'
  },
  pageInfo: {
    fontSize: '13px',
    color: '#6b7280'
  },
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    backdropFilter: 'blur(3px)'
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  modalHeader: {
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: '#1f2937'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280'
  },
  modalBody: {
    padding: '20px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    cursor: 'not-allowed',
    color: '#6b7280'
  },
  helperText: {
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '4px',
    fontStyle: 'italic'
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '25px'
  },
  cancelBtn: {
    padding: '10px 18px',
    background: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    color: '#374151',
    fontWeight: '500',
    cursor: 'pointer'
  },
  submitBtn: {
    padding: '10px 18px',
    background: '#c8102e',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontWeight: '500',
    cursor: 'pointer'
  }
};