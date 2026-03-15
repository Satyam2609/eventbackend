import Groq from "groq-sdk";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Shopdata } from "../module/shop.model.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const airesponse = asyncHandler(async (req, res) => {

  const { money, eventType } = req.body;

  // fetch shops from database
  const findshop = await Shopdata.find({}).limit(20);

  try {

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a professional event planning assistant.

Event Type:
${eventType}

Total Budget:
₹${money}

Available Shops From Database:
${JSON.stringify(findshop)}

Your Tasks:
1. Identify the essential services required for this event type.
2. Divide the total budget intelligently among those services.
3. Only choose shops from the provided database.
4. Each selected shop must fit within the allocated budget for its service.
5. Prefer shops with lower price and good value.
6. Do not create or invent shops.

Output Format:

Event Plan:

Service: <service name>
Allocated Budget: ₹amount
Selected Shop:
- Shop Name
- Price
- Location
- Reason for selection

Repeat for each required service.
`
        }
      ]
    });

    return res.status(200).json({
      success: true,
      aiResponse: response.choices[0].message.content
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "AI response failed",
      error: error.message
    });

  }

});