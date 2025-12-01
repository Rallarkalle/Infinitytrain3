import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  avatar: string;
}

export interface Comment {
  id: string;
  userId: string;
  text?: string;
  imageUrl?: string;
  drawingUrl?: string;
  timestamp: Date;
}

export interface Subtopic {
  id: string;
  title: string;
  resources: string;
  comments: Comment[];
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  subtopics: Subtopic[];
  isDeleted?: boolean;
}

export interface UserProgress {
  userId: string;
  subtopicId: string;
  status: 'not_addressed' | 'basic' | 'good' | 'fully_understood';
}

export interface IStorage {
  getTopics(): Promise<Topic[]>;
  saveTopic(topic: Topic): Promise<void>;
  updateTopic(topic: Topic): Promise<void>;
  deleteTopic(topicId: string): Promise<void>;
  restoreTopic(topicId: string): Promise<void>;
  addComment(subtopicId: string, comment: Comment): Promise<void>;
  getProgress(userId: string): Promise<UserProgress[]>;
  saveProgress(progress: UserProgress): Promise<void>;
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: User): Promise<User>;
  initialize(): Promise<void>;
}

export class SupabaseStorage implements IStorage {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async initialize(): Promise<void> {
    // Check if tables exist and create them if needed
    const { data: users } = await this.supabase.from('users').select('id').limit(1);
    
    // If no users exist, initialize with mock data
    if (!users || users.length === 0) {
      await this.initializeMockData();
    }
  }

