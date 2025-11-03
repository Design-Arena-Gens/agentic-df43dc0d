'use client';

import { useState } from 'react';
import { Sparkles, Image as ImageIcon, Video, Send, Clock, CheckCircle2, Loader2 } from 'lucide-react';

interface GeneratedContent {
  caption: string;
  hashtags: string[];
  imageUrl?: string;
  videoUrl?: string;
  platforms: string[];
  status: 'generating' | 'ready' | 'posting' | 'posted';
}

export default function Home() {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<'image' | 'video'>('image');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [scheduleTime, setScheduleTime] = useState('');

  const platforms = [
    { id: 'instagram', name: 'Instagram', color: 'from-purple-500 to-pink-500', icon: '📸' },
    { id: 'facebook', name: 'Facebook', color: 'from-blue-600 to-blue-400', icon: '👥' },
    { id: 'youtube', name: 'YouTube', color: 'from-red-600 to-red-400', icon: '▶️' },
    { id: 'threads', name: 'Threads', color: 'from-gray-800 to-gray-600', icon: '🧵' },
    { id: 'pinterest', name: 'Pinterest', color: 'from-red-500 to-pink-500', icon: '📌' },
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const generateContent = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGeneratedContent({
      caption: '',
      hashtags: [],
      platforms: selectedPlatforms,
      status: 'generating',
    });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          contentType,
          platforms: selectedPlatforms,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedContent({
          caption: data.caption,
          hashtags: data.hashtags,
          imageUrl: data.imageUrl,
          videoUrl: data.videoUrl,
          platforms: selectedPlatforms,
          status: 'ready',
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const postContent = async () => {
    if (!generatedContent) return;

    setGeneratedContent(prev => prev ? { ...prev, status: 'posting' } : null);

    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: generatedContent,
          scheduleTime: scheduleTime || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedContent(prev => prev ? { ...prev, status: 'posted' } : null);
      }
    } catch (error) {
      console.error('Posting error:', error);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text flex items-center justify-center gap-3">
            <Sparkles className="w-12 h-12 text-purple-600" />
            Viral Content Automation
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered content creation and multi-platform publishing
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Content Generation Panel */}
          <div className="glass-card rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Generate Content
            </h2>

            {/* Topic Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Content Topic or Idea
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Morning coffee routine, Fitness motivation, Travel tips..."
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
              />
            </div>

            {/* Content Type */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                Content Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setContentType('image')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    contentType === 'image'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-semibold">Image Post</div>
                </button>
                <button
                  onClick={() => setContentType('video')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    contentType === 'video'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <Video className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-semibold">Video Post</div>
                </button>
              </div>
            </div>

            {/* Platform Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                Select Platforms
              </label>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      selectedPlatforms.includes(platform.id)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="font-semibold text-sm">{platform.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateContent}
              disabled={isGenerating || !topic.trim() || selectedPlatforms.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Viral Content
                </>
              )}
            </button>
          </div>

          {/* Preview & Post Panel */}
          <div className="glass-card rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-purple-600" />
              Content Preview
            </h2>

            {!generatedContent ? (
              <div className="text-center py-20 text-gray-400">
                <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Generate content to see preview</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Media Preview */}
                {generatedContent.status === 'generating' && (
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                  </div>
                )}

                {generatedContent.imageUrl && (
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={generatedContent.imageUrl}
                      alt="Generated content"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {generatedContent.videoUrl && (
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    <video
                      src={generatedContent.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Caption */}
                {generatedContent.caption && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Caption
                    </label>
                    <textarea
                      value={generatedContent.caption}
                      onChange={(e) =>
                        setGeneratedContent(prev =>
                          prev ? { ...prev, caption: e.target.value } : null
                        )
                      }
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={4}
                    />
                  </div>
                )}

                {/* Hashtags */}
                {generatedContent.hashtags.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Hashtags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.hashtags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Schedule Time */}
                {generatedContent.status === 'ready' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Schedule Post (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                {/* Post Button */}
                {generatedContent.status === 'ready' && (
                  <button
                    onClick={postContent}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {scheduleTime ? 'Schedule Post' : 'Post Now'}
                  </button>
                )}

                {generatedContent.status === 'posting' && (
                  <div className="text-center py-4">
                    <Loader2 className="w-8 h-8 mx-auto mb-2 text-purple-600 animate-spin" />
                    <p className="text-gray-600">Posting to platforms...</p>
                  </div>
                )}

                {generatedContent.status === 'posted' && (
                  <div className="text-center py-4 bg-green-50 rounded-xl">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-600" />
                    <p className="text-green-700 font-semibold text-lg">
                      Successfully posted to all platforms!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="glass-card rounded-xl p-6 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-bold text-lg mb-2">AI-Powered Generation</h3>
            <p className="text-gray-600 text-sm">
              GPT-4 creates viral captions and hashtags optimized for engagement
            </p>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-pink-600" />
            <h3 className="font-bold text-lg mb-2">Visual Content Creation</h3>
            <p className="text-gray-600 text-sm">
              Generate stunning images and videos with AI models
            </p>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <Send className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-bold text-lg mb-2">Multi-Platform Publishing</h3>
            <p className="text-gray-600 text-sm">
              Post simultaneously to Instagram, YouTube, Facebook, Threads, Pinterest
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
