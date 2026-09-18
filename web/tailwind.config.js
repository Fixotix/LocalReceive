/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', 'class'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['"DM Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
  			serif: ['"Instrument Serif"', '"Newsreader"', 'Georgia', 'serif'],
  			mono: ['"DM Sans"', 'monospace'],
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))',
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))',
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))',
  			},
  			accent: {
  				DEFAULT: '#E5A93C',
  				foreground: '#000000',
  				muted: 'rgba(229, 169, 60, 0.2)',
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))',
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))',
  			},
  			backgroundSecondary: '#161618',
  			surface: 'hsl(var(--card))',
  			surfaceSecondary: 'hsl(var(--muted))',
  			surfaceElevated: 'hsl(var(--secondary))',
  			label: 'hsl(var(--foreground))',
  			secondaryLabel: 'hsl(var(--muted-foreground))',
  			tertiaryLabel: '#737373',
  			separator: 'hsl(var(--border))',
  			glassBorder: 'hsl(var(--border))',
  			glassHighlight: 'rgba(255, 255, 255, 0.22)'
  		},
  		borderRadius: {
  			'apple-sm': '8px',
  			'apple-md': '12px',
  			'apple-lg': '16px',
  			'apple-xl': '20px',
  			'apple-2xl': '24px',
  			'apple-round': '28px'
  		},
  		boxShadow: {
  			glass: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
  			'glass-glow': '0 0 25px rgba(229, 169, 60, 0.3)'
  		},
  		keyframes: {
  			radarPulse: {
  				'0%': {
  					transform: 'scale(0.8)',
  					opacity: '0.8'
  				},
  				'50%': {
  					transform: 'scale(1.15)',
  					opacity: '0.3'
  				},
  				'100%': {
  					transform: 'scale(1.5)',
  					opacity: '0'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-6px)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'radar-pulse-1': 'radarPulse 3s cubic-bezier(0.2, 0.8, 0.2, 1) infinite',
  			'radar-pulse-2': 'radarPulse 3s cubic-bezier(0.2, 0.8, 0.2, 1) infinite 1s',
  			'radar-pulse-3': 'radarPulse 3s cubic-bezier(0.2, 0.8, 0.2, 1) infinite 2s',
  			'float-slow': 'float 4s ease-in-out infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [],
}
