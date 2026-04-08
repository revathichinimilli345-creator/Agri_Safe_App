export const theme = {
    colors: {
        primary: '#1B5E20', // Darker, more premium Herbal Green
        primaryLight: '#E8F5E9',
        secondary: '#4E342E', // Deeper Earthy Brown
        accent: '#FFD600', // Brighter, more premium Gold
        background: '#FCFBF4', // Richer Off-White/Cream
        surface: '#FFFFFF',
        text: '#121212', // Near Black for better contrast
        textSecondary: '#546E7A', // Slate Gray for secondary text
        border: '#ECEFF1',
        error: '#C62828',
        success: '#2E7D32',
        card: 'rgba(255, 255, 255, 0.98)',
        heroGradient: ['#1B5E20', '#388E3C'],
        surfaceGradient: ['#FCFBF4', '#F5F5F5'],
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
    },
    shadows: {
        light: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
        },
        heavy: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
        },
    },
};
