import React, { useState, useEffect } from 'react';
import { Home, CalendarDays, User, Wine, Trophy, Bell, ScanLine, Music, Users, Search, ChevronRight, Star, Plus, Camera, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, X } from 'lucide-react';

const TOKENS = {
  bg: '#0A0A0F',
  surface: '#12121A',
  surfaceHigh: '#1C1C28',
  accent: '#C8A96E',
  accentGlow: 'rgba(200, 169, 110, 0.15)',
  textPrimary: '#F0EDE8',
  textSecondary: '#7A7880',
  destructive: '#E05C5C',
  success: '#4CAF7D',
  border: 'rgba(255,255,255,0.06)',
};

const DATA = {
  user: {
    name: "Arjun R.",
    goaId: "#GOA-7842",
    tier: "INSIDER",
    points: 4850,
    visits: 12,
    memberSince: "Jan 2024"
  },
  upcomingReservation: {
    event: "Saturday Ritual ft. DJ KSHMR",
    date: "Sat, 13 Sep 2026",
    table: "TABLE 14",
    package: "Table of 4 — Gold Package",
    guests: 4
  },
  events: [
    { name: "Saturday Ritual", dj: "DJ KSHMR", date: "13 Sep", status: "BOOK NOW", price: "₹8,000" },
    { name: "Friday Noir", dj: "DJ Snake B2B", date: "19 Sep", status: "SOLD OUT", price: "₹12,000" },
    { name: "GOA Founders Night", dj: "Exclusive", date: "27 Sep", status: "BOOK NOW", price: "₹25,000" }
  ],
  bottles: [
    { name: "Johnnie Walker Black Label", remaining: 650, total: 750, expiry: "24 Oct 2026", status: "STORED" },
    { name: "Grey Goose Vodka", remaining: 200, total: 750, expiry: "18 Sep 2026", status: "EXPIRING SOON" }
  ],
  stories: [
    { name: "You", seen: false, isOwn: true },
    { name: "Priya", seen: false },
    { name: "Karan", seen: true },
    { name: "Meera", seen: false },
    { name: "Dev", seen: true },
    { name: "Rahul", seen: false }
  ],
  posts: [
    {
      id: 1,
      user: "Priya S.",
      initials: "PS",
      tier: "VIP",
      time: "2h ago",
      caption: "Nothing hits like a Saturday at GOA 🥃🔥 Table 8 was unreal tonight.",
      filter: "GOLDEN HOUR",
      likes: 248,
      comments: [
        { user: "Karan M.", initials: "KM", text: "Agreed 🔥 see you next week", time: "1h ago", likes: 12 },
        { user: "Dev R.", initials: "DR", text: "Table 8 gang 🙌", time: "45m ago", likes: 4 }
      ],
      liked: false,
      saved: false
    },
    {
      id: 2,
      user: "Karan M.",
      initials: "KM",
      tier: "INSIDER",
      time: "4h ago",
      caption: "DJ KSHMR absolutely destroyed it. Requesting the same set every week 🎧",
      filter: "DJ MODE",
      likes: 412,
      comments: [
        { user: "Priya S.", initials: "PS", text: "That drop at 1am 😭", time: "3h ago", likes: 28 }
      ],
      liked: true,
      saved: true
    },
    {
      id: 3,
      user: "Meera R.",
      initials: "MR",
      tier: "BLACK",
      time: "6h ago",
      caption: "Bottle drop for the crew 🍾 See you next Saturday.",
      filter: "BOTTLE DROP",
      likes: 189,
      comments: [
        { user: "Rahul K.", initials: "RK", text: "Carry me next time 😂", time: "5h ago", likes: 7 }
      ],
      liked: false,
      saved: false
    }
  ]
};

// --- Shared Components ---

