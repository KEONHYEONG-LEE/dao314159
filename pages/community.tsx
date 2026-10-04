// @ts-nocheck
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowLeft, Plus, Search, Heart, MessageCircle, Flame, Clock, ShieldCheck } from 'lucide-react';

interface Post {
  id: number;
  author: string;
  badge: string;
  date: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  isPopular?: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "Fayruz01",
    badge: "입문자",
    date: "2026-10-04",
    title: "π is the best",
    content: "Siap sugih! Pi mainnet ecosystem is expanding rapidly.",
    likes: 2,
    comments: 0,
    isPopular: true
  },
  {
    id: 2,
    author: "Saber",
    badge: "입문자",
    date: "2026-10-03",
    title: "Pi Open Mainnet Checklist",
    content: "Make sure all your KYC steps are completely verified before the migration.",
    likes: 4,
    comments: 0,
    isPopular: true
  },
  {
    id: 3,
    author: "小飞侠",
    badge: "입문자",
    date: "2026-10-03",
    title: "pi Node setup guide",
    content: "还要多久? Port forwarding test passed successfully.",
    likes: 2,
    comments: 0
  },
  {
    id: 4,
    author: "许成功",
    badge: "입문자",
    date: "2026-10-02",
    title: "坚持高会成功",
    content: "人生有目标, 有梦想去追求, 就一定能成功!",
    likes: 3,
    comments: 0
  }
];

export default function CommunityPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'latest' | 'popular'>('latest');
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  const filteredPosts = posts.filter(p => 
    tab === 'popular' ? p.isPopular : true
  ).filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>GPNR Community - 파이어니어 커뮤니티</title>
      </Head>

      <div style={{ backgroundColor: '#0d0f1d', minHeight: '100vh', color: '#ffffff', paddingBottom: '40px' }}>
        {/* 상단 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', stickyTop: 0, backgroundColor: '#0d0f1d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>커뮤니티</h1>
          </div>
          <button
            onClick={() => alert("글쓰기 모달을 실행합니다.")}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#a855f7',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Plus className="w-4 h-4" />
            <span>글쓰기</span>
          </button>
        </div>

        <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
          {/* 상단 경고/안내문구 */}
          <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>
            욕설, 비방, 개인정보 노출 게시글은 사전 안내 없이 삭제될 수 있습니다.
          </p>

          {/* 검색바 */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search className="w-4 h-4" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="제목 또는 내용으로 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#16192e',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '10px 12px 10px 36px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* 탭 버튼 (최신글 / 추천글) */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={() => setTab('latest')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: tab === 'latest' ? '#a855f7' : 'rgba(255,255,255,0.05)',
                color: tab === 'latest' ? '#fff' : '#94a3b8',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>최신글</span>
            </button>
            <button
              onClick={() => setTab('popular')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: tab === 'popular' ? '#a855f7' : 'rgba(255,255,255,0.05)',
                color: tab === 'popular' ? '#fff' : '#94a3b8',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>추천글</span>
            </button>
          </div>

          {/* 게시글 리스트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundColor: '#16192e',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                {/* 작성자 정보 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>
                  <span style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>
                    {post.badge}
                  </span>
                  <span style={{ fontWeight: 'bold', color: '#cbd5e1' }}>{post.author}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                {/* 제목 및 내용 */}
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#ffffff' }}>
                  {post.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                  {post.content}
                </p>

                {/* 좋아요 및 댓글 수 */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', fontSize: '11px', color: '#f43f5e' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Heart className="w-3.5 h-3.5" />
                    <span>{post.likes}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#38bdf8' }}>
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

