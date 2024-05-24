/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,tx,tsx}'],
    theme: {
        fontFamily: {
            custom: ['Helvetica', 'Helvetica-Neue', 'Arial'],
        },
        extend: {
            width: {
                main: '1200px',
            },
            backgroundColor: {
                main: '#ee4d2d',
                body: '#f5f5f5',
            },
            colors: {
                primary: '#000000CC',
                hover: '#ffffffb3',
                main: '#ee4d2d',
            },
            fontSize: {
                base: '14px',
            },
            fontWeight: {
                base: '500',
            },
            boxShadow: {
                cart: '0 1px 50px 0 rgba(0, 0, 0, .2)',
                category: '0 0 13px 0 rgba(0, 0, 0, .05)',
                buttonHome: 'b0 1px 1px 0 rgba(0, 0, 0, .03)',
            },
            borderColor: {
                hover: '#ee4d2d',
            },
            height: {
                header: '119px',
            },
            top: {
                header: '119px',
            },
        },
    },
    plugins: [],
}
