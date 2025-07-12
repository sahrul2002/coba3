/**
 * Main application initialization - Simplified for GitHub Pages
 */

// Simple initialization without complex async operations
document.addEventListener('DOMContentLoaded', function() {
    console.log('Starting application initialization...');
    
    try {
        // Initialize auth service first
        if (typeof authService !== 'undefined') {
            authService.initialize();
            console.log('✓ Auth service initialized');
        } else {
            console.error('✗ Auth service not found');
        }
        
        // Initialize data service
        if (typeof dataService !== 'undefined') {
            dataService.initializeSync();
            console.log('✓ Data service initialized');
        } else {
            console.error('✗ Data service not found');
        }
        
        // Initialize UI service
        if (typeof uiService !== 'undefined') {
            uiService.initialize();
            console.log('✓ UI service initialized');
        } else {
            console.error('✗ UI service not found');
        }
        
        // Initialize expert service
        if (typeof expertService !== 'undefined') {
            expertService.initialize();
            console.log('✓ Expert service initialized');
        } else {
            console.error('✗ Expert service not found');
        }
        
        // Initialize diagnosa service
        if (typeof diagnosaService !== 'undefined') {
            diagnosaService.initialize();
            console.log('✓ Diagnosa service initialized');
        } else {
            console.error('✗ Diagnosa service not found');
        }
        
        console.log('✓ Application initialized successfully');
        
    } catch (error) {
        console.error('✗ Failed to initialize application:', error);
        alert('Terjadi kesalahan saat memuat aplikasi. Silakan refresh halaman.');
    }
});

// Backup initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // Document still loading, wait for DOMContentLoaded
} else {
    // Document already loaded, initialize immediately
    setTimeout(function() {
        if (typeof authService !== 'undefined' && typeof dataService !== 'undefined') {
            console.log('Backup initialization triggered');
            try {
                authService.initialize();
                dataService.initializeSync();
                uiService.initialize();
                expertService.initialize();
                diagnosaService.initialize();
                console.log('✓ Backup initialization successful');
            } catch (error) {
                console.error('✗ Backup initialization failed:', error);
            }
        }
    }, 100);
}