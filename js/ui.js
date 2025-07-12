/**
 * UI management
 */

// import { dataService } from './data.js';
// import { authService } from './auth.js';

const uiService = {
    // DOM elements
    elements: {
        // Containers
        appContainer: document.getElementById('app-container'),
        
        // Expert login modal
        expertLoginModal: document.getElementById('expert-login-modal'),
        expertLoginForm: document.getElementById('expert-login-form'),
        expertUsername: document.getElementById('expert-username'),
        expertPassword: document.getElementById('expert-password'),
        expertLoginBtn: document.getElementById('expert-login-btn'),
        submitExpertLogin: document.getElementById('submit-expert-login'),
        cancelExpertLogin: document.getElementById('cancel-expert-login'),
        
        // Navigation
        sidebar: {
            menuItems: document.querySelectorAll('.sidebar-menu li'),
            userRoleDisplay: document.getElementById('user-role'),
            logoutBtn: document.getElementById('logout-btn')
        },
        
        // Pages
        pages: {
            beranda: document.getElementById('beranda-page'),
            gejala: document.getElementById('gejala-page'),
            kerusakan: document.getElementById('kerusakan-page'),
            diagnosa: document.getElementById('diagnosa-page')
        },
        
        // Dashboard stats
        stats: {
            totalKerusakan: document.getElementById('total-kerusakan'),
            totalGejala: document.getElementById('total-gejala'),
            totalRules: document.getElementById('total-rules')
        },
        
        // Modals
        modals: {
            gejalaForm: document.getElementById('gejala-form-container'),
            kerusakanForm: document.getElementById('kerusakan-form-container'),
            ruleForm: document.getElementById('rule-form-container'),
            confirmationModal: document.getElementById('confirmation-modal')
        },
        
        // Expert-only elements
        expertElements: document.querySelectorAll('.expert-only, .expert-actions')
    },
    
    // Initialize UI
    initialize: function() {
        console.log('Initializing UI service...');
        this.setupEventListeners();
        this.updateUIForRole();
        this.updateDashboardStats();
        console.log('UI service initialized successfully');
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Expert login button
        if (this.elements.expertLoginBtn) {
            this.elements.expertLoginBtn.addEventListener('click', this.showExpertLogin.bind(this));
        }
        
        // Expert login form
        if (this.elements.expertLoginForm) {
            this.elements.expertLoginForm.addEventListener('submit', this.handleExpertLogin.bind(this));
        }
        
        if (this.elements.cancelExpertLogin) {
            this.elements.cancelExpertLogin.addEventListener('click', () => this.closeModal(this.elements.expertLoginModal));
        }
        
        // Logout button
        if (this.elements.sidebar.logoutBtn) {
            this.elements.sidebar.logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }
        
        // Sidebar navigation
        this.elements.sidebar.menuItems.forEach(item => {
            item.addEventListener('click', () => {
                this.navigateToPage(item.dataset.page);
            });
        });
        
        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal);
            });
        });
        
        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    },
    
    // Show expert login modal
    showExpertLogin: function() {
        if (this.elements.expertUsername) this.elements.expertUsername.value = '';
        if (this.elements.expertPassword) this.elements.expertPassword.value = '';
        this.openModal(this.elements.expertLoginModal);
    },
    
    // Handle expert login
    handleExpertLogin: function(e) {
        e.preventDefault();
        
        const username = this.elements.expertUsername.value;
        const password = this.elements.expertPassword.value;
        
        if (authService.expertLogin(username, password)) {
            this.closeModal(this.elements.expertLoginModal);
            this.updateUIForRole();
            // Reload tables to show expert features
            if (typeof expertService !== 'undefined') {
                expertService.loadGejalaTable();
                expertService.loadKerusakanTable();
            }
            alert('Login pakar berhasil!');
        } else {
            alert('Username atau password pakar salah!');
        }
    },
    
    // Handle logout
    handleLogout: function() {
        authService.logout();
        this.updateUIForRole();
        // Reload tables to hide expert features
        if (typeof expertService !== 'undefined') {
            expertService.loadGejalaTable();
            expertService.loadKerusakanTable();
        }
        alert('Logout berhasil! Kembali ke mode pengguna.');
    },
    
    // Navigate to page
    navigateToPage: function(pageId) {
        // Hide all pages
        Object.values(this.elements.pages).forEach(page => {
            if (page) page.classList.remove('active');
        });
        
        // Show selected page
        if (this.elements.pages[pageId]) {
            this.elements.pages[pageId].classList.add('active');
        }
        
        // Update active menu item
        this.elements.sidebar.menuItems.forEach(item => {
            if (item.dataset.page === pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },
    
    // Update UI based on user role
    updateUIForRole: function() {
        const isExpert = authService.isExpert();
        
        // Update user role display
        if (this.elements.sidebar.userRoleDisplay) {
            this.elements.sidebar.userRoleDisplay.textContent = isExpert ? 'Pakar' : 'Pengguna';
        }
        
        // Show/hide expert login button and logout button
        if (isExpert) {
            if (this.elements.expertLoginBtn) this.elements.expertLoginBtn.style.display = 'none';
            if (this.elements.sidebar.logoutBtn) this.elements.sidebar.logoutBtn.style.display = '';
        } else {
            if (this.elements.expertLoginBtn) this.elements.expertLoginBtn.style.display = '';
            if (this.elements.sidebar.logoutBtn) this.elements.sidebar.logoutBtn.style.display = 'none';
        }
        
        // Show/hide expert-only elements
        this.elements.expertElements.forEach(element => {
            if (isExpert) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
        
        // Update table headers and cells to hide/show action columns
        this.updateTableColumns(isExpert);
        
        // Disable expert-only buttons for users
        this.disableExpertButtons(!isExpert);
    },
    
    // Update table columns visibility
    updateTableColumns: function(isExpert) {
        // Update table headers
        const tableHeaders = document.querySelectorAll('.table-header .table-header-cell.expert-only');
        tableHeaders.forEach(header => {
            header.style.display = isExpert ? '' : 'none';
        });
        
        // Update table cells
        const tableCells = document.querySelectorAll('td.expert-only');
        tableCells.forEach(cell => {
            cell.style.display = isExpert ? '' : 'none';
        });
    },
    
    // Disable expert-only buttons for regular users
    disableExpertButtons: function(disable) {
        // Disable add buttons
        const addButtons = document.querySelectorAll('#tambah-gejala-btn, #tambah-kerusakan-btn');
        addButtons.forEach(button => {
            if (button) {
                button.disabled = disable;
                button.style.pointerEvents = disable ? 'none' : '';
                button.style.opacity = disable ? '0.5' : '';
            }
        });
        
        // Disable action buttons in tables
        const actionButtons = document.querySelectorAll('.edit-btn, .delete-btn, .rule-btn');
        actionButtons.forEach(button => {
            if (button) {
                button.disabled = disable;
                button.style.pointerEvents = disable ? 'none' : '';
                button.style.opacity = disable ? '0.5' : '';
            }
        });
        
        // Prevent form submissions for non-experts
        const expertForms = document.querySelectorAll('#gejala-form, #kerusakan-form, #rule-form');
        expertForms.forEach(form => {
            if (form) {
                if (disable) {
                    form.addEventListener('submit', this.preventFormSubmission);
                } else {
                    form.removeEventListener('submit', this.preventFormSubmission);
                }
            }
        });
    },
    
    // Prevent form submission for non-experts
    preventFormSubmission: function(e) {
        if (!authService.isExpert()) {
            e.preventDefault();
            e.stopPropagation();
            alert('Akses ditolak! Anda harus login sebagai pakar untuk melakukan aksi ini.');
            return false;
        }
    },
    
    // Update dashboard stats
    updateDashboardStats: function() {
        if (this.elements.stats.totalKerusakan && typeof dataService !== 'undefined') {
            this.elements.stats.totalKerusakan.textContent = dataService.getAllKerusakan().length;
        }
        if (this.elements.stats.totalGejala && typeof dataService !== 'undefined') {
            this.elements.stats.totalGejala.textContent = dataService.getAllGejala().length;
        }
        if (this.elements.stats.totalRules && typeof dataService !== 'undefined') {
            this.elements.stats.totalRules.textContent = dataService.countTotalRules();
        }
    },
    
    // Open modal (with expert check for certain modals)
    openModal: function(modal) {
        if (!modal) return;
        
        // Check if this is an expert-only modal
        const expertOnlyModals = [
            this.elements.modals.gejalaForm,
            this.elements.modals.kerusakanForm,
            this.elements.modals.ruleForm
        ];
        
        if (expertOnlyModals.includes(modal) && !authService.isExpert()) {
            alert('Akses ditolak! Anda harus login sebagai pakar untuk melakukan aksi ini.');
            return;
        }
        
        modal.classList.add('active');
    },
    
    // Close modal
    closeModal: function(modal) {
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    // Show confirmation dialog (with expert check)
    showConfirmation: function(message, confirmCallback) {
        // Check if user is expert for destructive actions
        if (!authService.isExpert()) {
            alert('Akses ditolak! Anda harus login sebagai pakar untuk melakukan aksi ini.');
            return;
        }
        
        const confirmationText = document.getElementById('confirmation-text');
        const confirmButton = document.getElementById('confirm-action');
        const cancelButton = document.getElementById('cancel-confirm');
        
        if (confirmationText) confirmationText.textContent = message;
        
        // Remove existing event listeners
        const newConfirmButton = confirmButton ? confirmButton.cloneNode(true) : null;
        const newCancelButton = cancelButton ? cancelButton.cloneNode(true) : null;
        
        if (newConfirmButton && confirmButton) {
            confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
        }
        if (newCancelButton && cancelButton) {
            cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
        }
        
        // Add new event listeners
        if (newConfirmButton) {
            newConfirmButton.addEventListener('click', () => {
                confirmCallback();
                this.closeModal(this.elements.modals.confirmationModal);
            });
        }
        
        if (newCancelButton) {
            newCancelButton.addEventListener('click', () => {
                this.closeModal(this.elements.modals.confirmationModal);
            });
        }
        
        // Show modal
        this.openModal(this.elements.modals.confirmationModal);
    }
};

// Make uiService globally available