const Card = ({ children, style = {} }: { children: React.ReactNode, style?: React.CSSProperties }) => (
  <div style={{
    backgroundColor: TOKENS.surface,
    border: `1px solid ${TOKENS.border}`,
    borderRadius: '16px',
    padding: '16px',
    ...style
  }}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', fullWidth = false, style = {}, onClick, disabled = false }: { children: React.ReactNode, variant?: string, fullWidth?: boolean, style?: React.CSSProperties, onClick?: () => void, disabled?: boolean }) => {
  const isPrimary = variant === 'primary';
  return (
    <button onClick={onClick} disabled={disabled} style={{
      backgroundColor: isPrimary ? TOKENS.accent : 'transparent',
      color: isPrimary ? TOKENS.bg : TOKENS.accent,
      border: isPrimary ? 'none' : `1px solid ${TOKENS.accent}`,
      borderRadius: '12px',
      padding: '12px 16px',
      fontWeight: '600',
      fontFamily: 'Inter, sans-serif',
      width: fullWidth ? '100%' : 'auto',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      opacity: disabled ? 0.5 : 1,
      ...style
    }}>
      {children}
    </button>
  );
};

const StatusPill = ({ text, status }: { text: string, status: string }) => {
  let color = TOKENS.textSecondary;
  if (status === 'STORED') color = TOKENS.success;
  if (status === 'EXPIRING SOON') color = '#FFA000';
  if (status === 'SOLD OUT') color = TOKENS.destructive;
  if (status === 'BOOK NOW') color = TOKENS.accent;
  
  return (
    <span style={{
      fontSize: '10px',
      fontWeight: '600',
      padding: '4px 8px',
      borderRadius: '8px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      color: color,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {text}
    </span>
  );
};

const TierBadge = ({ tier }: { tier: string }) => (
  <span style={{
    backgroundColor: TOKENS.surfaceHigh,
    color: TOKENS.accent,
    border: `1px solid ${TOKENS.accent}`,
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '4px',
    letterSpacing: '1px'
  }}>
    {tier}
  </span>
);

const Avatar = ({ initials, size = 42 }: { initials: string, size?: number }) => {
  const colors = ['#2A1B38', '#1A2F3A', '#3A1F1F', '#24241A'];
  const charCode = initials.charCodeAt(0) || 0;
  const bgColor = colors[charCode % colors.length];
  
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: bgColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: TOKENS.textPrimary,
      fontSize: size * 0.4,
      fontWeight: '500'
    }}>
      {initials}
    </div>
  );
};

// --- Screens ---

