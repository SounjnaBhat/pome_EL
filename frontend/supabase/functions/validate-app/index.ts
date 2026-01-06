import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ValidateRequest {
  appLink?: string;
  appName?: string;
}

interface ValidateResponse {
  mode: "FULL" | "PARTIAL";
  appId?: string;
  appName: string;
  message: string;
  availableAttributes: string[];
  unavailableAttributes?: string[];
}

function extractAppNameFromLink(link: string): string | null {
  try {
    const url = new URL(link);
    const hostname = url.hostname;

    if (hostname.includes("play.google.com")) {
      const params = new URLSearchParams(url.search);
      return params.get("id") || null;
    }

    if (
      hostname.includes("apps.apple.com") ||
      hostname.includes("itunes.apple.com")
    ) {
      const pathParts = url.pathname.split("/");
      const namePart = pathParts[pathParts.length - 1];
      if (namePart) {
        const match = namePart.match(/^(.+?)-(\d+)/);
        return match ? match[1].replace(/\-/g, " ") : namePart;
      }
    }
  } catch {
    return null;
  }
  return null;
}

async function validateApp(
  req: ValidateRequest
): Promise<ValidateResponse> {
  let appName = req.appName;

  if (req.appLink && !appName) {
    const extractedName = extractAppNameFromLink(req.appLink);
    if (!extractedName) {
      return {
        mode: "PARTIAL",
        appName: "Unknown App",
        message: "Could not parse app link. Using partial comparison mode.",
        availableAttributes: ["price", "rating"],
        unavailableAttributes: [
          "privacy",
          "performance",
          "ease_of_use",
          "feature_richness",
          "customization",
          "support_quality",
          "service_integration",
        ],
      };
    }
    appName = extractedName;
  }

  if (!appName) {
    return {
      mode: "PARTIAL",
      appName: "Unknown App",
      message: "No app name provided.",
      availableAttributes: ["price", "rating"],
      unavailableAttributes: [
        "privacy",
        "performance",
        "ease_of_use",
        "feature_richness",
        "customization",
        "support_quality",
        "service_integration",
      ],
    };
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/apps`, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Supabase query failed: ${response.statusText}`);
    }

    const apps: Array<{ id: string; name: string }> = await response.json();
    const normalizedSearchName = appName.toLowerCase().trim();
    const foundApp = apps.find(
      (app: any) => app.name.toLowerCase().trim() === normalizedSearchName
    );

    if (foundApp) {
      return {
        mode: "FULL",
        appId: foundApp.id,
        appName: foundApp.name,
        message: `Full comparison mode enabled: "${foundApp.name}" found in database with complete feature data.`,
        availableAttributes: [
          "price",
          "rating",
          "privacy",
          "performance",
          "ease_of_use",
          "feature_richness",
          "customization",
          "support_quality",
          "service_integration",
        ],
      };
    }

    return {
      mode: "PARTIAL",
      appName: appName,
      message: `Partial comparison mode enabled: "${appName}" not found in database. Only basic attributes available.`,
      availableAttributes: ["price", "rating"],
      unavailableAttributes: [
        "privacy",
        "performance",
        "ease_of_use",
        "feature_richness",
        "customization",
        "support_quality",
        "service_integration",
      ],
    };
  } catch (error) {
    console.error("Validation error:", error);

    return {
      mode: "PARTIAL",
      appName: appName,
      message: "Error checking database. Using partial comparison mode with limited data.",
      availableAttributes: ["price", "rating"],
      unavailableAttributes: [
        "privacy",
        "performance",
        "ease_of_use",
        "feature_richness",
        "customization",
        "support_quality",
        "service_integration",
      ],
    };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body: ValidateRequest = await req.json();
    const result = await validateApp(body);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Request error:", error);

    return new Response(
      JSON.stringify({
        error: "Invalid request",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
