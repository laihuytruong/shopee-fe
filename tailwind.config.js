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
                buttonHome: '0 1px 1px 0 rgba(0, 0, 0, .03)',
                category: '0 0 13px 0 rgba(0, 0, 0, .05)',
                input: 'inset 0 1px 0 0 rgba(0, 0, 0, .05)',
                buttonCategory: '0 1px 1px 0 rgba(0, 0, 0, .05)',
                productCard: '0 1px 20px 0 rgba(0, 0, 0, .05)',
                btn: '0 1px 12px 0 rgba(0, 0, 0, .12)',
                search: '0 1px 4px 0 rgba(0, 0, 0, .26)',
                form_auth: '0 3px 10px 0 rgba(0, 0, 0, .14)',
                form_auth_focus: '0 0 4px 0 rgba(0, 0, 0, .14)',
                input_auth: 'inset 0 2px 0 rgba(0, 0, 0, .02)',
                button_auth: '0 1px 1px rgba(0, 0, 0, .09)',
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
            outlineColor: {
                main: '#ee4d2d',
            },
            transitionDuration: {
                500: '500ms',
            },
            transitionTimingFunction: {
                ease: 'ease',
            },
            keyframes: {
                'slide-left': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                'slide-right': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            animation: {
                'slide-left': 'slide-left 500ms ease-in-out forwards',
                'slide-right': 'slide-right 500ms ease-in-out forwards',
            },
        },
    },
    plugins: [],
}
