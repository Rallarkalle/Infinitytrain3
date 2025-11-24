import React, { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Layout } from '@/components/layout';
import { useTraining, ProgressStatus } from '@/lib/store';
import { Notepad } from '@/components/notepad';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, BookOpen, MessageSquare, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TopicView() {
  const [, params] = useRoute('/topic/:id');
  const [, setLocation] = useLocation();
  const { topics, progress, updateProgress, addComment, currentUser } = useTraining();
  const [activeResource, setActiveResource] = useState<string | null>(null);
  const [activeComments, setActiveComments] = useState<string | null>(null);

  const topic = topics.find(t => t.id === params?.id);

  if (!topic) return <div>Topic not found</div>;
  if (!currentUser) return <div>Please login</div>;

  const getStatus = (subtopicId: string) => {
    const p = progress.find(p => p.userId === currentUser.id && p.subtopicId === subtopicId);
    return p?.status || 'not_addressed';
  };

  const statusColors: Record<ProgressStatus, string> = {
    not_addressed: 'text-slate-400',
    basic: 'text-yellow-500',
    good: 'text-blue-500',
    fully_understood: 'text-green-500',
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <Button 
          variant="ghost" 
          className="gap-2 pl-0 hover:pl-2 transition-all text-black hover:text-black/80" 
          onClick={() => setLocation('/')}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Modules
        </Button>

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            {/* Icon placeholder - ideally dynamic */}
            <div className="text-2xl">📚</div> 
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">{topic.title}</h1>
            <p className="text-black font-medium">{topic.subtopics.length} Subtopics</p>
          </div>
        </div>

        <div className="grid gap-6">
          {topic.subtopics.map((subtopic) => (
            <Card key={subtopic.id} className="border-l-4 border-l-transparent hover:border-l-secondary transition-all duration-300 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-xl font-semibold">{subtopic.title}</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => setActiveResource(subtopic.id)}
                      >
                        <BookOpen className="w-4 h-4" /> Resources
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => setActiveComments(subtopic.id)}
                      >
                        <MessageSquare className="w-4 h-4" /> Notes & Comments ({subtopic.comments.length})
                      </Button>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex flex-col gap-2 min-w-[200px]">
                    <span className="text-sm font-medium text-muted-foreground">My Understanding</span>
                    <Select 
                      value={getStatus(subtopic.id)} 
                      onValueChange={(val) => updateProgress(subtopic.id, val as ProgressStatus)}
                    >
                      <SelectTrigger className={cn("w-full transition-colors", statusColors[getStatus(subtopic.id)])}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_addressed">Not Addressed</SelectItem>
                        <SelectItem value="basic">Basic Understanding</SelectItem>
                        <SelectItem value="good">Good Understanding</SelectItem>
                        <SelectItem value="fully_understood">Fully Understood</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resource Modal */}
        {activeResource && (
          <Notepad 
            title={topic.subtopics.find(s => s.id === activeResource)?.title || ''}
            content={topic.subtopics.find(s => s.id === activeResource)?.resources}
            mode="read"
            onClose={() => setActiveResource(null)}
          />
        )}

        {/* Comment Modal */}
        {activeComments && (
          <Notepad 
            title={topic.subtopics.find(s => s.id === activeComments)?.title || ''}
            mode="write"
            onClose={() => setActiveComments(null)}
            onSubmit={(text) => {
              addComment(activeComments, { userId: currentUser.id, text });
              setActiveComments(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
}
