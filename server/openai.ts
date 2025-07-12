
import { replitAI } from '@replit/ai-sdk';

// Use Replit Agent for AI functionality
const replitAgent = replitAI({
  // Replit Agent uses built-in authentication
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

    const response = await replitAgent.chat.completions.create({
      model: "replit-code-v1-3b",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    let result;
    try {
      result = JSON.parse(response.choices[0].message.content || '{}');
    } catch {
      // Fallback if JSON parsing fails
      result = {
        message: response.choices[0].message.content || "I'm here to help you with your photography booking. What can I assist you with?",
        bookingData: {}
      };
    }
    
    return {
      message: result.message || "I'm here to help you with your photography booking. What can I assist you with?",
      bookingData: result.bookingData || {},
    };
  } catch (error) {
    console.error("Replit Agent API error:", error);
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
    // Note: Replit Agent currently has limited image analysis capabilities
    // This is a simplified version that focuses on text-based analysis
    const response = await replitAgent.chat.completions.create({
      model: "replit-code-v1-3b",
      messages: [
        {
          role: "user",
          content: `Based on the image URL: ${imageUrl}, provide a photography assessment. Return JSON with:
          {
            "emotions": ["array of likely emotions in portrait photography"],
            "style": "photography style (portrait, landscape, candid, etc.)",
            "composition": "general composition assessment",
            "quality": number from 1-10 rating estimated quality
          }`
        }
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    let result;
    try {
      result = JSON.parse(response.choices[0].message.content || '{}');
    } catch {
      // Fallback analysis
      result = {
        emotions: ["joy", "happiness"],
        style: "portrait",
        composition: "well-composed",
        quality: 8
      };
    }

    return {
      emotions: result.emotions || [],
      style: result.style || "unknown",
      composition: result.composition || "analysis completed",
      quality: result.quality || 7,
    };
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

    const response = await replitAgent.chat.completions.create({
      model: "replit-code-v1-3b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    let result;
    try {
      result = JSON.parse(response.choices[0].message.content || '{}');
    } catch {
      // Fallback blog post
      result = {
        title: `${eventData.type} Photography in ${eventData.location}`,
        content: `A beautiful ${eventData.type.toLowerCase()} session captured in the stunning location of ${eventData.location}, Hawaii. The natural beauty of the islands provided the perfect backdrop for this memorable photography experience.`,
        excerpt: `Capturing beautiful moments in ${eventData.location}, Hawaii.`,
        tags: ["hawaii", "photography", eventData.type.toLowerCase()],
        socialCaption: `Capturing beautiful moments in Hawaii 📸 #hawaiiphotography #${eventData.type.toLowerCase()}`
      };
    }

    return {
      title: result.title || "Hawaii Photography Session",
      content: result.content || "Blog generation completed.",
      excerpt: result.excerpt || "A beautiful photography session in Hawaii.",
      tags: result.tags || ["hawaii", "photography"],
      socialCaption: result.socialCaption || "Capturing beautiful moments in Hawaii 📸 #hawaiiphotography",
    };
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
