import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ComputeScoreRequest {
  mode: "FULL" | "PARTIAL";
  appId?: string;
  appData?: {
    name: string;
    rating: number;
    pricing_model: string;
    price: number;
  };
  preferences: Record<string, number>;
  availableAttributes: string[];
}

interface ComputeScoreResponse {
  score: number;
  breakdown: Record<string, number>;
  attributesUsed: string[];
  attributesExcluded: string[];
}

async function computeScore(
  req: ComputeScoreRequest
): Promise<ComputeScoreResponse> {
  const breakdown: Record<string, number> = {};
  const attributesUsed: string[] = [];
  const attributesExcluded: string[] = [];

  if (req.mode === "FULL" && req.appId) {
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase credentials");
      }

      const appResponse = await fetch(
        `${supabaseUrl}/rest/v1/apps?id=eq.${req.appId}`,
        {
          method: "GET",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!appResponse.ok) {
        throw new Error("Failed to fetch app data");
      }

      const apps: any[] = await appResponse.json();
      if (apps.length === 0) {
        throw new Error("App not found");
      }

      const app = apps[0];

      const featuresResponse = await fetch(
        `${supabaseUrl}/rest/v1/app_features?app_id=eq.${req.appId}`,
        {
          method: "GET",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!featuresResponse.ok) {
        throw new Error("Failed to fetch app features");
      }

      const features: any[] = await featuresResponse.json();

      if (features.length === 0) {
        throw new Error("App features not found");
      }

      const feature = features[0];

      const servicesResponse = await fetch(
        `${supabaseUrl}/rest/v1/app_services?app_id=eq.${req.appId}`,
        {
          method: "GET",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const services: any[] = servicesResponse.ok
        ? await servicesResponse.json()
        : [];
      const servicesCount = services.length || 1;

      const preferenceList = [
        "priceSensitivity",
        "privacy",
        "performance",
        "easeOfUse",
        "featureRichness",
        "customization",
        "supportQuality",
        "serviceIntegration",
      ];

      let totalWeight = 0;
      let totalScore = 0;

      for (const pref of preferenceList) {
        const prefWeight = req.preferences[pref] || 0;
        if (prefWeight === 0) continue;

        let score = 0;

        if (pref === "priceSensitivity") {
          score = app.price === 0 ? 10 : Math.max(0, 10 - app.price);
          breakdown["price"] = score;
          attributesUsed.push("price");
        } else if (pref === "privacy" && req.availableAttributes.includes(pref)) {
          score = feature.privacy_score || 5;
          breakdown["privacy"] = score;
          attributesUsed.push("privacy");
        } else if (
          pref === "performance" &&
          req.availableAttributes.includes(pref)
        ) {
          score = feature.performance_score || 5;
          breakdown["performance"] = score;
          attributesUsed.push("performance");
        } else if (
          pref === "easeOfUse" &&
          req.availableAttributes.includes(pref)
        ) {
          score = feature.ease_of_use_score || 5;
          breakdown["easeOfUse"] = score;
          attributesUsed.push("easeOfUse");
        } else if (
          pref === "featureRichness" &&
          req.availableAttributes.includes(pref)
        ) {
          score = feature.feature_richness_score || 5;
          breakdown["featureRichness"] = score;
          attributesUsed.push("featureRichness");
        } else if (
          pref === "customization" &&
          req.availableAttributes.includes(pref)
        ) {
          score = feature.customization_score || 5;
          breakdown["customization"] = score;
          attributesUsed.push("customization");
        } else if (
          pref === "supportQuality" &&
          req.availableAttributes.includes(pref)
        ) {
          score = feature.support_quality_score || 5;
          breakdown["supportQuality"] = score;
          attributesUsed.push("supportQuality");
        } else if (
          pref === "serviceIntegration" &&
          req.availableAttributes.includes(pref)
        ) {
          let integrationScore = 5;
          if (servicesCount >= 4) integrationScore = 10;
          else if (servicesCount === 3) integrationScore = 8.5;
          else if (servicesCount === 2) integrationScore = 7;
          score = integrationScore;
          breakdown["serviceIntegration"] = score;
          attributesUsed.push("serviceIntegration");
        } else if (
          pref === "priceSensitivity" &&
          req.availableAttributes.includes("price")
        ) {
          score = app.price === 0 ? 10 : Math.max(0, 10 - app.price);
          breakdown["price"] = score;
          attributesUsed.push("price");
        }

        if (score > 0 && req.availableAttributes.includes(pref)) {
          totalScore += score * prefWeight;
          totalWeight += prefWeight;
        } else if (!req.availableAttributes.includes(pref)) {
          attributesExcluded.push(pref);
        }
      }

      const finalScore =
        totalWeight > 0 ? Math.round((totalScore / totalWeight) * 10) / 10 : 0;

      return {
        score: finalScore,
        breakdown,
        attributesUsed,
        attributesExcluded,
      };
    } catch (error) {
      console.error("FULL mode error:", error);
      throw error;
    }
  }

  if (req.mode === "PARTIAL" && req.appData) {
    let totalWeight = 0;
    let totalScore = 0;

    if (req.availableAttributes.includes("price")) {
      const priceWeight = req.preferences["priceSensitivity"] || 1;
      const priceScore =
        req.appData.price === 0
          ? 10
          : Math.max(0, 10 - req.appData.price);
      breakdown["price"] = priceScore;
      attributesUsed.push("price");
      totalScore += priceScore * priceWeight;
      totalWeight += priceWeight;
    }

    if (req.availableAttributes.includes("rating")) {
      const ratingWeight = req.preferences["performance"] || 1;
      const ratingScore = req.appData.rating * 2;
      breakdown["rating"] = ratingScore;
      attributesUsed.push("rating");
      totalScore += ratingScore * ratingWeight;
      totalWeight += ratingWeight;
    }

    const allAttributes = [
      "price",
      "rating",
      "privacy",
      "performance",
      "easeOfUse",
      "featureRichness",
      "customization",
      "supportQuality",
      "serviceIntegration",
    ];

    for (const attr of allAttributes) {
      if (!req.availableAttributes.includes(attr)) {
        attributesExcluded.push(attr);
      }
    }

    const finalScore =
      totalWeight > 0 ? Math.round((totalScore / totalWeight) * 10) / 10 : 5;

    return {
      score: Math.min(10, Math.max(0, finalScore)),
      breakdown,
      attributesUsed,
      attributesExcluded,
    };
  }

  return {
    score: 0,
    breakdown: {},
    attributesUsed: [],
    attributesExcluded: req.availableAttributes.length === 0 ? ["all"] : [],
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body: ComputeScoreRequest = await req.json();
    const result = await computeScore(body);

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
        error: "Score computation failed",
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
