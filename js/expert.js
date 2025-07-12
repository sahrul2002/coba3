/**
 * Expert panel functionality
 */

// import { dataService } from './data.js';
// import { authService } from './auth.js';

const expertService = {
    // Current item being edited
    currentItem: {
        gejala: null,
        kerusakan: null,
        rule: null
    },
    
    // Initialize expert functionality
    initialize: function() {
        console.log('Initializing expert service...');
        this.loadGejalaTable();
        this.loadKerusakanTable();
        this.setupEventListeners();
        console.log('Expert service initialized successfully');
    },
    
    // Check expert access before any action
    checkExpertAccess: function() {
        if (!authService.isExpert()) {
            alert('Akses ditolak! Anda harus login sebagai pakar untuk melakukan aksi ini.');
            return false;
        }
        return true;
    },
    
    // Generate next code
    generateNextCode: function(type, currentCodes) {
        const prefix = type === 'gejala' ? 'G' : 'K';
        const numbers = currentCodes
            .map(code => parseInt(code.substring(1)))
            .sort((a, b) => a - b);
        
        let nextNumber = 1;
        for (const number of numbers) {
            if (number !== nextNumber) {
                break;
            }
            nextNumber++;
        }
        
        return `${prefix}${String(nextNumber).padStart(3, '0')}`;
    },
    
    // Setup event listeners for expert actions
    setupEventListeners: function() {
        // Gejala form
        const tambahGejalaBtn = document.getElementById('tambah-gejala-btn');
        if (tambahGejalaBtn) {
            tambahGejalaBtn.addEventListener('click', () => {
                if (this.checkExpertAccess()) {
                    this.showAddGejalaForm();
                }
            });
        }
        
        const gejalaForm = document.getElementById('gejala-form');
        if (gejalaForm) {
            gejalaForm.addEventListener('submit', (e) => {
                if (this.checkExpertAccess()) {
                    this.handleGejalaSubmit(e);
                } else {
                    e.preventDefault();
                }
            });
        }
        
        const batalGejala = document.getElementById('batal-gejala');
        if (batalGejala) {
            batalGejala.addEventListener('click', () => uiService.closeModal(document.getElementById('gejala-form-container')));
        }
        
        // Kerusakan form
        const tambahKerusakanBtn = document.getElementById('tambah-kerusakan-btn');
        if (tambahKerusakanBtn) {
            tambahKerusakanBtn.addEventListener('click', () => {
                if (this.checkExpertAccess()) {
                    this.showAddKerusakanForm();
                }
            });
        }
        
        const kerusakanForm = document.getElementById('kerusakan-form');
        if (kerusakanForm) {
            kerusakanForm.addEventListener('submit', (e) => {
                if (this.checkExpertAccess()) {
                    this.handleKerusakanSubmit(e);
                } else {
                    e.preventDefault();
                }
            });
        }
        
        const batalKerusakan = document.getElementById('batal-kerusakan');
        if (batalKerusakan) {
            batalKerusakan.addEventListener('click', () => uiService.closeModal(document.getElementById('kerusakan-form-container')));
        }
        
        // Rule form
        const ruleForm = document.getElementById('rule-form');
        if (ruleForm) {
            ruleForm.addEventListener('submit', (e) => {
                if (this.checkExpertAccess()) {
                    this.handleRuleSubmit(e);
                } else {
                    e.preventDefault();
                }
            });
        }
        
        const batalRule = document.getElementById('batal-rule');
        if (batalRule) {
            batalRule.addEventListener('click', () => uiService.closeModal(document.getElementById('rule-form-container')));
        }
        
        // Search functionality
        const searchGejala = document.getElementById('search-gejala');
        if (searchGejala) {
            searchGejala.addEventListener('input', this.handleGejalaSearch.bind(this));
        }
        
        const searchKerusakan = document.getElementById('search-kerusakan');
        if (searchKerusakan) {
            searchKerusakan.addEventListener('input', this.handleKerusakanSearch.bind(this));
        }
    },
    
    // Load gejala table
    loadGejalaTable: function() {
        const gejalaList = document.getElementById('gejala-list');
        if (!gejalaList || typeof dataService === 'undefined') return;
        
        const gejalaData = dataService.getAllGejala();
        const isExpert = authService.isExpert();
        
        gejalaList.innerHTML = '';
        
        gejalaData.forEach(gejala => {
            const row = document.createElement('tr');
            
            if (isExpert) {
                row.innerHTML = `
                    <td>${gejala.kode}</td>
                    <td>${gejala.deskripsi}</td>
                    <td class="expert-only">
                        <div class="table-actions">
                            <button class="edit-btn" data-kode="${gejala.kode}" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-btn" data-kode="${gejala.kode}" title="Hapus">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
            } else {
                row.innerHTML = `
                    <td>${gejala.kode}</td>
                    <td>${gejala.deskripsi}</td>
                `;
            }
            
            gejalaList.appendChild(row);
        });
        
        // Add event listeners to action buttons only for experts
        if (isExpert) {
            gejalaList.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', () => {
                    if (this.checkExpertAccess()) {
                        this.showEditGejalaForm(button.dataset.kode);
                    }
                });
            });
            
            gejalaList.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', () => {
                    if (this.checkExpertAccess()) {
                        this.showDeleteGejalaConfirmation(button.dataset.kode);
                    }
                });
            });
        }
    },
    
    // Load kerusakan table
    loadKerusakanTable: function() {
        const kerusakanList = document.getElementById('kerusakan-list');
        if (!kerusakanList || typeof dataService === 'undefined') return;
        
        const kerusakanData = dataService.getAllKerusakan();
        const isExpert = authService.isExpert();
        
        kerusakanList.innerHTML = '';
        
        kerusakanData.forEach(kerusakan => {
            const row = document.createElement('tr');
            
            if (isExpert) {
                row.innerHTML = `
                    <td>${kerusakan.kode}</td>
                    <td>${kerusakan.deskripsi}</td>
                    <td class="expert-only">
                        <div class="table-actions">
                            <button class="edit-btn" data-kode="${kerusakan.kode}" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-btn" data-kode="${kerusakan.kode}" title="Hapus">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="rule-btn" data-kode="${kerusakan.kode}" title="Atur Basis Pengetahuan">
                                <i class="fas fa-cog"></i>
                            </button>
                        </div>
                    </td>
                `;
            } else {
                row.innerHTML = `
                    <td>${kerusakan.kode}</td>
                    <td>${kerusakan.deskripsi}</td>
                `;
            }
            
            kerusakanList.appendChild(row);
        });
        
        // Add event listeners to action buttons only for experts
        if (isExpert) {
            kerusakanList.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', () => {
                    if (this.checkExpertAccess()) {
                        this.showEditKerusakanForm(button.dataset.kode);
                    }
                });
            });
            
            kerusakanList.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', () => {
                    if (this.checkExpertAccess()) {
                        this.showDeleteKerusakanConfirmation(button.dataset.kode);
                    }
                });
            });
            
            kerusakanList.querySelectorAll('.rule-btn').forEach(button => {
                button.addEventListener('click', () => {
                    if (this.checkExpertAccess()) {
                        this.showRuleForm(button.dataset.kode);
                    }
                });
            });
        }
    },
    
    // Show add gejala form
    showAddGejalaForm: function() {
        if (!this.checkExpertAccess()) return;
        
        document.getElementById('gejala-form-title').textContent = 'Tambah Gejala Baru';
        document.getElementById('gejala-form').reset();
        
        // Generate next gejala code
        const allGejala = dataService.getAllGejala();
        const nextCode = this.generateNextCode('gejala', allGejala.map(g => g.kode));
        
        // Set and disable the code field
        const kodeField = document.getElementById('gejala-kode');
        kodeField.value = nextCode;
        kodeField.disabled = true;
        
        this.currentItem.gejala = null;
        uiService.openModal(document.getElementById('gejala-form-container'));
    },
    
    // Show edit gejala form
    showEditGejalaForm: function(kode) {
        if (!this.checkExpertAccess()) return;
        
        const gejala = dataService.getGejalaByKode(kode);
        if (!gejala) return;
        
        document.getElementById('gejala-form-title').textContent = 'Edit Gejala';
        document.getElementById('gejala-kode').value = gejala.kode;
        document.getElementById('gejala-deskripsi').value = gejala.deskripsi;
        
        // Disable kode field for editing
        document.getElementById('gejala-kode').disabled = true;
        
        this.currentItem.gejala = gejala;
        uiService.openModal(document.getElementById('gejala-form-container'));
    },
    
    // Show delete gejala confirmation
    showDeleteGejalaConfirmation: function(kode) {
        if (!this.checkExpertAccess()) return;
        
        const gejala = dataService.getGejalaByKode(kode);
        if (!gejala) return;
        
        uiService.showConfirmation(
            `Apakah Anda yakin ingin menghapus gejala "${gejala.kode} - ${gejala.deskripsi}"? Semua aturan terkait juga akan dihapus.`,
            async () => {
                try {
                    await dataService.deleteGejala(kode);
                    alert('Gejala berhasil dihapus!');
                } catch (error) {
                    alert('Gagal menghapus gejala: ' + error.message);
                }
            }
        );
    },
    
    // Handle gejala form submission
    handleGejalaSubmit: async function(e) {
        e.preventDefault();
        
        if (!this.checkExpertAccess()) return;
        
        const kode = document.getElementById('gejala-kode').value;
        const deskripsi = document.getElementById('gejala-deskripsi').value;
        
        // Validate input
        if (!kode || !deskripsi) {
            alert('Semua field harus diisi!');
            return;
        }
        
        if (this.currentItem.gejala) {
            // Update existing gejala
            try {
                await dataService.updateGejala(this.currentItem.gejala.kode, { kode, deskripsi });
                alert('Gejala berhasil diperbarui!');
            } catch (error) {
                alert('Gagal memperbarui gejala: ' + error.message);
                return;
            }
        } else {
            // Add new gejala
            // Check if kode already exists
            const existingGejala = dataService.getGejalaByKode(kode);
            if (existingGejala) {
                alert('Kode gejala sudah ada! Gunakan kode yang berbeda.');
                return;
            }
            
            try {
                await dataService.addGejala({ kode, deskripsi });
                alert('Gejala berhasil ditambahkan!');
            } catch (error) {
                alert('Gagal menambahkan gejala: ' + error.message);
                return;
            }
        }
        
        // Tables will be updated automatically via real-time listeners
        uiService.closeModal(document.getElementById('gejala-form-container'));
    },
    
    // Show add kerusakan form
    showAddKerusakanForm: function() {
        if (!this.checkExpertAccess()) return;
        
        document.getElementById('kerusakan-form-title').textContent = 'Tambah Kerusakan Baru';
        document.getElementById('kerusakan-form').reset();
        
        // Generate next kerusakan code
        const allKerusakan = dataService.getAllKerusakan();
        const nextCode = this.generateNextCode('kerusakan', allKerusakan.map(k => k.kode));
        
        // Set and disable the code field
        const kodeField = document.getElementById('kerusakan-kode');
        kodeField.value = nextCode;
        kodeField.disabled = true;
        
        this.currentItem.kerusakan = null;
        uiService.openModal(document.getElementById('kerusakan-form-container'));
    },
    
    // Show edit kerusakan form
    showEditKerusakanForm: function(kode) {
        if (!this.checkExpertAccess()) return;
        
        const kerusakan = dataService.getKerusakanByKode(kode);
        if (!kerusakan) return;
        
        document.getElementById('kerusakan-form-title').textContent = 'Edit Kerusakan';
        document.getElementById('kerusakan-kode').value = kerusakan.kode;
        document.getElementById('kerusakan-deskripsi').value = kerusakan.deskripsi;
        
        // Disable kode field for editing
        document.getElementById('kerusakan-kode').disabled = true;
        
        this.currentItem.kerusakan = kerusakan;
        uiService.openModal(document.getElementById('kerusakan-form-container'));
    },
    
    // Show delete kerusakan confirmation
    showDeleteKerusakanConfirmation: function(kode) {
        if (!this.checkExpertAccess()) return;
        
        const kerusakan = dataService.getKerusakanByKode(kode);
        if (!kerusakan) return;
        
        uiService.showConfirmation(
            `Apakah Anda yakin ingin menghapus kerusakan "${kerusakan.kode} - ${kerusakan.deskripsi}"? Semua aturan terkait juga akan dihapus.`,
            async () => {
                try {
                    await dataService.deleteKerusakan(kode);
                    alert('Kerusakan berhasil dihapus!');
                } catch (error) {
                    alert('Gagal menghapus kerusakan: ' + error.message);
                }
            }
        );
    },
    
    // Handle kerusakan form submission
    handleKerusakanSubmit: async function(e) {
        e.preventDefault();
        
        if (!this.checkExpertAccess()) return;
        
        const kode = document.getElementById('kerusakan-kode').value;
        const deskripsi = document.getElementById('kerusakan-deskripsi').value;
        
        // Validate input
        if (!kode || !deskripsi) {
            alert('Semua field harus diisi!');
            return;
        }
        
        if (this.currentItem.kerusakan) {
            // Update existing kerusakan
            try {
                await dataService.updateKerusakan(this.currentItem.kerusakan.kode, { kode, deskripsi });
                alert('Kerusakan berhasil diperbarui!');
            } catch (error) {
                alert('Gagal memperbarui kerusakan: ' + error.message);
                return;
            }
        } else {
            // Add new kerusakan
            // Check if kode already exists
            const existingKerusakan = dataService.getKerusakanByKode(kode);
            if (existingKerusakan) {
                alert('Kode kerusakan sudah ada! Gunakan kode yang berbeda.');
                return;
            }
            
            try {
                await dataService.addKerusakan({ kode, deskripsi });
                alert('Kerusakan berhasil ditambahkan!');
            } catch (error) {
                alert('Gagal menambahkan kerusakan: ' + error.message);
                return;
            }
        }
        
        // Tables will be updated automatically via real-time listeners
        uiService.closeModal(document.getElementById('kerusakan-form-container'));
    },
    
    // Show rule form
    showRuleForm: function(kode_kerusakan) {
        if (!this.checkExpertAccess()) return;
        
        const kerusakan = dataService.getKerusakanByKode(kode_kerusakan);
        if (!kerusakan) return;
        
        // Reset form
        const ruleForm = document.getElementById('rule-form');
        if (ruleForm) ruleForm.reset();
        
        // Get existing rules for this kerusakan
        const existingRules = dataService.getRulesForKerusakan(kode_kerusakan);
        
        // Update modal content structure
        const modalContent = document.querySelector('#rule-form-container .modal-content');
        modalContent.innerHTML = `
            <div class="modal-header">
                <h3>Atur Basis Pengetahuan</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="rule-container">
                <div class="rules-summary">
                    <div class="rules-header">
                        <h4>Gejala yang Berpengaruh</h4>
                        <p class="rules-count">${existingRules.length} gejala terkait</p>
                    </div>
                    <div class="rules-list">
                        ${existingRules.map(rule => {
                            const gejala = dataService.getGejalaByKode(rule.kode_gejala);
                            return `
                                <div class="rule-item">
                                    <div class="rule-info">
                                        <span class="rule-code">${gejala.kode}</span>
                                        <span class="rule-desc">${gejala.deskripsi}</span>
                                    </div>
                                    <div class="rule-values">
                                        <span class="mb-value">MB: ${rule.mb}</span>
                                        <span class="md-value">MD: ${rule.md}</span>
                                        <button class="delete-rule-btn" data-gejala="${rule.kode_gejala}">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="rule-form-container">
                    <h4>Tambah Gejala Baru</h4>
                    <form id="rule-form">
                        <div class="input-group">
                            <label for="rule-kerusakan">Kerusakan</label>
                            <select id="rule-kerusakan" required>
                                <option value="${kerusakan.kode}">${kerusakan.kode} - ${kerusakan.deskripsi}</option>
                            </select>
                        </div>
                        <div class="input-group">
                            <label for="rule-gejala">Gejala</label>
                            <select id="rule-gejala" required></select>
                        </div>
                        <div class="input-group">
                            <label for="rule-mb">Nilai MB (0-1)</label>
                            <input type="number" id="rule-mb" min="0" max="1" step="0.1" required>
                        </div>
                        <div class="input-group">
                            <label for="rule-md">Nilai MD (0-1)</label>
                            <input type="number" id="rule-md" min="0" max="1" step="0.1" required>
                        </div>
                        <div class="form-buttons">
                            <button type="button" class="btn-secondary" id="batal-rule">Batal</button>
                            <button type="submit" class="btn-primary" id="simpan-rule">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Add styles for the new layout
        const style = document.createElement('style');
        style.textContent = `
            .rule-container {
                display: flex;
                gap: 20px;
                padding: 20px;
            }
            
            .rules-summary {
                flex: 1;
                border-right: 1px solid var(--border-color);
                padding-right: 20px;
                max-height: 500px;
                overflow-y: auto;
            }
            
            .rule-form-container {
                flex: 1;
                padding-left: 20px;
            }
            
            .rule-form-container h4 {
                margin-bottom: 20px;
                color: var(--text-primary);
                font-size: 1.1rem;
                font-weight: 500;
            }
            
            .rules-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .rules-header h4 {
                font-size: 1.1rem;
                color: var(--text-primary);
                font-weight: 500;
            }
            
            .rules-count {
                font-size: 0.9rem;
                color: var(--text-secondary);
            }
            
            .rules-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .rule-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background-color: var(--background-color);
                border-radius: 4px;
            }
            
            .rule-info {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .rule-code {
                font-weight: 500;
                color: var(--primary-color);
            }
            
            .rule-desc {
                color: var(--text-secondary);
            }
            
            .rule-values {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .mb-value, .md-value {
                font-size: 0.9rem;
                color: var(--text-secondary);
            }
            
            .delete-rule-btn {
                background: none;
                border: none;
                color: var(--danger-color);
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: var(--transition);
            }
            
            .delete-rule-btn:hover {
                background-color: rgba(244, 67, 54, 0.1);
            }
            
            #rule-form-container .modal-content {
                max-width: 900px;
                width: 90%;
            }
        `;
        
        document.head.appendChild(style);
        
        // Populate gejala dropdown (excluding already used gejala)
        const gejalaSelect = document.getElementById('rule-gejala');
        const usedGejalaKodes = existingRules.map(rule => rule.kode_gejala);
        const availableGejala = dataService.getAllGejala().filter(
            gejala => !usedGejalaKodes.includes(gejala.kode)
        );
        
        availableGejala.forEach(gejala => {
            const option = document.createElement('option');
            option.value = gejala.kode;
            option.textContent = `${gejala.kode} - ${gejala.deskripsi}`;
            gejalaSelect.appendChild(option);
        });
        
        // Re-attach event listeners
        document.getElementById('rule-form').addEventListener('submit', (e) => {
            if (this.checkExpertAccess()) {
                this.handleRuleSubmit(e);
            } else {
                e.preventDefault();
            }
        });
        document.getElementById('batal-rule').addEventListener('click', () => uiService.closeModal(document.getElementById('rule-form-container')));
        document.querySelector('.close-modal').addEventListener('click', () => uiService.closeModal(document.getElementById('rule-form-container')));
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-rule-btn').forEach(button => {
            button.addEventListener('click', () => {
                if (this.checkExpertAccess()) {
                    const gejalaKode = button.dataset.gejala;
                    
                    uiService.showConfirmation(
                        `Apakah Anda yakin ingin menghapus aturan untuk gejala ${gejalaKode}?`,
                        async () => {
                            try {
                                await dataService.deleteRule(kode_kerusakan, gejalaKode);
                                alert('Aturan berhasil dihapus!');
                                this.showRuleForm(kode_kerusakan); // Refresh the form
                            } catch (error) {
                                alert('Gagal menghapus aturan: ' + error.message);
                            }
                        }
                    );
                }
            });
        });
        
        // Open modal
        uiService.openModal(document.getElementById('rule-form-container'));
    },
    
    // Handle rule form submission
    handleRuleSubmit: async function(e) {
        e.preventDefault();
        
        if (!this.checkExpertAccess()) return;
        
        const kode_kerusakan = document.getElementById('rule-kerusakan').value;
        const kode_gejala = document.getElementById('rule-gejala').value;
        const mb = parseFloat(document.getElementById('rule-mb').value);
        const md = parseFloat(document.getElementById('rule-md').value);
        
        // Validate input
        if (!kode_kerusakan || !kode_gejala || isNaN(mb) || isNaN(md)) {
            alert('Semua field harus diisi dengan benar!');
            return;
        }
        
        if (mb < 0 || mb > 1 || md < 0 || md > 1) {
            alert('Nilai MB dan MD harus antara 0 dan 1!');
            return;
        }
        
        try {
            await dataService.addOrUpdateRule({
                kode_kerusakan,
                kode_gejala,
                mb,
                md
            });
            
            alert('Aturan berhasil disimpan!');
        } catch (error) {
            alert('Gagal menyimpan aturan: ' + error.message);
            return;
        }
        
        // Refresh the rule form to show the updated rules
        this.showRuleForm(kode_kerusakan);
    },
    
    // Handle gejala search
    handleGejalaSearch: function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#gejala-list tr');
        
        rows.forEach(row => {
            const kode = row.cells[0].textContent.toLowerCase();
            const deskripsi = row.cells[1].textContent.toLowerCase();
            
            if (kode.includes(searchTerm) || deskripsi.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    },
    
    // Handle kerusakan search
    handleKerusakanSearch: function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#kerusakan-list tr');
        
        rows.forEach(row => {
            const kode = row.cells[0].textContent.toLowerCase();
            const deskripsi = row.cells[1].textContent.toLowerCase();
            
            if (kode.includes(searchTerm) || deskripsi.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
};

// Make expertService globally available