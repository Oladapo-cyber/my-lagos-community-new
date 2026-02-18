
import React from 'react';
import { MessageCircle, Maximize2, Heart } from 'lucide-react';

const POSTS = [
  { date: '15 Jan', cat: 'Food, Lifestyle', title: 'Best Amala Spots in Lagos', excerpt: 'Discover the most authentic amala joints across Lagos — from Surulere to the Island.', comments: 42, img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&auto=format&fit=crop' },
  { date: '12 Jan', cat: 'Events, Nightlife', title: 'Top 10 Events This Month', excerpt: 'From live music at Terra Kulture to beach parties at Landmark — don\'t miss out.', comments: 35, img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&auto=format&fit=crop' },
  { date: '08 Jan', cat: 'Travel, Tourism', title: 'Hidden Gems of Lekki', excerpt: 'Explore the lesser-known attractions and beautiful spots tucked away in Lekki.', comments: 28, img: 'https://images.unsplash.com/photo-1518281361980-b26bfd556770?w=400&auto=format&fit=crop' },
  { date: '05 Jan', cat: 'Shopping, Fashion', title: 'Lagos Market Guide', excerpt: 'Your ultimate guide to the best markets for fashion, fabrics, and accessories.', comments: 51, img: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=400&auto=format&fit=crop' },
];

export const BlogSection: React.FC = () => {
  return (
    <section className="py-28 px-6">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-[44px] font-extrabold text-[#111] mb-6 tracking-tight leading-none">News & Tips</h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-500 font-bold text-sm leading-relaxed">
            What's new and upcoming, good news for our users and much more!<br />
            Stay updated with the latest happenings across Lagos.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {POSTS.map((post, idx) => (
          <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group cursor-pointer">
            <div className="relative h-56">
              <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-blue-600 text-white rounded-md p-2 w-12 text-center shadow-lg">
                <span className="block text-xl font-black leading-none">{post.date.split(' ')[0]}</span>
                <span className="block text-[9px] font-black uppercase tracking-tighter">{post.date.split(' ')[1]}</span>
              </div>
            </div>

            <div className="p-8">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] block mb-3">{post.cat}</span>
              <h3 className="text-xl font-black text-[#111] mb-4 tracking-tight group-hover:text-blue-600 transition-colors">{post.title}</h3>
              <p className="text-[13px] text-gray-500 font-bold leading-relaxed mb-8">{post.excerpt}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-400 group cursor-pointer hover:text-blue-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs font-black">{post.comments}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Maximize2 className="w-4 h-4 text-gray-300 hover:text-blue-600 transition-colors cursor-pointer" />
                  <Heart className="w-4 h-4 text-gray-300 hover:text-red-500 transition-colors cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
