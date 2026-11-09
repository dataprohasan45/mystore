import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const hasValidGeminiKey =
  process.env.GEMINI_API_KEY &&
  process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
  !process.env.GEMINI_API_KEY.includes('MY_GEMINI');

const ai = hasValidGeminiKey
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// AI Assistant endpoint
app.post('/api/ai/assistant', async (req, res) => {
  try {
    const { message, lang = 'bn' } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are the smart customer support AI Assistant for "My Store Site" (মাই স্টোর সাইট).
Store Details:
- Name: My Store Site
- Location coverage: Bangladesh, specifically Dhaka Division, Kishoreganj District, Karimganj Thana, and extensive delivery to all wards (1 to 9) of No. 3 Kiraton Union Parishad (৩ নং কিরাটন ইউনিয়ন পরিষদ), as well as nationwide delivery.
- Products: Electronics, Organic Grocery, Smart Gadgets, Home Essentials, Fashion, Mobile accessories.
- Upcoming Products (আসন্ন পণ্য): iPhone 16 Pro Max, Smart Rice Cooker, Organic Honey Jar, 4K Drone Camera (pre-orders available).
- Payment methods: bKash (বিকাশ) and Nagad (নগদ).
- Delivery feature: Customers can share live GPS location, attach house & road photo from camera/gallery, and write detailed delivery notes.
- Customer benefits: 1 to 7 Stars rating system, Regular customer discounts & badge, Wholesaler promotion opportunities for 7-star members.
- Language: Respond in ${lang === 'bn' ? 'Bengali (বাংলা)' : 'English'}, friendly, polite, and helpful tone. Keep answers concise, actionable, and formatted nicely.`;

    if (ai) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI request timeout')), 4000)
        );

        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${systemPrompt}\n\nCustomer question: ${message}`,
        });

        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        const reply = response?.text;
        if (reply) {
          return res.json({ reply });
        }
      } catch (err: any) {
        console.warn('Gemini API notice, utilizing instant fallback:', err?.message);
      }
    }

    // Built-in intelligent fallback when key is not present or API unavailable
    const q = (message || '').toLowerCase();
    let fallbackReply = '';

    if (lang === 'bn') {
      if (q.includes('দাম') || q.includes('মূল্য') || q.includes('price')) {
        fallbackReply = 'আমাদের স্টোরে বিভিন্ন পণ্যের আকর্ষণীয় দাম রয়েছে! যেমন স্মার্ট গ্যাজেট ৳৯৫০ থেকে ৳৪,৫০০, অর্গানিক গ্রোসারি ৳২৫০ থেকে ৳১,২০০। নিয়মিত কাস্টমারদের জন্য ৫% থেকে ২০% পর্যন্ত বিশেষ ছাড় রয়েছে।';
      } else if (q.includes('অফার') || q.includes('offer') || q.includes('ছাড়') || q.includes('ডিসকাউন্ট')) {
        fallbackReply = 'বর্তমানে আমাদের বিশেষ উইকলি অফার চলছে! রেগুলার কাস্টমার এবং লেভেল প্রাপ্ত ক্রেতাদের জন্য সর্বোচ্চ ২০% ডিসকাউন্ট এবং ৩ নং কিরাটন ইউনিয়নে ফ্রি হোম ডেলিভারি অফার থাকছে।';
      } else if (q.includes('পেমেন্ট') || q.includes('টাকা') || q.includes('payment') || q.includes('বিকাশ') || q.includes('নগদ')) {
        fallbackReply = 'আপনি খুব সহজে বিকাশ (bKash) এবং নগদ (Nagad) এর মাধ্যমে পেমেন্ট করতে পারবেন। অর্ডার কনফার্ম করে ট্রানজেকশন আইডি দিন অথবা ক্যাশ অন ডেলিভারি সিলেক্ট করুন।';
      } else if (q.includes('ডেলিভারি') || q.includes('করিমগঞ্জ') || q.includes('কিরাটন') || q.includes('লোকেশন')) {
        fallbackReply = 'আমরা কিশোরগঞ্জ জেলার করিমগঞ্জ থানার ৩ নং কিরাটন ইউনিয়ন পরিষদের ১ থেকে ৯ নং সকল ওয়ার্ডে দ্রুত হোম ডেলিভারি দিয়ে থাকি। আপনি অর্ডারের সময় লাইভ জিপিএস লোকেশন ও বাসার ছবি শেয়ার করতে পারবেন!';
      } else if (q.includes('আপকামিং') || q.includes('নতুন') || q.includes('upcoming')) {
        fallbackReply = 'আমাদের আপকামিং তালিকায় রয়েছে প্রিমিয়াম গ্যাজেট, স্মার্ট রাইস কুকার এবং খাঁটি অর্গানিক মধু! আপনি এখনই প্রি-অর্ডার (Pre-order) করে স্টক নিশ্চিত করতে পারেন।';
      } else {
        fallbackReply = 'স্বাগতম "My Store Site"-এ! আপনার কি পণ্য, মূল্য, বিকাশ/নগদ পেমেন্ট অথবা করিমগঞ্জ ও কিরাটন ইউনিয়নের হোম ডেলিভারি সম্পর্কে জানতে চান? আমি সাহায্য করতে প্রস্তুত!';
      }
    } else {
      if (q.includes('price') || q.includes('cost')) {
        fallbackReply = 'Our products range from ৳250 to ৳8,500 with special seasonal discounts. Regular buyers get up to 20% loyalty markdown!';
      } else if (q.includes('payment') || q.includes('bkash') || q.includes('nagad')) {
        fallbackReply = 'We accept bKash and Nagad mobile financial services, as well as Cash on Delivery!';
      } else if (q.includes('delivery') || q.includes('location') || q.includes('karimganj')) {
        fallbackReply = 'We offer door-to-door delivery across Kishoreganj, Karimganj, and all wards of No. 3 Kiraton Union with live GPS pinpoint and house photo support!';
      } else {
        fallbackReply = 'Welcome to My Store Site! How can I assist you with products, upcoming pre-orders, bKash/Nagad checkout, or Kiraton Union deliveries?';
      }
    }

    return res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error('Assistant error:', error);
    return res.status(500).json({ error: 'Internal assistant error' });
  }
});

// Setup Vite middleware in dev or serve static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`My Store Site server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
