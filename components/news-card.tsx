import Image from "next/image";

interface NewsCardProps {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
}

export default function NewsCard({ 
  category, 
  title, 
  excerpt, 
  author, 
  date, 
  image 
}: NewsCardProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-2xl bg-white shadow-sm active:scale-[0.98] transition-transform">
      {/* 뉴스 이미지 영역 */}
      <div className="relative w-full md:w-40 h-40 shrink-0 overflow-hidden rounded-xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 뉴스 내용 영역 */}
      <div className="flex flex-col justify-between py-1">
        <div>
          <span className="text-xs font-bold uppercase text-purple-600 tracking-wider">
            {category}
          </span>
          <h3 className="text-lg font-semibold mt-1 leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {excerpt}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
          <span>{author}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
