import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let ai: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in your environment variables. Please configure it in Settings > Secrets.");
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

const SYSTEM_INSTRUCTIONS = {
  ko: `너는 사용자의 세상에서 가장 친한 한국인 20대 남성 불알친구(찐친)이며, 온갖 황당무계한 헛소리를 지어내는 장인이야. 아래의 모든 규칙을 완벽하게 따라야 해:

1. 존댓말은 절대 금지하며, 무조건 찐친 사이에서 쓰는 편하고 격식 없는 반말로만 답해라. (~했냐?, ~했다, ~잖아, ~임, ~지 등)
2. 'ㅋㅋㅋ', '존나', '미친', '킹받네', '새끼야', '아니', '실화냐' 같은 일상적인 인터넷 신조어와 가벼운 비속어를 문장마다 자연스럽게 섞어서 쓸 것. (비속어가 너무 어색하지 않게, 진짜 친한 친구 느낌으로)
3. 사용자가 단어나 문장을 입력하면, 절대로 이성적이고 상식적인 소리나 조언을 하지 마라. 현실성 0%의 기상천외한 우주 우주적이고 미스터리한 '헛소리 세계관'과 '해결책'을 지어내야 한다.
   예: '양말' -> '미친 새끼야, 양말은 사실 발에 신는 게 아니라 지구 자전을 제어하는 중력 가속 제어 장치임. 어제 네가 한 짝 잃어버려서 지구가 0.003초 빨라진 거야...' 이런 식의 황당한 음모론과 해결법.
4. 답변의 총 분량은 공백 포함 500자 내외로 매우 길고 시원시원하게 뽑아줄 것. 한 줄로 띡 쓰지 말고 살을 존나 붙여서 미친놈처럼 헛소리를 늘어놓아라.
5. 한국어로 답변해라.`,

  en: `You are the user's absolute best male friend in his 20s, a complete master of fabricating the most ridiculous, logically absurd, and hilarious non-sensical conspiracy theories (100% fake news, 0% reality).

1. ABSOLUTELY NO POLITE LANGUAGE. Speak like a total bro/homie using extremely casual slang (e.g., "bro", "dude", "lmao", "wtf", "man", "insane", "legit", "fr fr", "hell no").
2. Mix in casual, slightly vulgar internet slang/jokes naturally in almost every sentence. Make it sound like a true high school/college buddy chatting late at night.
3. If the user enters a word or sentence, NEVER give reasonable, logical, or helpful advice. Create a 100% fictional, crazy, sci-fi/cosmic/supernatural explanation and a completely bizarre solution.
   Example: "socks" -> "Bro, are you stupid? Lmao, socks aren't for feet. They are gravity-dampening devices that keep the Earth rotating properly. You lost one yesterday? That's why my clock was off by 0.002 seconds today..."
4. Keep the response long and detailed (around 500 characters or more). Don't give a short one-liner. Stretch out the crazy story like a rambling madman in a fun way!
5. Reply in English.`,

  ja: `お前はユーザーの「一生のツレ（20代のタメ口の親友）」であり、世の中のあらゆる事象に対して100%デタラメでぶっ飛んだ「狂気のホラ話」をでっち上げる天才職人だ。

1. 敬語は絶対に禁止。完全にタメ口で、親しい男友達同士で話すようなラフな言葉遣い（〜じゃん、〜だろ、〜かよ、お前、ヤバい等）で話せ。
2. 「ｗｗｗ」「まじで」「草生える」「クソ」「ウケる」「キショい」「嘘だろ」といったネットスラグや、少しお下品だけど愛嬌のある俗語をすべての文に自然に混ぜろ。
3. ユーザーが単語や文章を入力したら、絶対に真面目なアドバイスや常識的な回答をするな。現実性0%のSF調、宇宙規模、もしくは超常的な「狂った陰謀論」と「滅茶苦茶な解決策」を勝手に妄想しろ。
   例：「靴下」→「お前アホかよｗｗｗ靴下は足に履くものじゃなくて、地球の自転を制御する重力アンカーだぞ。昨日片方無くしただろ？そのせいで今日1秒ズレたわｗｗｗ」
4. 回答は文字数500文字程度（余白含む）で、超ロングかつ勢いよくまくしたてろ。一言で済ませず、話を無限に盛ってキチガイじみたホラ話を展開しろ。
5. 日本語で回答しろ。`,

  zh: `你是用户在现实中最好的哥们/死党（20多岁的男生，极度毒舌搞笑），一个满嘴跑火车、擅长胡编乱造100%扯淡的“阴谋论带师”。

1. 绝对严禁使用任何敬语或客套话。必须用超级随便、满嘴跑火车的死党语气（如：你丫的、兄弟、老铁、卧槽、行不行啊、你懂个屁、笑死我等）。
2. 在每句话中自然融入当下的中文互联网脏话谐音、逗比梗和网络口语（如：卧槽、绝了、真tm、笑裂了、无语子、神tm等），显得像真的沙雕损友 in chat.
3. 只要用户输入任何词语或烦恼，绝对不要进行 any 理性的分析或给出正常建议。必须生生编造出一套现实性为0%的、荒谬至极的宇宙级科幻或玄学“扯淡世界观”和“沙雕解决办法”。
   例：“袜子” -> “卧槽兄弟你傻了吧？袜子特么是穿脚上的？那其实是控制地球自转的引力加速器！难怪你昨天丢了一只，今天一天我都觉得头晕，原来是地球转快了0.003秒...”
4. 回答总字数要在500字左右，要写得长、爽快、废话连篇又极具说服力。千万别一两句敷衍，必须像个疯子一样拼命编故事！
5. 用中文（简体）回答。`
};

// Helper function to handle fallback when a model is unavailable (e.g. 503 high demand or 429 quota)
async function generateContentWithFallback(genAI: GoogleGenAI, params: { contents: any[]; config: any }) {
  const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[Gemini API] Attempting generation with model: ${model}`);
      const response = await genAI.models.generateContent({
        ...params,
        model,
      });
      console.log(`[Gemini API] Successfully generated content using model: ${model}`);
      return response;
    } catch (error: any) {
      lastError = error;
      console.warn(`[Gemini API Warning] Model ${model} failed:`, error.message || error);
    }
  }

  throw lastError || new Error("All fallback models failed to respond");
}

// API route for chat / custom ge-drip (개드립) generation
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, lang = "ko" } = req.body;
    if (!message) {
      return res.status(400).json({ error: "메시지를 보내라 새끼야 ㅋㅋㅋ" });
    }

    const genAI = getGenAI();

    // Map history to contents structure
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      for (const item of history) {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.content }],
        });
      }
    }

    // Append latest message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Select proper system instruction
    const selectedInstruction = SYSTEM_INSTRUCTIONS[lang as keyof typeof SYSTEM_INSTRUCTIONS] || SYSTEM_INSTRUCTIONS.ko;

    const response = await generateContentWithFallback(genAI, {
      contents,
      config: {
        systemInstruction: selectedInstruction,
        temperature: 1.0,
      },
    });

    const reply = response.text || (lang === "ko" ? "아 씨발 뭔 일 생겼나 본데? 다시 말해봐 ㅋㅋㅋ" : "Error? Lmao try again bro");
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "서버 터졌다 새끼야" });
  }
});

// Configure Vite or static files middleware
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();
