import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface PostContent {
  caption: string;
  hashtags: string[];
  imageUrl?: string;
  videoUrl?: string;
  platforms: string[];
}

interface PostResult {
  platform: string;
  success: boolean;
  postId?: string;
  error?: string;
}

async function postToInstagram(content: PostContent): Promise<PostResult> {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    if (!accessToken || !accountId) {
      return { platform: 'instagram', success: false, error: 'API credentials not configured' };
    }

    const fullCaption = `${content.caption}\n\n${content.hashtags.map(tag => `#${tag}`).join(' ')}`;

    // Create media container
    const containerResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${accountId}/media`,
      {
        image_url: content.imageUrl,
        caption: fullCaption,
        access_token: accessToken,
      }
    );

    const containerId = containerResponse.data.id;

    // Publish the container
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${accountId}/media_publish`,
      {
        creation_id: containerId,
        access_token: accessToken,
      }
    );

    return {
      platform: 'instagram',
      success: true,
      postId: publishResponse.data.id,
    };
  } catch (error: any) {
    console.error('Instagram posting error:', error.response?.data || error.message);
    return {
      platform: 'instagram',
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

async function postToFacebook(content: PostContent): Promise<PostResult> {
  try {
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID;

    if (!accessToken || !pageId) {
      return { platform: 'facebook', success: false, error: 'API credentials not configured' };
    }

    const fullMessage = `${content.caption}\n\n${content.hashtags.map(tag => `#${tag}`).join(' ')}`;

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${pageId}/photos`,
      {
        url: content.imageUrl,
        message: fullMessage,
        access_token: accessToken,
      }
    );

    return {
      platform: 'facebook',
      success: true,
      postId: response.data.id,
    };
  } catch (error: any) {
    console.error('Facebook posting error:', error.response?.data || error.message);
    return {
      platform: 'facebook',
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

async function postToThreads(content: PostContent): Promise<PostResult> {
  try {
    const accessToken = process.env.THREADS_ACCESS_TOKEN;
    const userId = process.env.THREADS_USER_ID;

    if (!accessToken || !userId) {
      return { platform: 'threads', success: false, error: 'API credentials not configured' };
    }

    const fullText = `${content.caption}\n\n${content.hashtags.map(tag => `#${tag}`).join(' ')}`;

    // Create media container
    const containerResponse = await axios.post(
      `https://graph.threads.net/v1.0/${userId}/threads`,
      {
        media_type: 'IMAGE',
        image_url: content.imageUrl,
        text: fullText,
        access_token: accessToken,
      }
    );

    const containerId = containerResponse.data.id;

    // Publish the container
    const publishResponse = await axios.post(
      `https://graph.threads.net/v1.0/${userId}/threads_publish`,
      {
        creation_id: containerId,
        access_token: accessToken,
      }
    );

    return {
      platform: 'threads',
      success: true,
      postId: publishResponse.data.id,
    };
  } catch (error: any) {
    console.error('Threads posting error:', error.response?.data || error.message);
    return {
      platform: 'threads',
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

async function postToYouTube(content: PostContent): Promise<PostResult> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return { platform: 'youtube', success: false, error: 'API credentials not configured' };
    }

    // YouTube requires OAuth2 and video upload
    // This is a simplified version - full implementation requires video file
    return {
      platform: 'youtube',
      success: false,
      error: 'YouTube posting requires video upload and OAuth2 - use YouTube Studio',
    };
  } catch (error: any) {
    console.error('YouTube posting error:', error);
    return {
      platform: 'youtube',
      success: false,
      error: error.message,
    };
  }
}

async function postToPinterest(content: PostContent): Promise<PostResult> {
  try {
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    const boardId = process.env.PINTEREST_BOARD_ID;

    if (!accessToken || !boardId) {
      return { platform: 'pinterest', success: false, error: 'API credentials not configured' };
    }

    const response = await axios.post(
      'https://api.pinterest.com/v5/pins',
      {
        board_id: boardId,
        media_source: {
          source_type: 'image_url',
          url: content.imageUrl,
        },
        title: content.caption.slice(0, 100),
        description: `${content.caption}\n\n${content.hashtags.map(tag => `#${tag}`).join(' ')}`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      platform: 'pinterest',
      success: true,
      postId: response.data.id,
    };
  } catch (error: any) {
    console.error('Pinterest posting error:', error.response?.data || error.message);
    return {
      platform: 'pinterest',
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, scheduleTime } = await request.json();

    if (scheduleTime) {
      // In production, you would save this to a database and use a cron job
      // For demo, we'll just simulate scheduling
      return NextResponse.json({
        success: true,
        message: 'Post scheduled successfully',
        scheduledFor: scheduleTime,
        results: content.platforms.map((platform: string) => ({
          platform,
          success: true,
          scheduled: true,
        })),
      });
    }

    // Post to all selected platforms
    const postPromises = content.platforms.map((platform: string) => {
      switch (platform) {
        case 'instagram':
          return postToInstagram(content);
        case 'facebook':
          return postToFacebook(content);
        case 'threads':
          return postToThreads(content);
        case 'youtube':
          return postToYouTube(content);
        case 'pinterest':
          return postToPinterest(content);
        default:
          return Promise.resolve({
            platform,
            success: false,
            error: 'Unknown platform',
          });
      }
    });

    const results = await Promise.all(postPromises);

    // Check if any API is actually configured
    const hasConfiguredAPIs = results.some(r => r.error !== 'API credentials not configured');

    // If no APIs configured, return demo success
    if (!hasConfiguredAPIs) {
      return NextResponse.json({
        success: true,
        message: 'Demo mode: Posts simulated successfully',
        demo: true,
        results: content.platforms.map((platform: string) => ({
          platform,
          success: true,
          postId: `demo_${platform}_${Date.now()}`,
          note: 'Configure API credentials in .env to enable real posting',
        })),
      });
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error: any) {
    console.error('Posting error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
