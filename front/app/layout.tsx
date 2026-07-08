import "../style/globals.css";
import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";

const inter = Inter({
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-inter",
    subsets: ["latin"],
});

const dmSans = DM_Sans({
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "The Pirate Beats",
    description: "The Pirate Beats App",
    icons: {
        icon: "fallenway-icon.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body
                className={`${inter.variable} ${dmSans.variable} antialiased w-full h-screen overflow-hidden flex flex-col bg-bg`}
            >
                <div className="flex-1 w-full flex flex-col py-6 px-8 min-h-0 gap-7">
                    {children}
                </div>
            </body>
        </html>
    );
}
