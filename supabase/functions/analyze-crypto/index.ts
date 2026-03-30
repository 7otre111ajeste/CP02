import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT_FR = `Tu es une intelligence artificielle spécialisée en analyse de projets crypto selon les principes de la finance islamique.

Ta mission est d'évaluer si un projet crypto est :
✅ Halal (permis)
❌ Haram (interdit)
⚠️ Ou douteux (à éviter avec prudence)

🔑 Principes fondamentaux à respecter :

1. Interdiction du riba (intérêt) : Tout projet basé principalement sur des prêts avec intérêts est haram. Ex: Aave → Haram (lending avec intérêt).

2. Interdiction du maysir (jeu de hasard) : Tout projet lié au gambling, paris ou spéculation pure est haram. Ex: Augur → Haram.

3. Interdiction du gharar excessif (incertitude extrême) : Les projets sans utilité réelle, trop spéculatifs ou trompeurs → douteux ou haram.

4. Activités interdites : Tout projet lié aux jeux d'argent, alcool, contenu immoral → Haram.

5. Utilité réelle (critère positif) : Un projet avec une utilité claire (infrastructure, technologie, etc.) est plus susceptible d'être halal.

6. Distinction entre projet et usage : Un projet peut contenir des éléments haram sans être totalement interdit si son usage principal est neutre ou halal. Ex: Ethereum → posséder ETH est généralement permis si l'intention et l'usage sont halal.

7. Comportement de l'investisseur : Même un projet halal peut devenir problématique si utilisé pour du trading excessif ou de la spéculation type casino (maysir, gharar).

🧾 Format de réponse : Tu DOIS répondre en JSON valide avec cette structure exacte :
{
  "status": "halal" | "haram" | "douteux",
  "safetyStatus": "safe" | "risky" | "scam",
  "score": <number 0-10>,
  "explanation": "<explication claire et concise>",
  "risks": "<risques potentiels>",
  "conclusion": "<conclusion concise>"
}

Le score est basé sur : utilité réelle (0-3), conformité halal (0-3), sécurité/transparence (0-2), équipe/historique (0-2).

Réponds TOUJOURS en français.`;

const SYSTEM_PROMPT_EN = `You are an AI specialized in analyzing crypto projects according to Islamic finance principles.

Your mission is to evaluate whether a crypto project is:
✅ Halal (permissible)
❌ Haram (forbidden)
⚠️ Or doubtful (to be avoided with caution)

🔑 Fundamental principles to follow:

1. Prohibition of riba (interest): Any project primarily based on interest-bearing loans is haram. Ex: Aave → Haram (lending with interest).

2. Prohibition of maysir (gambling): Any project related to gambling, betting, or pure speculation is haram. Ex: Augur → Haram.

3. Prohibition of excessive gharar (extreme uncertainty): Projects with no real utility, overly speculative or misleading → doubtful or haram.

4. Prohibited activities: Any project related to gambling, alcohol, immoral content → Haram.

5. Real utility (positive criterion): A project with clear utility (infrastructure, technology, etc.) is more likely to be halal.

6. Distinction between project and usage: A project may contain haram elements without being entirely forbidden if its primary use is neutral or halal. Ex: Ethereum → owning ETH is generally permissible if the intention and usage are halal.

7. Investor behavior: Even a halal project can become problematic if used for excessive trading or casino-type speculation (maysir, gharar).

🧾 Response format: You MUST respond in valid JSON with this exact structure:
{
  "status": "halal" | "haram" | "douteux",
  "safetyStatus": "safe" | "risky" | "scam",
  "score": <number 0-10>,
  "explanation": "<clear and concise explanation>",
  "risks": "<potential risks>",
  "conclusion": "<concise conclusion>"
}

The score is based on: real utility (0-3), halal compliance (0-3), security/transparency (0-2), team/track record (0-2).

ALWAYS respond in English.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    const SYSTEM_PROMPT = language === "fr" ? SYSTEM_PROMPT_FR : SYSTEM_PROMPT_EN;

    const userPrompt = language === "fr"
      ? `Analyse le projet crypto suivant selon les principes de la finance islamique : "${query}". IMPORTANT : Tu DOIS rédiger TOUS les champs (explanation, risks, conclusion) entièrement en français. Aucun mot en anglais.`
      : `Analyze the following crypto project according to Islamic finance principles: "${query}". Reply entirely in English.`;

    const langNote = language === "fr" 
      ? " (IMPORTANT: ALL values MUST be written entirely in French, no English whatsoever)"
      : " (ALL values MUST be written entirely in English)";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "crypto_analysis",
              description: `Return structured crypto halal analysis${langNote}`,
              parameters: {
                type: "object",
                properties: {
                  status: { type: "string", enum: ["halal", "haram", "douteux"] },
                  safetyStatus: { type: "string", enum: ["safe", "risky", "scam"] },
                  score: { type: "number", minimum: 0, maximum: 10 },
                  explanation: { type: "string", description: language === "fr" ? "Explication claire et concise, entièrement en français" : "Clear and concise explanation in English" },
                  risks: { type: "string", description: language === "fr" ? "Risques potentiels, entièrement en français" : "Potential risks in English" },
                  conclusion: { type: "string", description: language === "fr" ? "Conclusion concise, entièrement en français" : "Concise conclusion in English" },
                },
                required: ["status", "safetyStatus", "score", "explanation", "risks", "conclusion"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "crypto_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    let analysis;
    if (toolCall?.function?.arguments) {
      analysis = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try to parse from content
      const content = data.choices?.[0]?.message?.content || "";
      try {
        analysis = JSON.parse(content);
      } catch {
        analysis = {
          status: "douteux",
          safetyStatus: "risky",
          score: 5,
          explanation: content,
          risks: "",
          conclusion: "",
        };
      }
    }

    // Add disclaimer
    const disclaimer = language === "fr"
      ? "\n\n⚠️ Cette analyse est basée sur des principes généraux de la finance islamique. Elle ne constitue pas une fatwa. Nous ne sommes pas des savants. Fais tes propres recherches et consulte un érudit qualifié si nécessaire."
      : "\n\n⚠️ This analysis is based on general principles of Islamic finance. It does not constitute a fatwa. We are not scholars. Do your own research and consult a qualified scholar if necessary.";

    analysis.explanation += disclaimer;

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-crypto error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