const SocialScreen = () => {
  const [postsState, setPostsState] = useState(DATA.posts);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('None');
  const [commentText, setCommentText] = useState('');

  const toggleLike = (id: number) => {
    setPostsState(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  const toggleSave = (id: number) => {
    setPostsState(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
  };
  
  const openComments = (id: number) => {
    setActivePostId(id);
    setCommentSheetOpen(true);
  };

  const activePost = postsState.find(p => p.id === activePostId);

  const getFilterStyles = (filterName: string): React.CSSProperties => {
    switch(filterName) {
      case 'NIGHT MODE':
        return { background: `linear-gradient(to top, rgba(0,0,30,0.7), transparent)` };
      case 'GOLDEN HOUR':
        return { background: `rgba(200,150,50,0.18)`, boxShadow: 'inset 0 0 60px rgba(200,150,50,0.2)' };
      case 'VIP ACCESS':
        return { boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)' };
      case 'DJ MODE':
        return { background: `rgba(120,60,200,0.2)` };
      case 'BOTTLE DROP':
        return { background: `rgba(200,169,110,0.12)` };
      case 'GOA MEMORIES':
        return { filter: 'sepia(0.4) contrast(1.1)', backgroundColor: '#3A3020' }; // slight bg for placeholder
      case 'INSIDER':
        return {};
      default:
        return {};
    }
  };

  const renderFilterWatermark = (filterName: string, userTier: string) => {
    switch(filterName) {
      case 'NIGHT MODE':
        return <div style={{ position: 'absolute', bottom: '12px', left: '12px', color: TOKENS.accent, fontSize: '9px', fontWeight: '600', letterSpacing: '1px' }}>GOA NIGHT MODE</div>;
      case 'VIP ACCESS':
        return <div style={{ position: 'absolute', top: '12px', right: '12px', color: TOKENS.accent, fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px' }}>VIP</div>;
      case 'DJ MODE':
        return (
          <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '24px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', opacity: 0.5, padding: '0 20px' }}>
            {[...Array(15)].map((_, i) => <div key={i} style={{ width: '4px', height: `${Math.random() * 20 + 4}px`, backgroundColor: TOKENS.accent, borderRadius: '2px' }} />)}
          </div>
        );
      case 'BOTTLE DROP':
        return <div style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)', fontSize: '24px', opacity: 0.4 }}>🍾</div>;
      case 'GOA MEMORIES':
        return <div style={{ position: 'absolute', bottom: '12px', right: '12px', color: TOKENS.accent, fontSize: '9px', fontWeight: '600', letterSpacing: '1px' }}>GOA 2026</div>;
      case 'INSIDER':
        return <div style={{ position: 'absolute', top: '12px', left: '12px' }}><TierBadge tier={userTier || "INSIDER"} /></div>;
      default:
        return null;
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: TOKENS.textPrimary, margin: 0 }}>Community</h1>
        <button onClick={() => setCreatePostOpen(true)} style={{ background: 'none', border: 'none', color: TOKENS.accent, cursor: 'pointer', padding: '4px' }}>
          <Camera size={24} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Stories Row */}
        <div style={{ display: 'flex', gap: '16px', padding: '0 24px 24px 24px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {DATA.stories.map((story, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '28px',
                border: story.isOwn ? `1px dashed ${TOKENS.accent}` : `2px solid ${story.seen ? TOKENS.surfaceHigh : TOKENS.accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px'
              }}>
                {story.isOwn ? (
                  <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: TOKENS.surfaceHigh, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={20} color={TOKENS.accent} />
                  </div>
                ) : (
                  <Avatar initials={story.name.substring(0,2).toUpperCase()} size={48} />
                )}
              </div>
              <span style={{ fontSize: '10px', color: TOKENS.textSecondary }}>{story.isOwn ? 'Your Story' : story.name}</span>
            </div>
          ))}
        </div>

        {/* Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '24px' }}>
          {postsState.map(post => (
            <div key={post.id}>
              {/* Post Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px 12px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar initials={post.initials} size={42} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: TOKENS.textPrimary, fontSize: '14px', fontWeight: '500' }}>{post.user}</span>
                      <TierBadge tier={post.tier} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: TOKENS.textSecondary, fontSize: '12px' }}>{post.time}</span>
                  <MoreHorizontal size={20} color={TOKENS.textSecondary} />
                </div>
              </div>

              {/* Media Block */}
              <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: TOKENS.surfaceHigh, position: 'relative', overflow: 'hidden' }}>
                {/* CSS Filter Overlay */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, ...getFilterStyles(post.filter) }}>
                  {renderFilterWatermark(post.filter, post.tier)}
                </div>
                
                {/* Filter Pill */}
                {post.filter !== 'None' && (
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: TOKENS.accent, fontSize: '10px', fontWeight: '600' }}>{post.filter}</span>
                  </div>
                )}
              </div>

              {/* Action Row */}
              <div style={{ padding: '16px 24px 8px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <Heart 
                    size={24} 
                    color={post.liked ? TOKENS.accent : TOKENS.textPrimary} 
                    fill={post.liked ? TOKENS.accent : 'none'} 
                    onClick={() => toggleLike(post.id)}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s', transform: post.liked ? 'scale(1.1)' : 'scale(1)' }} 
                  />
                  <MessageCircle size={24} color={TOKENS.textPrimary} onClick={() => openComments(post.id)} style={{ cursor: 'pointer' }} />
                  <Share2 size={24} color={TOKENS.textPrimary} style={{ cursor: 'pointer' }} />
                </div>
                <Bookmark 
                  size={24} 
                  color={post.saved ? TOKENS.accent : TOKENS.textPrimary} 
                  fill={post.saved ? TOKENS.accent : 'none'} 
                  onClick={() => toggleSave(post.id)}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              {/* Likes & Caption */}
              <div style={{ padding: '0 24px' }}>
                <div style={{ color: TOKENS.textPrimary, fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>{post.likes} likes</div>
                <div style={{ color: TOKENS.textPrimary, fontSize: '13px', lineHeight: '1.4', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', marginRight: '8px' }}>{post.user}</span>
                  {post.caption}
                </div>
                
                {/* Comment Preview */}
                {post.comments.length > 0 && (
                  <div onClick={() => openComments(post.id)} style={{ cursor: 'pointer', marginTop: '8px' }}>
                    <span style={{ color: TOKENS.textSecondary, fontSize: '12px', display: 'block', marginBottom: '8px' }}>View all {post.comments.length} comments</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Avatar initials={post.comments[0].initials} size={24} />
                      <div style={{ color: TOKENS.textSecondary, fontSize: '12px' }}>
                        <span style={{ color: TOKENS.textPrimary, fontWeight: '600', marginRight: '6px' }}>{post.comments[0].user}</span>
                        {post.comments[0].text}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Post Sheet */}
      {createPostOpen && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '85%',
          backgroundColor: TOKENS.surface, borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
          zIndex: 50, padding: '16px 24px 24px 24px', display: 'flex', flexDirection: 'column',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.3s'
        }}>
          <div style={{ width: '40px', height: '4px', backgroundColor: TOKENS.surfaceHigh, borderRadius: '2px', margin: '0 auto 16px auto' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: TOKENS.textPrimary, margin: 0 }}>New Post</h2>
            <button onClick={() => setCreatePostOpen(false)} style={{ background: 'none', border: 'none', color: TOKENS.textSecondary, cursor: 'pointer' }}><X size={20} /></button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ height: '200px', backgroundColor: TOKENS.surfaceHigh, borderRadius: '12px', border: `1px dashed ${TOKENS.accent}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer' }}>
              <Camera size={32} color={TOKENS.textSecondary} />
              <span style={{ color: TOKENS.textSecondary, fontSize: '12px' }}>Tap to add photo or video</span>
            </div>
            
            <textarea 
              placeholder="What happened at GOA tonight?"
              style={{ width: '100%', minHeight: '80px', backgroundColor: 'transparent', border: 'none', color: TOKENS.textPrimary, fontSize: '14px', resize: 'none', outline: 'none', fontFamily: 'Inter, sans-serif' }}
            />
            
            <div>
              <div style={{ color: TOKENS.accent, fontSize: '12px', marginBottom: '12px' }}>Add a filter</div>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                {['None', 'NIGHT MODE', 'GOLDEN HOUR', 'VIP ACCESS', 'DJ MODE', 'BOTTLE DROP', 'GOA MEMORIES', 'INSIDER'].map(f => (
                  <div key={f} onClick={() => setSelectedFilter(f)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <div style={{ 
                      width: '56px', height: '56px', borderRadius: '12px', backgroundColor: TOKENS.surfaceHigh,
                      border: selectedFilter === f ? `2px solid ${TOKENS.accent}` : '2px solid transparent',
                      position: 'relative', overflow: 'hidden'
                    }}>
                      <div style={{ position: 'absolute', top:0, left:0, right:0, bottom:0, ...getFilterStyles(f) }}>
                        {renderFilterWatermark(f, "INSIDER")}
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', color: selectedFilter === f ? TOKENS.accent : TOKENS.textSecondary }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: TOKENS.surfaceHigh, borderRadius: '12px' }}>
              <span style={{ color: TOKENS.textPrimary, fontSize: '14px' }}>🎉 Tag tonight's event</span>
              <StatusPill text="Saturday Ritual ft. DJ KSHMR" status="BOOK NOW" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: TOKENS.surfaceHigh, borderRadius: '12px' }}>
              <span style={{ color: TOKENS.textPrimary, fontSize: '14px' }}>👥 Tag people</span>
              <ChevronRight size={18} color={TOKENS.textSecondary} />
            </div>
            
            <div style={{ display: 'flex', backgroundColor: TOKENS.surfaceHigh, borderRadius: '8px', padding: '4px' }}>
               {['Everyone', 'Friends', 'Table Only'].map((opt, i) => (
                 <div key={opt} style={{ flex: 1, textAlign: 'center', padding: '8px', fontSize: '12px', color: i === 0 ? TOKENS.textPrimary : TOKENS.textSecondary, backgroundColor: i === 0 ? TOKENS.surface : 'transparent', borderRadius: '6px' }}>{opt}</div>
               ))}
            </div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <Button fullWidth onClick={() => setCreatePostOpen(false)}>Post to GOA</Button>
          </div>
        </div>
      )}

      {/* Comment Sheet */}
      {commentSheetOpen && activePost && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%',
          backgroundColor: TOKENS.surface, borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
          zIndex: 50, display: 'flex', flexDirection: 'column',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.3s'
        }}>
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${TOKENS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: TOKENS.textPrimary, margin: 0 }}>Comments</h2>
            <button onClick={() => setCommentSheetOpen(false)} style={{ background: 'none', border: 'none', color: TOKENS.textSecondary, cursor: 'pointer' }}><X size={20} /></button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
             {/* Original Caption */}
             <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                <Avatar initials={activePost.initials} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: TOKENS.textPrimary, fontSize: '13px', lineHeight: '1.4' }}>
                    <span style={{ fontWeight: '600', marginRight: '8px' }}>{activePost.user}</span>
                    {activePost.caption}
                  </div>
                  <div style={{ color: TOKENS.textSecondary, fontSize: '11px', marginTop: '4px' }}>{activePost.time}</div>
                </div>
             </div>
             
             <div style={{ height: '1px', backgroundColor: TOKENS.border }} />

             {activePost.comments.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px' }}>
                   <Avatar initials={c.initials} size={32} />
                   <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                         <div style={{ color: TOKENS.textPrimary, fontSize: '13px', lineHeight: '1.4' }}>
                            <span style={{ fontWeight: '600', marginRight: '8px' }}>{c.user}</span>
                            {c.text}
                         </div>
                         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                           <Heart size={14} color={TOKENS.textSecondary} style={{ cursor: 'pointer' }} />
                           <span style={{ color: TOKENS.textSecondary, fontSize: '10px' }}>{c.likes}</span>
                         </div>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                         <span style={{ color: TOKENS.textSecondary, fontSize: '11px' }}>{c.time}</span>
                         <span style={{ color: TOKENS.accent, fontSize: '11px', fontWeight: '500', cursor: 'pointer' }}>Reply</span>
                      </div>
                   </div>
                </div>
             ))}
          </div>

          <div style={{ padding: '16px 24px', borderTop: `1px solid ${TOKENS.border}`, display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: TOKENS.surface }}>
             <Avatar initials={DATA.user.name.substring(0,2).toUpperCase()} size={28} />
             <input 
               type="text" 
               placeholder="Add a comment..." 
               value={commentText}
               onChange={(e) => setCommentText(e.target.value)}
               style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: TOKENS.textPrimary, fontSize: '14px', outline: 'none' }}
             />
             <button disabled={!commentText.trim()} style={{ background: 'none', border: 'none', color: TOKENS.accent, fontSize: '14px', fontWeight: '600', opacity: commentText.trim() ? 1 : 0.5, cursor: commentText.trim() ? 'pointer' : 'not-allowed' }}>
               Post
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

