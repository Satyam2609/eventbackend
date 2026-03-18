import Groq from "groq-sdk";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Shopdata } from "../module/shop.model.js";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.APIKEY,
});

export const airesponse = asyncHandler(async (req, res) => {
  const { money, eventType } = req.body;

  if (!money || !eventType) {
    return res.status(400).json({
      success: false,
      message: "Money and Event Type are required",
    });
  }

  // 🔥 Get shops from DB
  const findshop = await Shopdata.find({}).limit(20);

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
You are a strict event planner.

RULES:
- ONLY use given shops
- DO NOT create shops
- DO NOT change prices
- Stay within budget
- If no valid match → return EMPTY

OUTPUT FORMAT:

{
  "services": []
}
          `,
        },
        {
          role: "user",
          content: `
Event Type: ${eventType}
Total Budget: ₹${money}

Available Shops:
${JSON.stringify(findshop)}

Return ONLY JSON.
          `,
        },
      ],
    });

    let raw = completion.choices[0].message.content;

    // 🔥 Extract JSON safely
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === -1) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No valid JSON returned",
      });
    }

    const cleanJson = raw.slice(jsonStart, jsonEnd);

    let parsed;

    try {
      parsed = JSON.parse(cleanJson);
    } catch (err) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Invalid JSON from AI",
      });
    }

    // 🔥 अगर empty hai → direct return
    if (!parsed.services || parsed.services.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No suitable shops found",
      });
    }

    // 🔥 HARD VALIDATION
    const validServices = parsed.services.filter((service) => {
      if (
        !service.selectedShop ||
        !service.selectedShop.shopName ||
        !service.selectedShop.price
      ) {
        return false;
      }

      const shop = findshop.find(
        (s) => s.name === service.selectedShop.shopName
      );

      if (!shop) return false;

      if (shop.price > service.allocatedBudget) return false;

      return true;
    });

    // 🔥 अगर sab invalid nikle
    if (validServices.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No valid shops after validation",
      });
    }

    return res.status(200).json({
      success: true,
      data: validServices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "AI response failed",
      error: error.message,
    });
  }
});