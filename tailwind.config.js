/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'src/pages/**/*.{js,ts,jsx,tsx}',
    'src/components/**/*.{js,ts,jsx,tsx}',
    'src/constants/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      backgroundImage: {
        'linear-gradient':
          'linear-gradient(0deg, rgba(25, 37, 51, 0.03), rgba(25, 37, 51, 0.03))',
        'linear-gradient-5':
          'linear-gradient(0deg, rgba(26, 37, 51, 0.05), rgba(25, 37, 51, 0.05))',
        'linear-gradient-8':
          'linear-gradient(0deg, rgba(26, 37, 51, 0.08), rgba(26, 37, 51, 0.08))',
      },
      colors: {
        'red-E62E2E': '#E62E2E',
        'red-FF3355': '#FF3355',
        'red-rgba-01': 'rgba(255, 76, 121, 0.1)',
        'red-10': 'rgba(230, 46, 46, 0.1)',
        'black-1A2533': '#1A2533',
        'black-F5F5F5': '#F5F5F5',
        'black-5': 'rgba(26, 37, 51, 0.05)',
        'black-10': 'rgba(26, 37, 51, 0.1)',
        'black-15': 'rgba(26, 37, 51, 0.15)',
        'black-25': 'rgba(26, 37, 51, 0.25)',
        'black-50': 'rgba(26, 37, 51, 0.5)',
        'black-75': 'rgba(26, 37, 51, 0.75)',
        'black-535C66': '#535C66',
        'black-rgba-01': 'rgba(26, 37, 51, 0.1)',
        'black-rgba-00001': 'rgba(0, 0, 0, 0.1)',
        'black-1C1B1F': '#1C1B1F',
        'black-DCDCDC': '#DCDCDC',
        'pink-FF3355': '#FF3355',
        green: '#1BB28F',
        'green-10': 'rgba(27, 178, 143, 0.1)',
        'gray-FAFAFA': '#FAFAFA',
        'blue-2563eb': '#2563eb',
      },
      fontSize: {
        'base-11-150': ['11px', '150%'],
        'base-11-120': ['11px', '120%'],
        'base-11-17': ['11px', '16.5px'],
        'base-12-120': ['12px', '120%'],
        'base-12-18': ['12px', '18px'],
        'base-12-150': ['12px', '150%'],
        'base-13-130': ['13px', '130%'],
        'base-14': ['14px'],
        'base-14-14': ['14px', '14px'],
        'base-14-150': ['14px', '150%'],
        'base-14-21': ['14px', '21px'],
        'base-14-100': ['14px', '100%'],
        'base-16': '16px',
        'base-16-24': ['16px', '24px'],
        'base-16-28': ['16px', '28px'],
        'base-16-120': ['16px', '120%'],
        'base-16-150': ['16px', '150%'],
        'base-16-175': ['16px', '175%'],
        'base-20': '20px',
        'base-23-34': ['23px', '34px'],
        'base-24': '24px',
        'base-24-36': ['24px', '36px'],
        'base-24-100': ['24px', '100%'],
        'base-24-120': ['24px', '120%'],
      },
      fontWeight: {
        'weight-300': '300',
        'weight-400': '400',
        'weight-600': '600',
      },
      boxShadow: {
        'box-rules': '0px 4px 8px rgba(26, 37, 51, 0.1)',
        'btn-pdf': '0px 2px 4px rgba(26, 37, 51, 0.1)',
      },
      dropShadow: {
        '2xl': [
          '-2px 0px 0px #ffffff',
          '2px 0px 0px #ffffff',
          '0px -2px 0px #ffffff',
          '0px 2px 0px #ffffff',
        ],
      },
      borderRadius: {
        '10px': '10px',
      },
      borderWidth: {
        1: '1px',
        3: '3px',
      },
    },
  },
  plugins: ['tailwindcss', 'autoprefixer'],
};
