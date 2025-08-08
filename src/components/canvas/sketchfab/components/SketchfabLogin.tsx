'use client';

import { FaBoxesStacked } from "react-icons/fa6";
import { PiDownloadSimpleBold } from "react-icons/pi";
import { SiAdobecreativecloud } from "react-icons/si";
import { useSketchfabAuth } from "../context/SketchfabAuthContext";

export default function SketchfabLogin() {
    const { checkAuth } = useSketchfabAuth();

    const handleLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        const width = 600;
        const height = 500;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const popup = window.open(
            '/api/sketchfab/login',
            'popup',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        if (popup) {
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    checkAuth();
                }
            }, 1000);
        }
    };

    return (
        <div className="w-full pt-32 px-4">
            <div className="text-center">
                <button
                    onClick={handleLogin}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg cursor-pointer"
                >
                    Login With Your Sketchfab Account
                </button>
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-4 *:rounded-2xl *:bg-gray-300/40 *:p-5">
                <FeatureCard
                    icon={<FaBoxesStacked size={30} />}
                    title="Search Models"
                    description="Browse over 1 million free 3D models with advanced search filters"
                    bgColor="bg-blue-100"
                    textColor="text-blue-600"
                />
                <FeatureCard
                    icon={<PiDownloadSimpleBold size={30} />}
                    title="Download Instantly"
                    description="Download models in glTF, GLB, or USDZ formats ready for your projects"
                    bgColor="bg-green-100"
                    textColor="text-green-600"
                />
                <FeatureCard
                    icon={<SiAdobecreativecloud size={30} />}
                    title="Creative Commons"
                    description="All downloadable models are free to use under Creative Commons licenses"
                    bgColor="bg-[#69ffe6b7]"
                    textColor="text-[#005648]"
                />
            </div>
        </div>
    );
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    bgColor: string;
    textColor: string;
}

function FeatureCard({ icon, title, description, bgColor, textColor }: FeatureCardProps) {
    return (
        <div className="text-center">
            <div className={`${bgColor} ${textColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}