const HomeScreen = ({ nightModeActive, setNightModeActive }: { nightModeActive: boolean, setNightModeActive: (active: boolean) => void }) => {
  if (nightModeActive) {
    return (
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.5s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: TOKENS.success, boxShadow: `0 0 8px ${TOKENS.success}` }} />
            <span style={{ color: TOKENS.success, fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}>GOA NIGHT MODE</span>
          </div>
          <button onClick={() => setNightModeActive(false)} style={{ background: 'none', border: 'none', color: TOKENS.textSecondary, fontSize: '12px', cursor: 'pointer' }}>Exit</button>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div style={{ color: TOKENS.textSecondary, fontSize: '14px', marginBottom: '4px' }}>You're in.</div>
          <div style={{ color: TOKENS.accent, fontSize: '42px', fontWeight: '300', letterSpacing: '-1px' }}>TABLE 14</div>
          <div style={{ color: TOKENS.textPrimary, fontSize: '16px', marginTop: '8px' }}>₹24,500 tonight</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
          {['Order', 'Request Song', 'Call Waiter', 'My Bill'].map(action => (
            <Card key={action} style={{ padding: '16px 12px', textAlign: 'center', cursor: 'pointer', backgroundColor: TOKENS.surfaceHigh }}>
              <span style={{ color: TOKENS.textPrimary, fontSize: '14px', fontWeight: '500' }}>{action}</span>
            </Card>
          ))}
        </div>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: TOKENS.textPrimary, fontSize: '14px', fontWeight: '600' }}>Now Playing</span>
            <span style={{ color: TOKENS.textSecondary, fontSize: '12px' }}>4 Requests</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: TOKENS.surfaceHigh, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Music size={20} color={TOKENS.accent} />
            </div>
            <div>
              <div style={{ color: TOKENS.textPrimary, fontSize: '14px', fontWeight: '500' }}>DJ KSHMR Live</div>
              <div style={{ color: TOKENS.textSecondary, fontSize: '12px' }}>Main Floor</div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '24px' }}>
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '300', color: TOKENS.textPrimary, letterSpacing: '4px', margin: 0 }}>GOA</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => setNightModeActive(true)} style={{ background: 'none', border: `1px solid ${TOKENS.border}`, borderRadius: '20px', padding: '6px 12px', color: TOKENS.textSecondary, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Night Mode <ChevronRight size={12} />
          </button>
          <Bell color={TOKENS.textPrimary} size={24} />
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        <div style={{ fontSize: '20px', color: TOKENS.textPrimary, fontWeight: '300', marginBottom: '4px' }}>
          Good evening, {DATA.user.name.split(' ')[0]}
        </div>
        <TierBadge tier={DATA.user.tier} />
      </div>

      <div style={{ padding: '24px' }}>
        <Card style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${TOKENS.accent}, transparent)` }} />
          <div style={{ color: TOKENS.textSecondary, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Next Reservation</div>
          <div style={{ fontSize: '18px', color: TOKENS.textPrimary, fontWeight: '500', marginBottom: '4px' }}>{DATA.upcomingReservation.event}</div>
          <div style={{ color: TOKENS.textSecondary, fontSize: '14px', marginBottom: '16px' }}>{DATA.upcomingReservation.date} • {DATA.upcomingReservation.table}</div>
          <Button fullWidth>
            <ScanLine size={18} /> View QR Code
          </Button>
        </Card>
      </div>

      <div style={{ padding: '0 0 24px 24px' }}>
        <div style={{ fontSize: '16px', color: TOKENS.textPrimary, fontWeight: '500', marginBottom: '16px' }}>Happening This Week</div>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingRight: '24px', scrollbarWidth: 'none' }}>
          {DATA.events.map((event, i) => (
            <Card key={i} style={{ minWidth: '240px', flexShrink: 0, padding: 0, overflow: 'hidden' }}>
              <div style={{ height: '120px', backgroundColor: TOKENS.surfaceHigh, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: TOKENS.textSecondary, fontSize: '12px', letterSpacing: '2px' }}>IMAGE 16:9</span>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ color: TOKENS.textPrimary, fontSize: '14px', fontWeight: '500' }}>{event.name}</div>
                    <div style={{ color: TOKENS.textSecondary, fontSize: '12px' }}>{event.date} • {event.dj}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <span style={{ color: TOKENS.textSecondary, fontSize: '14px' }}>{event.price}</span>
                  <StatusPill text={event.status} status={event.status} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const ReserveScreen = () => (
  <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
    <h2 style={{ fontSize: '24px', color: TOKENS.textPrimary, fontWeight: '300', marginBottom: '24px', marginTop: 0 }}>Reservations</h2>
    
    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '8px' }}>
      {['All', 'Weekend', 'Special Event', 'Live DJ'].map((filter, i) => (
        <span key={filter} style={{ 
          padding: '8px 16px', 
          borderRadius: '20px', 
          backgroundColor: i === 0 ? TOKENS.surfaceHigh : 'transparent',
          border: `1px solid ${i === 0 ? TOKENS.surfaceHigh : TOKENS.border}`,
          color: i === 0 ? TOKENS.textPrimary : TOKENS.textSecondary,
          fontSize: '14px',
          whiteSpace: 'nowrap'
        }}>
          {filter}
        </span>
      ))}
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {DATA.events.map((event, i) => (
        <Card key={i} style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: '160px', backgroundColor: TOKENS.surfaceHigh, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
             <span style={{ color: TOKENS.textSecondary, fontSize: '12px', letterSpacing: '2px' }}>EVENT IMAGE</span>
             <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
               <StatusPill text={event.status} status={event.status} />
             </div>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ fontSize: '18px', color: TOKENS.textPrimary, fontWeight: '500', marginBottom: '4px' }}>{event.name}</div>
            <div style={{ color: TOKENS.textSecondary, fontSize: '14px', marginBottom: '16px' }}>{event.date} • {event.dj}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: TOKENS.textPrimary, fontSize: '14px' }}>From {event.price}</span>
              <Button>View & Book</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const MyGoaScreen = () => (
  <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', marginTop: '16px' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '40px', backgroundColor: TOKENS.surfaceHigh, border: `2px solid ${TOKENS.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: TOKENS.accent, marginBottom: '16px' }}>
        {DATA.user.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div style={{ fontSize: '24px', color: TOKENS.textPrimary, fontWeight: '400', marginBottom: '4px' }}>{DATA.user.name}</div>
      <div style={{ color: TOKENS.textSecondary, fontSize: '14px', letterSpacing: '1px' }}>{DATA.user.goaId}</div>
    </div>

    <Card style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ color: TOKENS.textPrimary, fontSize: '14px', fontWeight: '500' }}>{DATA.user.tier} TIER</span>
        <span style={{ color: TOKENS.accent, fontSize: '14px' }}>{DATA.user.points} pts</span>
      </div>
      <div style={{ height: '4px', backgroundColor: TOKENS.surfaceHigh, borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: '60%', height: '100%', backgroundColor: TOKENS.accent }} />
      </div>
      <div style={{ color: TOKENS.textSecondary, fontSize: '12px', marginTop: '8px', textAlign: 'right' }}>150 pts to VIP</div>
    </Card>

    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', padding: '0 16px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: TOKENS.textPrimary, fontSize: '18px', fontWeight: '500' }}>{DATA.user.visits}</div>
        <div style={{ color: TOKENS.textSecondary, fontSize: '12px' }}>Visits</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: TOKENS.textPrimary, fontSize: '18px', fontWeight: '500' }}>₹3.2L</div>
        <div style={{ color: TOKENS.textSecondary, fontSize: '12px' }}>Spent</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: TOKENS.textPrimary, fontSize: '18px', fontWeight: '500' }}>2024</div>
        <div style={{ color: TOKENS.textSecondary, fontSize: '12px' }}>Member</div>
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {['Upcoming Reservations', 'Past Visits', 'Saved Preferences', 'Notifications'].map(section => (
        <div key={section} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: TOKENS.surface, borderRadius: '12px', border: `1px solid ${TOKENS.border}` }}>
          <span style={{ color: TOKENS.textPrimary, fontSize: '15px' }}>{section}</span>
          <ChevronRight size={18} color={TOKENS.textSecondary} />
        </div>
      ))}
    </div>
  </div>
);

