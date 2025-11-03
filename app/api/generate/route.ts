import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Replicate from 'replicate';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-mode',
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || 'demo-mode',
});

export async function POST(request: NextRequest) {
  try {
    const { topic, contentType, platforms } = await request.json();

    // Generate caption and hashtags using GPT-4
    const captionResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a viral content creator specializing in social media. Create engaging, attention-grabbing captions that maximize engagement. Consider the platform differences: Instagram loves stories and aesthetics, YouTube wants detailed descriptions, Facebook prefers conversational tone, Threads wants concise thoughts, Pinterest needs descriptive keywords.`,
        },
        {
          role: 'user',
          content: `Create a viral social media caption about: "${topic}". The content will be posted to: ${platforms.join(', ')}. Make it engaging, relatable, and optimized for virality.`,
        },
      ],
      max_tokens: 300,
    });

    const caption = captionResponse.choices[0].message.content || '';

    // Generate relevant hashtags
    const hashtagResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a hashtag expert. Generate 10-15 highly relevant, trending hashtags without the # symbol. Mix popular and niche hashtags for maximum reach.',
        },
        {
          role: 'user',
          content: `Generate hashtags for this topic: "${topic}". Content platforms: ${platforms.join(', ')}. Return only the hashtags as a comma-separated list.`,
        },
      ],
      max_tokens: 150,
    });

    const hashtagText = hashtagResponse.choices[0].message.content || '';
    const hashtags = hashtagText
      .split(',')
      .map(tag => tag.trim().replace('#', ''))
      .filter(tag => tag.length > 0)
      .slice(0, 15);

    // Generate visual content based on type
    let imageUrl = '';
    let videoUrl = '';

    if (contentType === 'image') {
      // Generate image prompt
      const imagePromptResponse = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at creating detailed image generation prompts. Create vivid, specific prompts for AI image generation.',
          },
          {
            role: 'user',
            content: `Create a detailed image generation prompt for: "${topic}". Make it visually stunning and Instagram-worthy.`,
          },
        ],
        max_tokens: 200,
      });

      const imagePrompt = imagePromptResponse.choices[0].message.content || topic;

      // Check if Replicate API is configured
      if (process.env.REPLICATE_API_TOKEN && process.env.REPLICATE_API_TOKEN !== 'demo-mode') {
        try {
          const output = await replicate.run(
            "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            {
              input: {
                prompt: imagePrompt,
                negative_prompt: "ugly, blurry, low quality, distorted",
                width: 1024,
                height: 1024,
              }
            }
          );

          if (Array.isArray(output) && output.length > 0) {
            imageUrl = output[0] as string;
          }
        } catch (error) {
          console.error('Replicate image generation error:', error);
        }
      }

      // Fallback to placeholder if no image generated
      if (!imageUrl) {
        imageUrl = `https://placehold.co/1024x1024/667eea/white?text=${encodeURIComponent(topic.slice(0, 30))}`;
      }
    } else if (contentType === 'video') {
      // For demo purposes, use a placeholder
      videoUrl = `https://placehold.co/1920x1080/667eea/white?text=Video:+${encodeURIComponent(topic.slice(0, 20))}`;
    }

    return NextResponse.json({
      success: true,
      caption,
      hashtags,
      imageUrl,
      videoUrl,
    });
  } catch (error: any) {
    console.error('Generation error:', error);

    // Return demo content if APIs are not configured
    return NextResponse.json({
      success: true,
      caption: `✨ Exciting content about ${(await request.json()).topic}! This is where your AI-generated viral caption would appear. It would be crafted to maximize engagement and resonate with your audience across all selected platforms. 🚀\n\nDon't forget to follow for more amazing content!`,
      hashtags: ['viral', 'trending', 'socialmedia', 'content', 'instagram', 'motivation', 'lifestyle', 'inspiration', 'daily', 'fyp'],
      imageUrl: `https://placehold.co/1024x1024/667eea/white?text=Demo+Content`,
      videoUrl: '',
    });
  }
}
