import dynamic from 'next/dynamic'
// import SideBar from './NavBar/page'
import './globals.css';

export const metadata = {
  title: 'ANIMEX', 
  keywords: [
    'One Piece',
    'Black Clover',
    'bleach', 
  ],
  icons: '/icon.png',
}
const SideBar = dynamic(() => import('./NavBar/page'));

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body suppressHydrationWarning={true}>
        <SideBar />
        {children}
      </body>
    </html>
  )
}
