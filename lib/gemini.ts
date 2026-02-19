import { GoogleGenerativeAI } from "@google/generative-ai";

export interface SolutionStep {
  text: string;
  codeSnippet?: string;
  highlight?: string;
}

export interface SolutionData {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  bruteForce: {
    approach: string;
    code: {
      java: string;
      python: string;
      cpp: string;
      javascript: string;
    };
    timeComplexity: string;
    spaceComplexity: string;
  };
  optimized: {
    approach: string;
    code: {
      java: string;
      python: string;
      cpp: string;
      javascript: string;
    };
    timeComplexity: string;
    spaceComplexity: string;
  };
  visualFlow: {
    mermaidChart: string;
    steps: SolutionStep[];
  };
}

export async function getProblemSolution(apiKey: string, query: string): Promise<{ data: SolutionData | null, error: string | null }> {
  if (!apiKey) return { data: null, error: "API Key is required" };

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using gemini-1.5-flash for speed and JSON capability
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    You are an expert algorithm visualization tutor. The user wants to understand the LeetCode problem or algorithm: "${query}".
    Provide a detailed breakdown including Brute Force and Optimized solutions.
    
    CRITICAL: Create a "visual flow" explanation using Mermaid.js graph syntax.
    
    IMPORTANT: Ensure your solution handles edge cases robustly.

    RULES FOR CONTENT:
    1. "approach": Must be a Markdown string using bullet points. 
       - EXTREME BREVITY REQUIRED.
       - Each bullet point must be a SINGLE SENTENCE.
       - No sub-bullets or paragraphs.
       - Example: "- Map stores key-value pairs for O(1) access."
    2. "timeComplexity" and "spaceComplexity": NOT just "O(n)". 
       - Include a short, 1-sentence explanation.
    3. CODE LANGUAGES: You MUST provide the full solution code in 4 languages:
       - Java
       - Python
       - C++
       - JavaScript
    
    RULES FOR MERMAID:
      1. Use "graph TD"
      2. KEY REQUIREMENT: You MUST enclose ALL node labels in double quotes. 
      3. Do NOT use brackets[] or parentheses() inside the label text unless they are inside the quotes.
      4. Keep the diagram simple and linear.
    
    Return a strictly valid JSON object with this structure:
    {
      "title": "Title of the problem",
      "difficulty": "Easy | Medium | Hard",
      "description": "Short description of the problem",
      "bruteForce": {
        "approach": "Markdown bullet points explanation",
        "code": {
            "java": "...",
            "python": "...",
            "cpp": "...",
            "javascript": "..."
        },
        "timeComplexity": "O(...) - Explanation",
        "spaceComplexity": "O(...) - Explanation"
      },
      "optimized": {
        "approach": "Markdown bullet points explanation",
        "code": {
            "java": "...",
            "python": "...",
            "cpp": "...",
            "javascript": "..."
        },
        "timeComplexity": "O(...) - Explanation",
        "spaceComplexity": "O(...) - Explanation"
      },
      "visualFlow": {
        "mermaidChart": "graph TD;\n  A[\"Start\"] --> B[\"Init i = 0\"];\n  B --> C{\"i < n?\"};\n  C -- Yes --> D[\"Print i\"];\n  C -- No --> E[\"End\"];",
        "steps": [
          { "text": "Step 1: Initialize ...", "highlight": "initialization", "codeSnippet": "let i = 0;" },
          { "text": "Step 2: Loop condition...", "highlight": "loop", "codeSnippet": "while (i < n)" }
        ]
      }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = JSON.parse(text) as SolutionData;
    return { data, error: null };
  } catch (error: any) {
    // Return error instead of throwing to avoid unhandled runtime errors in console
    const errorMessage = error.message || "Unknown error";
    return { data: null, error: errorMessage };
  }
}
