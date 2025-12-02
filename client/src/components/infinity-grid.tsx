import React from 'react';
import { Link } from 'wouter';
import * as LucideIcons from 'lucide-react';
import { Topic, useTraining, ProgressStatus } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Edit } from 'lucide-react';

interface InfinityGridProps {
  topics: Topic[];
  onEdit?: (topic: Topic) => void;
}

interface Position {
  top: string;
  left: string;
  zIndex?: number;
}

// Helper function to get image path for a topic
const getTopicImagePath = (title: string): string | null => {
  const normalizedTitle = title.toLowerCase().trim();
  
  // Direct mappings
  const imageMap: Record<string, string> = {
    'mbes': '/images/topics/mbes.jpg',
    'vc': '/images/topics/svc.png',
    'qinsy': '/images/topics/qinsy.png',
    'apos': '/images/topics/apos.png',
    'naviscan': '/images/topics/naviscan.jpg',
    'sss': '/images/topics/sss.png',
    'svp': '/images/topics/svp.png',
    'cpt': '/images/topics/cpt.png',
    'subc dvr': '/images/topics/subc dvr.png',
  };
  
  // Check direct mapping first
  if (imageMap[normalizedTitle]) {
    return imageMap[normalizedTitle];
  }
  
  // Check for partial matches
  if (normalizedTitle.includes('online') || normalizedTitle.includes('auto log')) {
    return '/images/topics/onlinelog_autolog.png';
  }
  if (normalizedTitle.includes('helmsman') || normalizedTitle.includes('touchpad')) {
    return '/images/topics/helmsman_touchpad.png';
  }
  
  return null;
};

export function InfinityGrid({ topics, onEdit }: InfinityGridProps) {
  const { progress, currentUser, viewAsUser } = useTraining();
  
  // Filter out archived topics
  const activeTopics = topics.filter(t => !t.isDeleted);

  const displayUser = viewAsUser || currentUser;

  // Calculate dynamic icon size based on total items
  // Base size is w-28/h-28 (7rem = 112px) for clean grid display
  const getScaleFactor = (count: number) => {
    if (count <= 8) return 1;
    if (count <= 12) return 0.9;
    if (count <= 16) return 0.85;
    return 0.8;
  };
  
  const scaleFactor = getScaleFactor(activeTopics.length);

  // Helper to get pie chart background
  const getPieChartBackground = (topic: Topic) => {
    if (!topic.subtopics.length) return 'white'; // No subtopics, just white

    const subtopicIds = topic.subtopics.map(s => s.id);
    const topicProgress = progress.filter(p => p.userId === displayUser?.id && subtopicIds.includes(p.subtopicId));
    
    const counts = {
      fully_understood: 0,
      good: 0,
      basic: 0,
      not_addressed: 0
    };

    topic.subtopics.forEach(st => {
      const p = topicProgress.find(tp => tp.subtopicId === st.id);
      const status = p?.status || 'not_addressed';
      counts[status === 'fully_understood' ? 'fully_understood' : 
             status === 'good' ? 'good' : 
             status === 'basic' ? 'basic' : 'not_addressed']++;
    });

    const total = topic.subtopics.length;
    const pFully = (counts.fully_understood / total) * 100;
    const pGood = (counts.good / total) * 100;
    const pBasic = (counts.basic / total) * 100;
    const pNot = (counts.not_addressed / total) * 100;

    // Light colors for pie chart
    const cFully = '#bbf7d0'; // light green
    const cGood = '#bfdbfe'; // light blue
    const cBasic = '#fef08a'; // light yellow
    const cNot = '#fecaca'; // light red

    // Conic gradient logic
    // standard order: fully -> good -> basic -> not
    let currentDeg = 0;
    const stops = [];

    if (pFully > 0) {
      stops.push(`${cFully} 0deg ${currentDeg + (pFully * 3.6)}deg`);
      currentDeg += pFully * 3.6;
    }
    if (pGood > 0) {
      stops.push(`${cGood} ${currentDeg}deg ${currentDeg + (pGood * 3.6)}deg`);
      currentDeg += pGood * 3.6;
    }
    if (pBasic > 0) {
      stops.push(`${cBasic} ${currentDeg}deg ${currentDeg + (pBasic * 3.6)}deg`);
      currentDeg += pBasic * 3.6;
    }
    if (pNot > 0) {
      stops.push(`${cNot} ${currentDeg}deg 360deg`);
    }

    return `conic-gradient(${stops.join(', ')})`;
  };

  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-16 place-items-center">
        {activeTopics.map((topic, index) => {
          const IconComponent = (LucideIcons as any)[topic.icon] || LucideIcons.HelpCircle;
          const topicImage = getTopicImagePath(topic.title);

          return (
            <div 
              key={topic.id}
              className="relative group w-fit"
            >
              <Link href={`/topic/${topic.id}`}>
                <div
                  className={cn(
                    "flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden",
                    topicImage ? "rounded-3xl" : "rounded-full",
                    "shadow-lg hover:shadow-xl border-4 border-white transition-all duration-300",
                    "hover:scale-110 hover:border-primary"
                  )}
                  style={{
                     background: topicImage ? 'transparent' : getPieChartBackground(topic),
                     width: `${7 * scaleFactor}rem`,
                     height: `${7 * scaleFactor}rem`
                  }}
                >
                  {topicImage ? (
                    <div 
                      className="relative w-full h-full"
                      style={topic.title.toLowerCase().includes('subc dvr') ? { backgroundColor: '#FFFFFF' } : undefined}
                    >
                      <img 
                        src={topicImage} 
                        alt={topic.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                    </div>
                  ) : (
                    <div className="p-3 rounded-full bg-white/80 group-hover:bg-white/90 transition-colors backdrop-blur-sm">
                      <IconComponent 
                        className="text-primary group-hover:text-secondary transition-colors" 
                        style={{
                          width: `${2.2 * scaleFactor}rem`,
                          height: `${2.2 * scaleFactor}rem`
                        }}
                      />
                    </div>
                  )}
                </div>
              </Link>
              
              <span 
                className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs font-bold text-center px-3 py-1.5 leading-relaxed rounded-md"
                style={{ 
                  fontSize: '0.75rem', 
                  backgroundColor: '#7acc00', 
                  color: '#FFFFFF',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minWidth: '7rem',
                  maxWidth: '10rem'
                }}
              >
                {topic.title}
              </span>

              {onEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(topic);
                  }}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-gray-100 hover:bg-gray-50 text-gray-500 hover:text-secondary transition-colors z-20 opacity-0 group-hover:opacity-100"
                  title="Edit Module"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