  private async initializeMockData() {
    const mockUsers = [
      { id: 'u1', name: 'Admin User', email: 'admin@oceaninfinity.com', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
      { id: 'u2', name: 'Sarah Connor', email: 'sarah@oceaninfinity.com', role: 'employee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
      { id: 'u3', name: 'John Smith', email: 'john@oceaninfinity.com', role: 'employee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    ];

    await this.supabase.from('users').insert(mockUsers);

    const mockTopics = [
      {
        id: 't1',
        title: 'Safety First',
        icon: 'ShieldCheck',
        isDeleted: false
      },
      {
        id: 't2',
        title: 'Ocean Navigation',
        icon: 'Compass',
        isDeleted: false
      },
      {
        id: 't3',
        title: 'Equipment Ops',
        icon: 'Wrench',
        isDeleted: false
      },
      {
        id: 't4',
        title: 'Data Analysis',
        icon: 'BarChart3',
        isDeleted: false
      },
      {
        id: 't5',
        title: 'Communication',
        icon: 'Radio',
        isDeleted: false
      },
      {
        id: 't6',
        title: 'Environmental',
        icon: 'Leaf',
        isDeleted: false
      },
      {
        id: 't7',
        title: 'Vessel Maintenance',
        icon: 'Ship',
        isDeleted: false
      },
      {
        id: 't8',
        title: 'Weather Systems',
        icon: 'Wind',
        isDeleted: false
      },
    ];

    await this.supabase.from('topics').insert(mockTopics);

    const mockSubtopics = [
      { id: 'st1', topic_id: 't1', title: 'Emergency Procedures', resources: '# Emergency Procedures\n\nIn case of emergency...' },
      { id: 'st2', topic_id: 't1', title: 'PPE Guidelines', resources: '# Personal Protective Equipment\n\nAlways wear...' },
      { id: 'st3', topic_id: 't2', title: 'Chart Reading', resources: '# Reading Charts\n\nKey symbols include...' },
      { id: 'st4', topic_id: 't3', title: 'ROV Maintenance', resources: '# ROV Maintenance Checklist\n\n1. Check seals...' },
      { id: 'st5', topic_id: 't4', title: 'Sonar Interpretation', resources: '# Sonar Data\n\nHow to read sonar...' },
      { id: 'st6', topic_id: 't5', title: 'Radio Protocols', resources: '# Radio Etiquette\n\nOver and out.' },
      { id: 'st7', topic_id: 't6', title: 'Marine Life Protection', resources: '# Protecting Marine Life\n\nGuidelines...' },
      { id: 'st8', topic_id: 't7', title: 'Engine Checks', resources: '# Engine Maintenance\n\nDaily checks...' },
      { id: 'st9', topic_id: 't7', title: 'Hull Inspection', resources: '# Hull Integrity\n\nRegular inspection...' },
      { id: 'st10', topic_id: 't8', title: 'Storm Recognition', resources: '# Storm Systems\n\nIdentifying threats...' },
    ];

    await this.supabase.from('subtopics').insert(mockSubtopics);
  }

  async getTopics(): Promise<Topic[]> {
    const { data: topics, error } = await this.supabase
      .from('topics')
      .select('*')
      .order('id');

    if (error) throw error;

    const result: Topic[] = [];
    for (const topic of topics || []) {
      const { data: subtopics } = await this.supabase
        .from('subtopics')
        .select('*')
        .eq('topic_id', topic.id);

      const subtopicsWithComments: Subtopic[] = [];
      for (const subtopic of subtopics || []) {
        const { data: comments } = await this.supabase
          .from('comments')
          .select('*')
          .eq('subtopic_id', subtopic.id)
          .order('timestamp', { ascending: false });

        subtopicsWithComments.push({
          id: subtopic.id,
          title: subtopic.title,
          resources: subtopic.resources,
          comments: (comments || []).map(c => ({
            ...c,
            userId: c.user_id,
            imageUrl: c.image_url,
            drawingUrl: c.drawing_url,
            timestamp: new Date(c.timestamp)
          }))
        });
      }

      result.push({
        id: topic.id,
        title: topic.title,
        icon: topic.icon,
        subtopics: subtopicsWithComments,
        isDeleted: topic.is_deleted || false
      });
    }

    return result;
  }

  async saveTopic(topic: Topic): Promise<void> {
    const topicId = topic.id || randomUUID();
    
    await this.supabase
      .from('topics')
      .upsert({
        id: topicId,
        title: topic.title,
        icon: topic.icon,
        is_deleted: topic.isDeleted || false
      });

    // Delete existing subtopics
    await this.supabase
      .from('subtopics')
      .delete()
      .eq('topic_id', topicId);

    // Insert new subtopics
    for (const subtopic of topic.subtopics) {
      const subtopicId = subtopic.id || randomUUID();
      await this.supabase
        .from('subtopics')
        .insert({
          id: subtopicId,
          topic_id: topicId,
          title: subtopic.title,
          resources: subtopic.resources
        });

      // Insert comments
      for (const comment of subtopic.comments) {
        await this.supabase
          .from('comments')
          .insert({
            id: comment.id,
            subtopic_id: subtopicId,
            user_id: comment.userId,
            text: comment.text,
            image_url: comment.imageUrl,
            drawing_url: comment.drawingUrl,
            timestamp: comment.timestamp.toISOString()
          });
      }
    }
  }

  async updateTopic(topic: Topic): Promise<void> {
    await this.saveTopic(topic);
  }

  async deleteTopic(topicId: string): Promise<void> {
    await this.supabase
      .from('topics')
      .update({ is_deleted: true })
      .eq('id', topicId);
  }

  async restoreTopic(topicId: string): Promise<void> {
    await this.supabase
      .from('topics')
      .update({ is_deleted: false })
      .eq('id', topicId);
  }

  async addComment(subtopicId: string, comment: Comment): Promise<void> {
    await this.supabase
      .from('comments')
      .insert({
        id: comment.id,
        subtopic_id: subtopicId,
        user_id: comment.userId,
        text: comment.text,
        image_url: comment.imageUrl,
        drawing_url: comment.drawingUrl,
        timestamp: comment.timestamp.toISOString()
      });
  }

  async getProgress(userId: string): Promise<UserProgress[]> {
    const { data, error } = await this.supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    return (data || []).map(row => ({
      userId: row.user_id,
      subtopicId: row.subtopic_id,
      status: row.status
    }));
  }

  async saveProgress(progress: UserProgress): Promise<void> {
    await this.supabase
      .from('progress')
      .upsert({
        user_id: progress.userId,
        subtopic_id: progress.subtopicId,
        status: progress.status
      });
  }

  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', username)
      .single();

    if (error) return undefined;
    return data as User;
  }

  async createUser(user: User): Promise<User> {
    await this.supabase
      .from('users')
      .insert(user);
    return user;
  }
}
