/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                void: '#050505',
                carbon: '#0A0A0A',
                cyan: '#00AEEF',
                gold: '#FFD700',
                alert: '#EF4444',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            letterSpacing: {
                widest: '0.2em',
            },
            backdropBlur: {
                xl: '24px',
            },
        },
    },
    plugins: [],
}
