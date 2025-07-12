/**
 * Supabase client configuration and real-time database service
 */

// For GitHub Pages compatibility, we'll use CDN version
// import { createClient } from '@supabase/supabase-js';

// Supabase configuration - these will be set when you connect to Supabase
const supabaseUrl = window.VITE_SUPABASE_URL || 'your_supabase_url_here';
const supabaseAnonKey = window.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key_here';

// Create Supabase client only if credentials are available
let supabase = null;

if (window.supabase && supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url_here') {
    supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
} else {
    console.log('Supabase credentials not configured. Using fallback mode.');
}

// Database service for real-time data management
const databaseService = {
    // Check if Supabase is available
    isAvailable: () => {
        return supabase !== null;
    },
    
    // Real-time subscriptions
    subscriptions: {
        kerusakan: null,
        gejala: null,
        rules: null
    },
    
    // Event listeners for data changes
    listeners: {
        kerusakan: [],
        gejala: [],
        rules: []
    },
    
    // Initialize real-time subscriptions
    initialize: async function() {
        if (!this.isAvailable()) {
            console.log('Supabase not available, skipping real-time initialization');
            return false;
        }
        
        console.log('Initializing Supabase database service...');
        
        try {
            // Test connection first
            const { data, error } = await supabase.from('kerusakan').select('count', { count: 'exact', head: true });
            if (error) {
                console.error('Supabase connection test failed:', error);
                return false;
            }
            
            // Subscribe to kerusakan changes
            this.subscriptions.kerusakan = supabase
                .channel('kerusakan_changes')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'kerusakan' },
                    (payload) => {
                        console.log('Kerusakan change detected:', payload);
                        this.notifyListeners('kerusakan', payload);
                    }
                )
                .subscribe();
            
            // Subscribe to gejala changes
            this.subscriptions.gejala = supabase
                .channel('gejala_changes')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'gejala' },
                    (payload) => {
                        console.log('Gejala change detected:', payload);
                        this.notifyListeners('gejala', payload);
                    }
                )
                .subscribe();
            
            // Subscribe to rules changes
            this.subscriptions.rules = supabase
                .channel('rules_changes')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'rules' },
                    (payload) => {
                        console.log('Rules change detected:', payload);
                        this.notifyListeners('rules', payload);
                    }
                )
                .subscribe();
            
            console.log('Supabase database service initialized with real-time subscriptions');
            return true;
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            return false;
        }
    },
    
    // Add event listener for data changes
    addEventListener: function(table, callback) {
        if (!this.listeners[table]) {
            this.listeners[table] = [];
        }
        this.listeners[table].push(callback);
    },
    
    // Remove event listener
    removeEventListener: function(table, callback) {
        if (this.listeners[table]) {
            this.listeners[table] = this.listeners[table].filter(cb => cb !== callback);
        }
    },
    
    // Notify all listeners of data changes
    notifyListeners: function(table, payload) {
        if (this.listeners[table]) {
            this.listeners[table].forEach(callback => {
                try {
                    callback(payload);
                } catch (error) {
                    console.error('Error in listener callback:', error);
                }
            });
        }
    },
    
    // KERUSAKAN OPERATIONS
    
    // Get all kerusakan
    getAllKerusakan: async function() {
        if (!this.isAvailable()) {
            return [];
        }
        
        try {
            const { data, error } = await supabase
                .from('kerusakan')
                .select('*')
                .order('kode');
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching kerusakan:', error);
            return [];
        }
    },
    
    // Get kerusakan by kode
    getKerusakanByKode: async function(kode) {
        if (!this.isAvailable()) {
            return null;
        }
        
        try {
            const { data, error } = await supabase
                .from('kerusakan')
                .select('*')
                .eq('kode', kode)
                .single();
            
            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            console.error('Error fetching kerusakan by kode:', error);
            return null;
        }
    },
    
    // Add new kerusakan
    addKerusakan: async function(kerusakan) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Database not available' };
        }
        
        try {
            const { data, error } = await supabase
                .from('kerusakan')
                .insert([kerusakan])
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error adding kerusakan:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Update kerusakan
    updateKerusakan: async function(kode, updatedKerusakan) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Database not available' };
        }
        
        try {
            const { data, error } = await supabase
                .from('kerusakan')
                .update(updatedKerusakan)
                .eq('kode', kode)
                .select()
                .single();
            
            if (error) throw error;
            
            // If kode changed, update related rules
            if (kode !== updatedKerusakan.kode) {
                await supabase
                    .from('rules')
                    .update({ kode_kerusakan: updatedKerusakan.kode })
                    .eq('kode_kerusakan', kode);
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Error updating kerusakan:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Delete kerusakan
    deleteKerusakan: async function(kode) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Database not available' };
        }
        
        try {
            // First delete related rules
            await supabase
                .from('rules')
                .delete()
                .eq('kode_kerusakan', kode);
            
            // Then delete kerusakan
            const { error } = await supabase
                .from('kerusakan')
                .delete()
                .eq('kode', kode);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting kerusakan:', error);
            return { success: false, error: error.message };
        }
    },
    
    // GEJALA OPERATIONS
    
    // Get all gejala
    getAllGejala: async function() {
        if (!this.isAvailable()) {
            return [];
        }
        
        try {
            const { data, error } = await supabase
                .from('gejala')
                .select('*')
                .order('kode');
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching gejala:', error);
            return [];
        }
    },
    
    // Get gejala by kode
    getGejalaByKode: async function(kode) {
        if (!this.isAvailable()) {
            return null;
        }
        
        try {
            const { data, error } = await supabase
                .from('gejala')
                .select('*')
                .eq('kode', kode)
                .single();
            
            if (error && error.code !== 'PGRST116') throw error;
            return data;
        } catch (error) {
            console.error('Error fetching gejala by kode:', error);
            return null;
        }
    },
    
    // Add new gejala
    addGejala: async function(gejala) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Database not available' };
        }
        
        try {
            const { data, error } = await supabase
                .from('gejala')
                .insert([gejala])
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error adding gejala:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Update gejala
    updateGejala: async function(kode, updatedGejala) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Database not available' };
        }
        
        try {
            const { data, error } = await supabase
                .from('gejala')
                .update(updatedGejala)
                .eq('kode', kode)
                .select()
                .single();
            
            if (error) throw error;
            
            // If kode changed, update related rules
            if (kode !== updatedGejala.kode) {
                await supabase
                    .from('rules')
                    .update({ kode_gejala: updatedGejala.kode })
                    .eq('kode_gejala', kode);
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Error updating gejala:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Delete gejala
    deleteGejala: async function(kode) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Database not available' };
        }
        
        try {
            // First delete related rules
            await supabase
                .from('rules')
                .delete()
                .eq('kode_gejala', kode);
            
            // Then delete gejala
            const { error } = await supabase
                .from('gejala')
                .delete()
                .eq('kode', kode);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting gejala:', error);
            return { success: false, error: error.message };
        }
    },
    
    // RULES OPERATIONS
    
    // Get all rules
    getAllRules: async function() {
        if (!this.isAvailable()) {
            return [];
        }
        
        try {
            const { data, error } = await supabase
                .from('rules')
                .select('*')
                .order('kode_kerusakan, kode_gejala');
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching rules:', error);
            return [];
        }
    },
    
    // Get rules for specific kerusakan
    getRulesForKerusakan: async function(kode_kerusakan) {
        if (!this.isAvailable()) {
            return [];
        }
        
        try {
            const { data, error } = await supabase
                .from('rules')
                .select('*')
                .eq('kode_kerusakan', kode_kerusakan)
                .order('kode_gejala');
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching rules for kerusakan:', error);
            return [];
        }
    },
    
    // Add or update rule
    addOrUpdateRule: async function(rule) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Database not available' };
        }
        
        try {
            const { data, error } = await supabase
                .from('rules')
                .upsert([rule], { 
                    onConflict: 'kode_kerusakan,kode_gejala',
                    ignoreDuplicates: false 
                })
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error adding/updating rule:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Delete rule
    deleteRule: async function(kode_kerusakan, kode_gejala) {
        if (!this.isAvailable()) {
            return { success: false, error: 'Database not available' };
        }
        
        try {
            const { error } = await supabase
                .from('rules')
                .delete()
                .eq('kode_kerusakan', kode_kerusakan)
                .eq('kode_gejala', kode_gejala);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting rule:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Count total rules
    countTotalRules: async function() {
        if (!this.isAvailable()) {
            return 0;
        }
        
        try {
            const { count, error } = await supabase
                .from('rules')
                .select('*', { count: 'exact', head: true });
            
            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error('Error counting rules:', error);
            return 0;
        }
    },
    
    // Cleanup subscriptions
    cleanup: function() {
        if (!this.isAvailable()) {
            return;
        }
        
        Object.values(this.subscriptions).forEach(subscription => {
            if (subscription) {
                supabase.removeChannel(subscription);
            }
        });
        
        this.subscriptions = {
            kerusakan: null,
            gejala: null,
            rules: null
        };
        
        this.listeners = {
            kerusakan: [],
            gejala: [],
            rules: []
        };
    }
};

// Make databaseService globally available
window.databaseService = databaseService;
// Export supabase client for direct use if needed