const BottleWalletScreen = () => (
  <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '24px', color: TOKENS.textPrimary, fontWeight: '300', margin: 0 }}>My Bottles</h2>
      <Button variant="ghost" style={{ padding: '6px 12px', fontSize: '14px' }}>
        <Plus size={16} /> Add
      </Button>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {DATA.bottles.map((bottle, i) => (
        <Card key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ color: TOKENS.textPrimary, fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>{bottle.name}</div>
              <div style={{ color: TOKENS.textSecondary, fontSize: '12px' }}>Expires {bottle.expiry}</div>
            </div>
            <StatusPill text={bottle.status} status={bottle.status} />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
              <span style={{ color: TOKENS.textSecondary }}>Remaining</span>
              <span style={{ color: TOKENS.textPrimary }}>{bottle.remaining}ml / {bottle.total}ml</span>
            </div>
            <div style={{ height: '6px', backgroundColor: TOKENS.surfaceHigh, borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${(bottle.remaining / bottle.total) * 100}%`, height: '100%', backgroundColor: TOKENS.accent }} />
            </div>
          </div>

          <Button fullWidth variant={bottle.status === 'STORED' ? 'primary' : 'ghost'}>
            Retrieve Tonight
          </Button>
        </Card>
      ))}
    </div>
  </div>
);

const RewardsScreen = () => (
  <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
    <h2 style={{ fontSize: '24px', color: TOKENS.textPrimary, fontWeight: '300', marginBottom: '24px', marginTop: 0 }}>Rewards</h2>

    <Card style={{ 
      background: `linear-gradient(135deg, ${TOKENS.surfaceHigh} 0%, #2A241A 100%)`, 
      border: `1px solid ${TOKENS.accent}`,
      marginBottom: '32px',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <div style={{ color: TOKENS.textPrimary, fontSize: '20px', fontWeight: '400', marginBottom: '4px' }}>{DATA.user.name}</div>
          <div style={{ color: TOKENS.textSecondary, fontSize: '14px', letterSpacing: '2px' }}>{DATA.user.goaId}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: TOKENS.accent, fontSize: '24px', fontWeight: '300' }}>{DATA.user.points}</div>
          <div style={{ color: TOKENS.textSecondary, fontSize: '12px' }}>PTS</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <TierBadge tier={DATA.user.tier} />
        <h1 style={{ fontSize: '16px', fontWeight: '300', color: TOKENS.accent, letterSpacing: '4px', margin: 0, opacity: 0.5 }}>GOA</h1>
      </div>
    </Card>

    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', color: TOKENS.textPrimary, fontWeight: '400', marginBottom: '16px' }}>Redeem Points</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { title: 'Priority Table Access', pts: 500, icon: <Star size={18} color={TOKENS.accent} /> },
          { title: 'Birthday Upgrade', pts: 1000, icon: <Trophy size={18} color={TOKENS.accent} /> },
          { title: 'Complimentary Welcome Shot', pts: 200, icon: <Wine size={18} color={TOKENS.accent} /> }
        ].map((offer, i) => (
          <Card key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: TOKENS.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {offer.icon}
              </div>
              <span style={{ color: TOKENS.textPrimary, fontSize: '14px' }}>{offer.title}</span>
            </div>
            <span style={{ color: TOKENS.accent, fontSize: '14px', fontWeight: '500' }}>{offer.pts} pts</span>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// --- Main App & Shell ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [nightModeActive, setNightModeActive] = useState(false);

  const TABS = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'reserve', icon: CalendarDays, label: 'Reserve' },
    { id: 'social', icon: Users, label: 'Social' },
    { id: 'mygoa', icon: User, label: 'My GOA' },
    { id: 'wallet', icon: Wine, label: 'Wallet' },
    { id: 'rewards', icon: Trophy, label: 'Rewards' }
  ];

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen nightModeActive={nightModeActive} setNightModeActive={setNightModeActive} />;
      case 'reserve': return <ReserveScreen />;
      case 'social': return <SocialScreen />;
      case 'mygoa': return <MyGoaScreen />;
      case 'wallet': return <BottleWalletScreen />;
      case 'rewards': return <RewardsScreen />;
      default: return <HomeScreen nightModeActive={nightModeActive} setNightModeActive={setNightModeActive} />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      padding: '40px'
    }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
          
          * { box-sizing: border-box; }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}
      </style>
      
      {/* Mobile Device Frame */}
      <div style={{
        width: '390px',
        height: '844px',
        backgroundColor: TOKENS.bg,
        borderRadius: '40px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 0 12px #1A1A24',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Hardware Notch/Island (Cosmetic) */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '32px',
          backgroundColor: '#000',
          borderRadius: '16px',
          zIndex: 100
        }} />

        {/* Status Bar Space */}
        <div style={{ height: '54px', flexShrink: 0 }} />

        {/* Main Content Area */}
        {renderScreen()}

        {/* Bottom Navigation */}
        <div style={{
          height: '84px',
          backgroundColor: TOKENS.surface,
          borderTop: `1px solid ${TOKENS.border}`,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingBottom: '20px',
          flexShrink: 0
        }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            // Since we added a 6th tab, we might need slightly smaller font or spacing to fit them all neatly
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  color: isActive ? TOKENS.accent : TOKENS.textSecondary,
                  width: '56px'
                }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? TOKENS.accentGlow : 'none'} />
                <span style={{ fontSize: '9px', fontWeight: isActive ? '500' : '400' }}>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
