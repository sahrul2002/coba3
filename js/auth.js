/**
 * Authentication handling
 */

const authService = {
    // Login credentials
    credentials: {
        expert: { username: 'admin', password: 'admin' }
    },
    
    // Current user role
    currentRole: 'user', // Default to user
    
    // Check if user is logged in as expert
    isExpert: () => {
        return authService.currentRole === 'expert';
    },
    
    // Get current user role
    getCurrentRole: () => {
        return authService.currentRole;
    },
    
    // Expert login function
    expertLogin: (username, password) => {
        if (username === authService.credentials.expert.username && 
            password === authService.credentials.expert.password) {
            authService.currentRole = 'expert';
            sessionStorage.setItem('userRole', 'expert');
            return true;
        }
        return false;
    },
    
    // Logout function (back to user mode)
    logout: () => {
        authService.currentRole = 'user';
        sessionStorage.removeItem('userRole');
    },
    
    // Initialize auth from session storage
    initialize: () => {
        const savedRole = sessionStorage.getItem('userRole');
        if (savedRole === 'expert') {
            authService.currentRole = 'expert';
        } else {
            authService.currentRole = 'user';
        }
        console.log('Auth service initialized, current role:', authService.currentRole);
    }
};
