/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  content: [
    // "./app/..." 경로는 삭제했습니다.
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#000000",
        // 여기에 나중에 브랜드 컬러(보라색 등)를 추가하면 좋아요!
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
