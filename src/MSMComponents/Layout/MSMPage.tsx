import React, { useState, useEffect } from "react";
import DescribeText from "@MSMComponents/DescribeText";
import { Moon, Sun, ArrowUp } from 'lucide-react';

interface MSMPageProps {
    title: string;
    titleDescription?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    alignContent?: string;
}

const MSMPage: React.FC<MSMPageProps> = ({ title, titleDescription, children, footer }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle("dark");
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        // Offset for margin
        <div className={`min-h-screen box-border p-8 w-full`}>
            <header className="top-0 z-10">
                <div className="flex justify-between items-center">
                    <DescribeText text={titleDescription || ""}>
                        <h1 className="text-3xl font-bold">{title}</h1>
                    </DescribeText>
                </div>
            </header>

            <main className="flex flex-col mx-auto md:px-8 py-6">
                {children}
            </main>

            {footer && (
                <footer className="bg-white dark:bg-gray-800 shadow-md p-4">
                    <div className="container mx-auto">{footer}</div>
                </footer>
            )}

            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 p-2 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors duration-200"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={24} />
                </button>
            )}
        </div>
    );
};

export default MSMPage;

