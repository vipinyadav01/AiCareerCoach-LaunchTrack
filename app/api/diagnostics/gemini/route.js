import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    checks: {},
    errors: [],
    warnings: [],
    status: "unknown",
  };

  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          ...diagnostics,
          status: "unauthorized",
          errors: ["User not authenticated"],
        },
        { status: 401 }
      );
    }

    diagnostics.checks.authentication = {
      status: "ok",
      userId,
    };

    // Check 1: API Key Configuration
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      diagnostics.checks.apiKey = {
        status: "error",
        message: "GEMINI_API_KEY environment variable is not set",
      };
      diagnostics.errors.push("GEMINI_API_KEY is missing");
      diagnostics.status = "error";
      return NextResponse.json(diagnostics, { status: 500 });
    }

    if (apiKey.length < 20) {
      diagnostics.checks.apiKey = {
        status: "warning",
        message: "API key seems too short (might be invalid)",
        length: apiKey.length,
      };
      diagnostics.warnings.push("API key length seems suspicious");
    } else {
      diagnostics.checks.apiKey = {
        status: "ok",
        length: apiKey.length,
        prefix: apiKey.substring(0, 10) + "...",
      };
    }

    // Check 2: Initialize Gemini AI
    let client;
    try {
      client = new GoogleGenAI({ apiKey });
      diagnostics.checks.initialization = {
        status: "ok",
        message: "GoogleGenAI initialized successfully",
      };
    } catch (error) {
      diagnostics.checks.initialization = {
        status: "error",
        message: error.message,
        error: error.toString(),
      };
      diagnostics.errors.push(`Initialization failed: ${error.message}`);
      diagnostics.status = "error";
      return NextResponse.json(diagnostics, { status: 500 });
    }

    // Check 3: Test Model - Use gemini-3-flash-preview
    const modelName = "gemini-3-flash-preview";
    try {
      diagnostics.checks.model = {
        status: "ok",
        modelName: modelName,
        message: "Model ready for testing",
      };
    } catch (error) {
      diagnostics.checks.model = {
        status: "error",
        message: error.message,
        error: error.toString(),
      };
      diagnostics.errors.push(`Model check failed: ${error.message}`);
      diagnostics.status = "error";
      return NextResponse.json(diagnostics, { status: 500 });
    }

    // Check 4: Test Simple Generation
    try {
      const testPrompt = "Say 'Hello, World!' in JSON format: {\"message\": \"your response\"}";
      const startTime = Date.now();
      
      const response = await client.models.generateContent({
        model: modelName,
        contents: testPrompt,
      });
      const duration = Date.now() - startTime;

      if (!response) {
        diagnostics.checks.testGeneration = {
          status: "error",
          message: "Empty response from model",
          duration: `${duration}ms`,
        };
        diagnostics.errors.push("Model returned empty response");
        diagnostics.status = "error";
        return NextResponse.json(diagnostics, { status: 500 });
      }

      const text = response.text || "";
      
      if (!text || text.trim().length === 0) {
        diagnostics.checks.testGeneration = {
          status: "error",
          message: "Empty text in response",
          duration: `${duration}ms`,
        };
        diagnostics.errors.push("Model returned empty text");
        diagnostics.status = "error";
        return NextResponse.json(diagnostics, { status: 500 });
      }

      diagnostics.checks.testGeneration = {
        status: "ok",
        duration: `${duration}ms`,
        responseLength: text.length,
        responsePreview: text.substring(0, 100),
        message: "Test generation successful",
      };
    } catch (error) {
      diagnostics.checks.testGeneration = {
        status: "error",
        message: error.message,
        error: error.toString(),
        errorType: error.constructor.name,
      };
      diagnostics.errors.push(`Test generation failed: ${error.message}`);
      
      // Check for specific error types
      if (error.message?.includes("API key")) {
        diagnostics.errors.push("API key might be invalid or expired");
      }
      if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
        diagnostics.errors.push("API quota or rate limit exceeded");
      }
      if (error.message?.includes("permission")) {
        diagnostics.errors.push("API key lacks required permissions");
      }
      
      diagnostics.status = "error";
      return NextResponse.json(diagnostics, { status: 500 });
    }

    // Check 5: Test JSON Parsing (like in the actual implementation)
    try {
      const jsonTestPrompt = `Return only this JSON: {"test": "success", "number": 42}`;
      const response = await client.models.generateContent({
        model: modelName,
        contents: jsonTestPrompt,
      });
      const text = response.text || "";
      
      // Try to clean and parse JSON (like the actual implementation)
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : cleanedText;
      
      try {
        const parsed = JSON.parse(jsonText);
        diagnostics.checks.jsonParsing = {
          status: "ok",
          message: "JSON parsing successful",
          parsedKeys: Object.keys(parsed),
        };
      } catch (parseError) {
        diagnostics.checks.jsonParsing = {
          status: "warning",
          message: "JSON parsing failed",
          error: parseError.message,
          rawResponse: text.substring(0, 200),
        };
        diagnostics.warnings.push(`JSON parsing issue: ${parseError.message}`);
      }
    } catch (error) {
      diagnostics.checks.jsonParsing = {
        status: "error",
        message: error.message,
      };
      diagnostics.warnings.push(`JSON test failed: ${error.message}`);
    }

    // Overall status
    if (diagnostics.errors.length === 0 && diagnostics.warnings.length === 0) {
      diagnostics.status = "ok";
    } else if (diagnostics.errors.length === 0) {
      diagnostics.status = "warning";
    }

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error) {
    diagnostics.status = "error";
    diagnostics.errors.push(`Unexpected error: ${error.message}`);
    diagnostics.error = {
      message: error.message,
      stack: error.stack,
      name: error.name,
    };

    return NextResponse.json(diagnostics, { status: 500 });
  }
}
