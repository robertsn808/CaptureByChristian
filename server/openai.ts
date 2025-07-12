import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function generateBookingResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }>,
  bookingData: any = {}
): Promise<{
  message: string;
  bookingData?: any;
}> {
  try {
    const systemPrompt = `You are Kai Nakamura's AI booking assistant for his Hawaii photography business. You help clients:

1. Choose the right photography service (Wedding Photography $2,500, Portrait Sessions $450, Aerial Photography $350)
2. Find available dates and times
3. Suggest locations in Hawaii
4. Provide package recommendations
5. Answer questions about FAA-certified drone photography
6. Calculate costs including add-ons (Drone Coverage +$350, Extended Hours +$150/hour, Rush Editing +$200)

Current booking context: ${JSON.stringify(bookingData)}

Respond conversationally and helpfully. If gathering booking information, extract relevant details into the bookingData object. Always mention that Kai is FAA-certified for drone photography when relevant.

Respond with JSON in this format: {
  "message": "your response to the user",
  "bookingData": {
    "serviceType": "wedding|portrait|aerial|custom",
    "date": "ISO date string if mentioned",
    "location": "location if mentioned", 
    "budget": number,
    "addOns": ["drone", "extended", "rush"],
    "notes": "any special requirements"
  }
}`;

    const conversationHistory = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      message: result.message || "I'm here to help you with your photography booking. What can I assist you with?",
      bookingData: result.bookingData || {},
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      message: "I'm having trouble processing your request right now. Please try again or contact us directly at kai@nakamura.photography.",
      bookingData: {},
    };
  }
}

export async function analyzeImage(imageUrl: string): Promise<{
  emotions?: string[];
  style?: string;
  composition?: string;
  quality?: number;
}> {
  try {
    // Convert image URL to base64 for analysis
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this photography image and provide a detailed assessment. Return JSON with:
              {
                "emotions": ["array of emotions detected in subjects"],
                "style": "photography style (portrait, landscape, candid, etc.)",
                "composition": "composition quality description",
                "quality": number from 1-10 rating technical quality
              }`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    return JSON.parse(visionResponse.choices[0].message.content || '{}');
  } catch (error) {
    console.error("Image analysis error:", error);
    return {
      emotions: [],
      style: "unknown",
      composition: "analysis failed",
      quality: 5,
    };
  }
}

export async function generateBlogPost(
  images: Array<{ url: string; title?: string }>,
  eventData: {
    type: string;
    location: string;
    clientNames?: string;
    date: string;
  }
): Promise<{
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  socialCaption: string;
}> {
  try {
    const prompt = `Create a blog post for a Hawaii photography session with these details:
    - Event type: ${eventData.type}
    - Location: ${eventData.location}
    - Date: ${eventData.date}
    - Client: ${eventData.clientNames || 'Client'}
    - Number of images: ${images.length}

    Generate a professional blog post that showcases the photography work while respecting client privacy. Include SEO-optimized content for Hawaii photography.

    Return JSON with:
    {
      "title": "SEO-friendly blog post title",
      "content": "Full blog post content (500-800 words)",
      "excerpt": "Brief excerpt for previews",
      "tags": ["array", "of", "relevant", "tags"],
      "socialCaption": "Instagram-ready caption with hashtags"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error("Blog generation error:", error);
    return {
      title: "Hawaii Photography Session",
      content: "Blog generation failed. Please try again.",
      excerpt: "A beautiful photography session in Hawaii.",
      tags: ["hawaii", "photography"],
      socialCaption: "Capturing beautiful moments in Hawaii 📸 #hawaiiphotography",
    };
  }
}
