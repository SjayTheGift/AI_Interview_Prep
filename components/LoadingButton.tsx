"use client"; // This component will run on the client side

import { useState } from "react"; // Import useState inside the component
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link"; // Import Link from Next.js

interface LoadingButtonProps {
    children: React.ReactNode; // Button text
}

const LoadingButton: React.FC<LoadingButtonProps> = ({  children }) => {
    const [loading, setLoading] = useState(false); // Move useState inside the component

    const handleClick = () => {
        setLoading(true);
        // Simulate loading delay or any other logic here
        setTimeout(() => {
            setLoading(false);
        }, 3000); // Adjust duration as needed
    };

    return (
        <Button className="btn-primary max-sm:w-full" onClick={handleClick} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : children}
        </Button>
    );
};

export default LoadingButton;