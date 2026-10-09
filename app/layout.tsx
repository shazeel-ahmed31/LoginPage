import './globals.css';
import type {Metadata} from 'next';
export const metadata:Metadata={title:'BusinessPro · Login UI Demo',description:'React and TypeScript frontend login demonstration. No real authentication.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
