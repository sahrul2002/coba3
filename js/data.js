/**
 * Data management for the expert system with real-time database integration
 */

// import { databaseService } from './supabase.js';

// Legacy data structure for fallback when Supabase is not available
const FALLBACK_DATA = {
    // Initial data for kerusakan
    kerusakan: [
        { kode: "K001", deskripsi: "CDI vespa excel" },
        { kode: "K002", deskripsi: "Busi vespa excel" },
        { kode: "K003", deskripsi: "Magnet kipas vespa excel" },
        { kode: "K004", deskripsi: "Karburator Bakar vespa excel" },
        { kode: "K005", deskripsi: "Pengereman vespa excel" },
        { kode: "K006", deskripsi: "Transmisi vespa excel" },
        { kode: "K007", deskripsi: "Suspensi vespa excel" },
        { kode: "K008", deskripsi: "Kelistrikan vespa excel" },
        { kode: "K009", deskripsi: "Komstir vespa excel" },
        { kode: "K010", deskripsi: "Kopling vespa excel" },
        { kode: "K011", deskripsi: "Ban vespa excel" },
        { kode: "K012", deskripsi: "Roda vespa excel" },
        { kode: "K013", deskripsi: "Blok piston vespa excel" },
        { kode: "K014", deskripsi: "Stater vespa excel" },
        { kode: "K015", deskripsi: "Lampu vespa excel" }
    ],
    
    // Initial data for gejala
    gejala: [
        { kode: "G001", deskripsi: "Mesin yang susah untuk di hidupkan" },
        { kode: "G002", deskripsi: "Mesin mati mendadak saat digunakan" },
        { kode: "G003", deskripsi: "Percikan api lemah" },
        { kode: "G004", deskripsi: "Mesin tersendat-sendat saat dihidupkan" },
        { kode: "G005", deskripsi: "Bau bensin yang kuat karena bensin tidak turun ke karburator" },
        { kode: "G006", deskripsi: "Kebocoran dibagian bahan bakar" },
        { kode: "G007", deskripsi: "Lampu yang tidak berfungsi dengan baik (Mati)" },
        { kode: "G008", deskripsi: "Salah alur listrik" },
        { kode: "G009", deskripsi: "Kabel putus" },
        { kode: "G010", deskripsi: "Suhu mesin yang meningkat secara drastis" },
        { kode: "G011", deskripsi: "Suara kasar pada mesin" },
        { kode: "G012", deskripsi: "Pengapian yang tidak konsisten" },
        { kode: "G013", deskripsi: "Gigi perseneling yang terlepas saat digunakan" },
        { kode: "G014", deskripsi: "Terdengar suara berdecit disaat mengganti gigi" },
        { kode: "G015", deskripsi: "Getaran pada vespa yang berlebih saat berkendara" },
        { kode: "G016", deskripsi: "Suspensi yang terasa tidak responsive" },
        { kode: "G017", deskripsi: "Suara mengericik pada mesin" },
        { kode: "G018", deskripsi: "Shock keluar oli" },
        { kode: "G019", deskripsi: "Sering terjadinya macet" },
        { kode: "G020", deskripsi: "Terdengar suara berdecit saat melintas jalan yang kasar" },
        { kode: "G021", deskripsi: "Mesin susah untuk beralih gigi" },
        { kode: "G022", deskripsi: "Suara berdecit saat mengerem" },
        { kode: "G023", deskripsi: "Rem yang tidak responsive" },
        { kode: "G024", deskripsi: "Pedal rem Terasa kendur" },
        { kode: "G025", deskripsi: "Kompling terasa keras saat ditekan" },
        { kode: "G026", deskripsi: "Kopling tidak mau netral" },
        { kode: "G027", deskripsi: "Kopling kasar" },
        { kode: "G028", deskripsi: "Suara berdecit/berderit dari roda atau ban" },
        { kode: "G029", deskripsi: "Ban/roda haus secara tidak merata" },
        { kode: "G030", deskripsi: "Stang susah saat di belokan" },
        { kode: "G031", deskripsi: "Saat di rem ngebuang" },
        { kode: "G032", deskripsi: "Saat berkendara bagian roda tidak stabil" },
        { kode: "G033", deskripsi: "Mesin tidak nyala saat di stater" },
        { kode: "G034", deskripsi: "Stater mati total" },
        { kode: "G035", deskripsi: "Sein motor menyala tidak berkedip" },
        { kode: "G036", deskripsi: "Sein motor mati" }
    ],
    
    // Rules data with CF values
    rules: [
        // K001
        { kode_kerusakan: "K001", kode_gejala: "G001", mb: 0.8, md: 0.2 },
        { kode_kerusakan: "K001", kode_gejala: "G003", mb: 0.9, md: 0.3 },
        { kode_kerusakan: "K001", kode_gejala: "G004", mb: 0.7, md: 0.4 },
        { kode_kerusakan: "K001", kode_gejala: "G012", mb: 0.6, md: 0.2 },
        { kode_kerusakan: "K001", kode_gejala: "G033", mb: 0.8, md: 0.4 },
        
        // K002
        { kode_kerusakan: "K002", kode_gejala: "G001", mb: 0.9, md: 0.1 },
        { kode_kerusakan: "K002", kode_gejala: "G002", mb: 0.9, md: 0.2 },
        { kode_kerusakan: "K002", kode_gejala: "G003", mb: 0.9, md: 0.1 },
        { kode_kerusakan: "K002", kode_gejala: "G004", mb: 0.7, md: 0.2 },
        { kode_kerusakan: "K002", kode_gejala: "G012", mb: 0.8, md: 0.2 },
        { kode_kerusakan: "K002", kode_gejala: "G033", mb: 0.8, md: 0.3 },
        
        // K003
        { kode_kerusakan: "K003", kode_gejala: "G010", mb: 0.7, md: 0.3 },
        { kode_kerusakan: "K003", kode_gejala: "G011", mb: 0.6, md: 0.5 },
        
        // K004
        { kode_kerusakan: "K004", kode_gejala: "G004", mb: 0.8, md: 0.3 },
        { kode_kerusakan: "K004", kode_gejala: "G005", mb: 0.9, md: 0.2 },
        { kode_kerusakan: "K004", kode_gejala: "G006", mb: 0.7, md: 0.2 },
        { kode_kerusakan: "K004", kode_gejala: "G019", mb: 0.8, md: 0.4 },
        
        // K005
        { kode_kerusakan: "K005", kode_gejala: "G022", mb: 0.7, md: 0.3 },
        { kode_kerusakan: "K005", kode_gejala: "G023", mb: 0.6, md: 0.2 },
        { kode_kerusakan: "K005", kode_gejala: "G024", mb: 0.9, md: 0.4 },
        { kode_kerusakan: "K005", kode_gejala: "G031", mb: 0.9, md: 0.2 },
        
        // K006
        { kode_kerusakan: "K006", kode_gejala: "G013", mb: 0.8, md: 0.3 },
        { kode_kerusakan: "K006", kode_gejala: "G014", mb: 0.7, md: 0.4 },
        { kode_kerusakan: "K006", kode_gejala: "G015", mb: 0.6, md: 0.5 },
        { kode_kerusakan: "K006", kode_gejala: "G021", mb: 0.8, md: 0.3 },
        
        // K007
        { kode_kerusakan: "K007", kode_gejala: "G016", mb: 0.7, md: 0.2 },
        { kode_kerusakan: "K007", kode_gejala: "G018", mb: 0.6, md: 0.4 },
        
        // K008
        { kode_kerusakan: "K008", kode_gejala: "G003", mb: 0.9, md: 0.2 },
        { kode_kerusakan: "K008", kode_gejala: "G008", mb: 0.9, md: 0.3 },
        { kode_kerusakan: "K008", kode_gejala: "G009", mb: 0.8, md: 0.4 },
        
        // K009
        { kode_kerusakan: "K009", kode_gejala: "G020", mb: 0.7, md: 0.3 },
        { kode_kerusakan: "K009", kode_gejala: "G030", mb: 0.6, md: 0.2 },
        { kode_kerusakan: "K009", kode_gejala: "G032", mb: 0.8, md: 0.3 },
        
        // K010
        { kode_kerusakan: "K010", kode_gejala: "G025", mb: 0.7, md: 0.4 },
        { kode_kerusakan: "K010", kode_gejala: "G026", mb: 0.8, md: 0.3 },
        { kode_kerusakan: "K010", kode_gejala: "G027", mb: 0.7, md: 0.2 },
        
        // K011
        { kode_kerusakan: "K011", kode_gejala: "G028", mb: 0.9, md: 0.3 },
        { kode_kerusakan: "K011", kode_gejala: "G029", mb: 0.8, md: 0.4 },
        
        // K012
        { kode_kerusakan: "K012", kode_gejala: "G020", mb: 0.7, md: 0.3 },
        { kode_kerusakan: "K012", kode_gejala: "G028", mb: 0.9, md: 0.2 },
        { kode_kerusakan: "K012", kode_gejala: "G029", mb: 0.8, md: 0.4 },
        { kode_kerusakan: "K012", kode_gejala: "G032", mb: 0.6, md: 0.5 },
        
        // K013
        { kode_kerusakan: "K013", kode_gejala: "G001", mb: 0.7, md: 0.2 },
        { kode_kerusakan: "K013", kode_gejala: "G002", mb: 0.8, md: 0.3 },
        { kode_kerusakan: "K013", kode_gejala: "G004", mb: 0.7, md: 0.4 },
        { kode_kerusakan: "K013", kode_gejala: "G015", mb: 0.9, md: 0.3 },
        { kode_kerusakan: "K013", kode_gejala: "G017", mb: 0.8, md: 0.2 },
        { kode_kerusakan: "K013", kode_gejala: "G033", mb: 0.8, md: 0.2 },
        
        // K014
        { kode_kerusakan: "K014", kode_gejala: "G033", mb: 0.9, md: 0.1 },
        { kode_kerusakan: "K014", kode_gejala: "G034", mb: 0.8, md: 0.1 },
        
        // K015
        { kode_kerusakan: "K015", kode_gejala: "G007", mb: 0.9, md: 0.2 },
        { kode_kerusakan: "K015", kode_gejala: "G008", mb: 0.8, md: 0.2 },
        { kode_kerusakan: "K015", kode_gejala: "G009", mb: 0.8, md: 0.3 },
        { kode_kerusakan: "K015", kode_gejala: "G035", mb: 0.8, md: 0.3 },
        { kode_kerusakan: "K015", kode_gejala: "G036", mb: 0.8, md: 0.4 }
    ]
};

