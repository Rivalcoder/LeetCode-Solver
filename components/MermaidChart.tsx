"use client";
import React, { useEffect } from "react";
import mermaid from "mermaid";

export default function MermaidChart({ chart }: { chart: string }) {
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: "base", // Use base to have full control over variables
            securityLevel: "loose",
            fontFamily: "'JetBrains Mono', 'Inter', sans-serif",
            flowchart: {
                useMaxWidth: false,
                htmlLabels: false, // Switch to SVG labels to prevent clipping
                curve: 'basis',
                nodeSpacing: 50,
                rankSpacing: 50,
                padding: 20
            },
            themeVariables: {
                primaryColor: '#1e1e2e',
                primaryTextColor: '#f8fafc',
                primaryBorderColor: '#6366f1',
                lineColor: '#64748b',
                secondaryColor: '#0f172a',
                tertiaryColor: '#1e293b',
                fontFamily: "'JetBrains Mono', 'Inter', sans-serif",
                fontSize: "16px"
            }
        });
        mermaid.contentLoaded();
    }, [chart]);

    return (
        <div className="mermaid flex justify-center items-center w-full h-full" key={chart}>
            {chart}
        </div>
    );
}
