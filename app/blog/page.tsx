import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

export const metadata = {
  title: "Blog - Discord Server Boost Guides | KloonBoosts",
  description: "Learn everything about Discord server boosts, crypto payments, and how to boost your Discord server effectively.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#09090b] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discord Boost <span className="text-blue-500">Guides</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about Discord server boosts, cryptocurrency payments, and community growth
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#09090b]/40 group-hover:bg-[#09090b]/20 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">{post.emoji}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-500 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-zinc-400 text-sm line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="mt-4 text-blue-500 text-sm font-medium flex items-center gap-2">
                  Read more
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