// Data service that integrates with real-time database
const dataService = {
    // Cache for data
    cache: {
        kerusakan: [],
        gejala: [],
        rules: []
    },
    
    // Track if using database or fallback
    usingDatabase: false,
    
    // Initialize data service
    initialize: async function() {
        console.log('Initializing data service...');
        
        try {
            // Try to initialize database service
            const dbInitialized = window.databaseService ? await window.databaseService.initialize() : false;
            
            if (dbInitialized) {
                console.log('Using Supabase database');
                this.usingDatabase = true;
                
                // Load data from database
                await this.loadAllData();
                
                // Setup real-time listeners
                this.setupRealtimeListeners();
            } else {
                console.log('Using fallback data (localStorage)');
                this.usingDatabase = false;
                
                // Load from localStorage or use fallback data
                this.loadFallbackData();
            }
            
            console.log('Data service initialized');
            
        } catch (error) {
            console.error('Failed to initialize data service:', error);
            console.log('Falling back to localStorage');
            this.usingDatabase = false;
            this.loadFallbackData();
        }
    },
    
    // Load data from database
    loadAllData: async function() {
        try {
            console.log('Loading all data from database...');
            
            // Load data in parallel
            const [kerusakan, gejala, rules] = window.databaseService ? await Promise.all([
                window.databaseService.getAllKerusakan(),
                window.databaseService.getAllGejala(),
                window.databaseService.getAllRules()
            ]) : [[], [], []];
            
            // Update cache
            this.cache.kerusakan = kerusakan;
            this.cache.gejala = gejala;
            this.cache.rules = rules;
            
            console.log('Data loaded from database:', {
                kerusakan: kerusakan.length,
                gejala: gejala.length,
                rules: rules.length
            });
            
            // Notify UI to update
            this.notifyDataChanged();
            
        } catch (error) {
            console.error('Error loading data from database:', error);
            throw error;
        }
    },
    
    // Load fallback data from localStorage or default
    loadFallbackData: function() {
        try {
            // Try to load from localStorage first
            const savedKerusakan = localStorage.getItem('vespa_kerusakan');
            const savedGejala = localStorage.getItem('vespa_gejala');
            const savedRules = localStorage.getItem('vespa_rules');
            
            if (savedKerusakan && savedGejala && savedRules) {
                this.cache.kerusakan = JSON.parse(savedKerusakan);
                this.cache.gejala = JSON.parse(savedGejala);
                this.cache.rules = JSON.parse(savedRules);
                console.log('Data loaded from localStorage');
            } else {
                // Use fallback data
                this.cache.kerusakan = [...FALLBACK_DATA.kerusakan];
                this.cache.gejala = [...FALLBACK_DATA.gejala];
                this.cache.rules = [...FALLBACK_DATA.rules];
                
                // Save to localStorage
                this.saveFallbackData();
                console.log('Using default fallback data');
            }
            
            // Notify UI to update
            this.notifyDataChanged();
            
        } catch (error) {
            console.error('Error loading fallback data:', error);
            // Use default data as last resort
            this.cache.kerusakan = [...FALLBACK_DATA.kerusakan];
            this.cache.gejala = [...FALLBACK_DATA.gejala];
            this.cache.rules = [...FALLBACK_DATA.rules];
        }
    },
    
    // Save fallback data to localStorage
    saveFallbackData: function() {
        if (!this.usingDatabase) {
            try {
                localStorage.setItem('vespa_kerusakan', JSON.stringify(this.cache.kerusakan));
                localStorage.setItem('vespa_gejala', JSON.stringify(this.cache.gejala));
                localStorage.setItem('vespa_rules', JSON.stringify(this.cache.rules));
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        }
    },
    
    // Setup real-time listeners
    setupRealtimeListeners: function() {
        if (!this.usingDatabase) return;
        
        // Listen for kerusakan changes
        window.databaseService.addEventListener('kerusakan', (payload) => {
            this.handleRealtimeChange('kerusakan', payload);
        });
        
        // Listen for gejala changes
        window.databaseService.addEventListener('gejala', (payload) => {
            this.handleRealtimeChange('gejala', payload);
        });
        
        // Listen for rules changes
        window.databaseService.addEventListener('rules', (payload) => {
            this.handleRealtimeChange('rules', payload);
        });
    },
    
    // Handle real-time data changes
    handleRealtimeChange: function(table, payload) {
        console.log(`Real-time change in ${table}:`, payload);
        
        const { eventType, new: newRecord, old: oldRecord } = payload;
        
        switch (eventType) {
            case 'INSERT':
                this.cache[table].push(newRecord);
                break;
                
            case 'UPDATE':
                const updateIndex = this.cache[table].findIndex(item => item.id === newRecord.id);
                if (updateIndex !== -1) {
                    this.cache[table][updateIndex] = newRecord;
                }
                break;
                
            case 'DELETE':
                this.cache[table] = this.cache[table].filter(item => item.id !== oldRecord.id);
                break;
        }
        
        // Sort cache after changes
        if (table === 'kerusakan' || table === 'gejala') {
            this.cache[table].sort((a, b) => a.kode.localeCompare(b.kode));
        } else if (table === 'rules') {
            this.cache[table].sort((a, b) => {
                const kerusakanCompare = a.kode_kerusakan.localeCompare(b.kode_kerusakan);
                return kerusakanCompare !== 0 ? kerusakanCompare : a.kode_gejala.localeCompare(b.kode_gejala);
            });
        }
        
        // Notify UI to update
        this.notifyDataChanged();
    },
    
    // Notify UI components that data has changed
    notifyDataChanged: function() {
        // Update dashboard stats
        if (typeof uiService !== 'undefined' && uiService.updateDashboardStats) {
            uiService.updateDashboardStats();
        }
        
        // Update tables
        if (typeof expertService !== 'undefined') {
            if (expertService.loadGejalaTable) expertService.loadGejalaTable();
            if (expertService.loadKerusakanTable) expertService.loadKerusakanTable();
        }
        
        // Update diagnosa table
        if (typeof diagnosaService !== 'undefined' && diagnosaService.loadGejalaForDiagnosa) {
            diagnosaService.loadGejalaForDiagnosa();
        }
        
        // Show notification to user (only for real-time updates)
        if (this.usingDatabase) {
            this.showUpdateNotification();
        }
    },
    
    // Show notification when data is updated
    showUpdateNotification: function() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <i class="fas fa-sync-alt"></i>
            <span>Data telah diperbarui secara real-time</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Add animation keyframes
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    },
    
    // KERUSAKAN OPERATIONS
    
    // Get all kerusakan
    getAllKerusakan: function() {
        return this.cache.kerusakan;
    },
    
    // Get kerusakan by kode
    getKerusakanByKode: function(kode) {
        return this.cache.kerusakan.find(k => k.kode === kode);
    },
    
    // Add new kerusakan
    addKerusakan: async function(kerusakan) {
        if (this.usingDatabase) {
            const result = await window.databaseService.addKerusakan(kerusakan);
            if (result.success) {
                console.log('Kerusakan added successfully to database');
            } else {
                console.error('Failed to add kerusakan to database:', result.error);
                throw new Error(result.error);
            }
            return result;
        } else {
            // Fallback mode
            this.cache.kerusakan.push(kerusakan);
            this.cache.kerusakan.sort((a, b) => a.kode.localeCompare(b.kode));
            this.saveFallbackData();
            this.notifyDataChanged();
            return { success: true, data: kerusakan };
        }
    },
    
    // Update kerusakan
    updateKerusakan: async function(kode, updatedKerusakan) {
        if (this.usingDatabase) {
            const result = await window.databaseService.updateKerusakan(kode, updatedKerusakan);
            if (result.success) {
                console.log('Kerusakan updated successfully in database');
            } else {
                console.error('Failed to update kerusakan in database:', result.error);
                throw new Error(result.error);
            }
            return result.success;
        } else {
            // Fallback mode
            const index = this.cache.kerusakan.findIndex(k => k.kode === kode);
            if (index !== -1) {
                this.cache.kerusakan[index] = updatedKerusakan;
                
                // Update related rules if kode changed
                if (kode !== updatedKerusakan.kode) {
                    this.cache.rules.forEach(rule => {
                        if (rule.kode_kerusakan === kode) {
                            rule.kode_kerusakan = updatedKerusakan.kode;
                        }
                    });
                }
                
                this.cache.kerusakan.sort((a, b) => a.kode.localeCompare(b.kode));
                this.saveFallbackData();
                this.notifyDataChanged();
                return true;
            }
            return false;
        }
    },
    
    // Delete kerusakan
    deleteKerusakan: async function(kode) {
        if (this.usingDatabase) {
            const result = await window.databaseService.deleteKerusakan(kode);
            if (result.success) {
                console.log('Kerusakan deleted successfully from database');
            } else {
                console.error('Failed to delete kerusakan from database:', result.error);
                throw new Error(result.error);
            }
            return result.success;
        } else {
            // Fallback mode
            this.cache.kerusakan = this.cache.kerusakan.filter(k => k.kode !== kode);
            this.cache.rules = this.cache.rules.filter(r => r.kode_kerusakan !== kode);
            this.saveFallbackData();
            this.notifyDataChanged();
            return true;
        }
    },
    
    // GEJALA OPERATIONS
    
    // Get all gejala
    getAllGejala: function() {
        return this.cache.gejala;
    },
    
    // Get gejala by kode
    getGejalaByKode: function(kode) {
        return this.cache.gejala.find(g => g.kode === kode);
    },
    
    // Add new gejala
    addGejala: async function(gejala) {
        if (this.usingDatabase) {
            const result = await window.databaseService.addGejala(gejala);
            if (result.success) {
                console.log('Gejala added successfully to database');
            } else {
                console.error('Failed to add gejala to database:', result.error);
                throw new Error(result.error);
            }
            return result;
        } else {
            // Fallback mode
            this.cache.gejala.push(gejala);
            this.cache.gejala.sort((a, b) => a.kode.localeCompare(b.kode));
            this.saveFallbackData();
            this.notifyDataChanged();
            return { success: true, data: gejala };
        }
    },
    
    // Update gejala
    updateGejala: async function(kode, updatedGejala) {
        if (this.usingDatabase) {
            const result = await window.databaseService.updateGejala(kode, updatedGejala);
            if (result.success) {
                console.log('Gejala updated successfully in database');
            } else {
                console.error('Failed to update gejala in database:', result.error);
                throw new Error(result.error);
            }
            return result.success;
        } else {
            // Fallback mode
            const index = this.cache.gejala.findIndex(g => g.kode === kode);
            if (index !== -1) {
                this.cache.gejala[index] = updatedGejala;
                
                // Update related rules if kode changed
                if (kode !== updatedGejala.kode) {
                    this.cache.rules.forEach(rule => {
                        if (rule.kode_gejala === kode) {
                            rule.kode_gejala = updatedGejala.kode;
                        }
                    });
                }
                
                this.cache.gejala.sort((a, b) => a.kode.localeCompare(b.kode));
                this.saveFallbackData();
                this.notifyDataChanged();
                return true;
            }
            return false;
        }
    },
    
    // Delete gejala
    deleteGejala: async function(kode) {
        if (this.usingDatabase) {
            const result = await window.databaseService.deleteGejala(kode);
            if (result.success) {
                console.log('Gejala deleted successfully from database');
            } else {
                console.error('Failed to delete gejala from database:', result.error);
                throw new Error(result.error);
            }
            return result.success;
        } else {
            // Fallback mode
            this.cache.gejala = this.cache.gejala.filter(g => g.kode !== kode);
            this.cache.rules = this.cache.rules.filter(r => r.kode_gejala !== kode);
            this.saveFallbackData();
            this.notifyDataChanged();
            return true;
        }
    },
    
    // RULES OPERATIONS
    
    // Get all rules
    getAllRules: function() {
        return this.cache.rules;
    },
    
    // Get rules for specific kerusakan
    getRulesForKerusakan: function(kode_kerusakan) {
        return this.cache.rules.filter(r => r.kode_kerusakan === kode_kerusakan);
    },
    
    // Add or update rule
    addOrUpdateRule: async function(rule) {
        if (this.usingDatabase) {
            const result = await window.databaseService.addOrUpdateRule(rule);
            if (result.success) {
                console.log('Rule saved successfully to database');
            } else {
                console.error('Failed to save rule to database:', result.error);
                throw new Error(result.error);
            }
            return result;
        } else {
            // Fallback mode
            const existingIndex = this.cache.rules.findIndex(r => 
                r.kode_kerusakan === rule.kode_kerusakan && r.kode_gejala === rule.kode_gejala
            );
            
            if (existingIndex !== -1) {
                this.cache.rules[existingIndex] = rule;
            } else {
                this.cache.rules.push(rule);
            }
            
            this.cache.rules.sort((a, b) => {
                const kerusakanCompare = a.kode_kerusakan.localeCompare(b.kode_kerusakan);
                return kerusakanCompare !== 0 ? kerusakanCompare : a.kode_gejala.localeCompare(b.kode_gejala);
            });
            
            this.saveFallbackData();
            this.notifyDataChanged();
            return { success: true, data: rule };
        }
    },
    
    // Delete rule
    deleteRule: async function(kode_kerusakan, kode_gejala) {
        if (this.usingDatabase) {
            const result = await window.databaseService.deleteRule(kode_kerusakan, kode_gejala);
            if (result.success) {
                console.log('Rule deleted successfully from database');
            } else {
                console.error('Failed to delete rule from database:', result.error);
                throw new Error(result.error);
            }
            return result.success;
        } else {
            // Fallback mode
            this.cache.rules = this.cache.rules.filter(r => 
                !(r.kode_kerusakan === kode_kerusakan && r.kode_gejala === kode_gejala)
            );
            this.saveFallbackData();
            this.notifyDataChanged();
            return true;
        }
    },
    
    // Count total rules
    countTotalRules: function() {
        return this.cache.rules.length;
    },
    
    // Cleanup
    cleanup: function() {
        if (this.usingDatabase) {
            window.databaseService.cleanup();
        }
    }
};

// Add synchronous initialization method for GitHub Pages
dataService.initializeSync = function() {
    console.log('Initializing data service synchronously...');
    
    try {
        // Always use fallback data for GitHub Pages
        this.usingDatabase = false;
        this.loadFallbackData();
        console.log('Data service initialized with fallback data');
        return true;
    } catch (error) {
        console.error('Failed to initialize data service:', error);
        // Use default data as last resort
        this.cache.kerusakan = [...FALLBACK_DATA.kerusakan];
        this.cache.gejala = [...FALLBACK_DATA.gejala];
        this.cache.rules = [...FALLBACK_DATA.rules];
        return false;
    }
};

// Make dataService globally available
window.dataService = dataService;

// Initialize data service when module loads
if (typeof window !== 'undefined') {
    // Browser environment
    window.addEventListener('load', () => {
        dataService.initialize();
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        dataService.cleanup();
    });
}