import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private topics: Map<string, Topic>;
  private progress: Map<string, UserProgress[]>;
  private users: Map<string, User>;

  constructor() {
    this.topics = new Map();
    this.progress = new Map();
    this.users = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockTopics: Topic[] = [
      {
        id: 't1',
        title: 'Safety First',
        icon: 'ShieldCheck',
        subtopics: [
          { id: 'st1', title: 'Emergency Procedures', resources: '# Emergency Procedures\n\nIn case of emergency...', comments: [] },
          { id: 'st2', title: 'PPE Guidelines', resources: '# Personal Protective Equipment\n\nAlways wear...', comments: [] },
        ]
      },
      {
        id: 't2',
        title: 'Ocean Navigation',
        icon: 'Compass',
        subtopics: [
          { id: 'st3', title: 'Chart Reading', resources: '# Reading Charts\n\nKey symbols include...', comments: [] },
        ]
      },
      {
        id: 't3',
        title: 'Equipment Ops',
        icon: 'Wrench',
        subtopics: [
          { id: 'st4', title: 'ROV Maintenance', resources: '# ROV Maintenance Checklist\n\n1. Check seals...', comments: [] },
        ]
      },
      {
        id: 't4',
        title: 'Data Analysis',
        icon: 'BarChart3',
        subtopics: [
          { id: 'st5', title: 'Sonar Interpretation', resources: '# Sonar Data\n\nHow to read sonar...', comments: [] },
        ]
      },
      {
        id: 't5',
        title: 'Communication',
        icon: 'Radio',
        subtopics: [
          { id: 'st6', title: 'Radio Protocols', resources: '# Radio Etiquette\n\nOver and out.', comments: [] },
        ]
      },
      {
        id: 't6',
        title: 'Environmental',
        icon: 'Leaf',
        subtopics: [
          { id: 'st7', title: 'Marine Life Protection', resources: '# Protecting Marine Life\n\nGuidelines...', comments: [] },
        ]
      },
      {
        id: 't7',
        title: 'Vessel Maintenance',
        icon: 'Ship',
        subtopics: [
          { id: 'st8', title: 'Engine Checks', resources: '# Engine Maintenance\n\nDaily checks...', comments: [] },
          { id: 'st9', title: 'Hull Inspection', resources: '# Hull Integrity\n\nRegular inspection...', comments: [] },
        ]
      },
      {
        id: 't8',
        title: 'Weather Systems',
        icon: 'Wind',
        subtopics: [
          { id: 'st10', title: 'Storm Recognition', resources: '# Storm Systems\n\nIdentifying threats...', comments: [] },
        ]
      },
      {
        id: 't9',
        title: 'Advanced Navigation',
        icon: 'Navigation',
        subtopics: [
          { id: 'st11', title: 'GPS Systems', resources: '# GPS Navigation\n\nUsing modern GPS...', comments: [] },
          { id: 'st12', title: 'Route Planning', resources: '# Route Optimization\n\nPlanning routes...', comments: [] },
        ]
      },
      {
        id: 't10',
        title: 'Sonar Operations',
        icon: 'Radar',
        subtopics: [
          { id: 'st13', title: 'Equipment Setup', resources: '# Sonar Setup\n\nInitial configuration...', comments: [] },
        ]
      },
      {
        id: 't11',
        title: 'Weather Forecasting',
        icon: 'CloudRain',
        subtopics: [
          { id: 'st14', title: 'Reading Charts', resources: '# Weather Charts\n\nInterpreting data...', comments: [] },
          { id: 'st15', title: 'Predictions', resources: '# Forecasting\n\nMaking predictions...', comments: [] },
        ]
      },
      {
        id: 't12',
        title: 'Cargo Operations',
        icon: 'Box',
        subtopics: [
          { id: 'st16', title: 'Loading Procedures', resources: '# Cargo Loading\n\nSafe loading...', comments: [] },
        ]
      },
      {
        id: 't13',
        title: 'Emergency Response',
        icon: 'AlertTriangle',
        subtopics: [
          { id: 'st17', title: 'First Aid', resources: '# First Aid\n\nBasic first aid...', comments: [] },
          { id: 'st18', title: 'Crisis Management', resources: '# Crisis Response\n\nHandling emergencies...', comments: [] },
        ]
      },
      {
        id: 't14',
        title: 'Team Coordination',
        icon: 'Users',
        subtopics: [
          { id: 'st19', title: 'Communication Protocols', resources: '# Team Communication\n\nBest practices...', comments: [] },
        ]
      },
      {
        id: 't15',
        title: 'Quality Standards',
        icon: 'CheckCircle',
        subtopics: [
          { id: 'st20', title: 'Inspection Guidelines', resources: '# Quality Assurance\n\nStandard procedures...', comments: [] },
        ]
      },
      {
        id: 't16',
        title: 'Advanced Training',
        icon: 'BookOpen',
        subtopics: [
          { id: 'st21', title: 'Specialized Skills', resources: '# Advanced Techniques\n\nMastering skills...', comments: [] },
        ]
      },
    ];

    mockTopics.forEach(topic => this.topics.set(topic.id, topic));

    const mockUsers: User[] = [
      { id: 'u1', name: 'Admin User', email: 'admin@oceaninfinity.com', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
      { id: 'u2', name: 'Sarah Connor', email: 'sarah@oceaninfinity.com', role: 'employee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
      { id: 'u3', name: 'John Smith', email: 'john@oceaninfinity.com', role: 'employee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    ];

    mockUsers.forEach(user => this.users.set(user.id, user));
  }

  async getTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values());
  }

  async saveTopic(topic: Topic): Promise<void> {
    const topicWithId = { ...topic, id: topic.id || randomUUID() };
    this.topics.set(topicWithId.id, topicWithId);
  }

  async updateTopic(topic: Topic): Promise<void> {
    this.topics.set(topic.id, topic);
  }

  async deleteTopic(topicId: string): Promise<void> {
    const topic = this.topics.get(topicId);
    if (topic) {
      this.topics.set(topicId, { ...topic, isDeleted: true });
    }
  }

  async restoreTopic(topicId: string): Promise<void> {
    const topic = this.topics.get(topicId);
    if (topic) {
      this.topics.set(topicId, { ...topic, isDeleted: false });
    }
  }

  async addComment(subtopicId: string, comment: Comment): Promise<void> {
    for (const topic of this.topics.values()) {
      const subtopic = topic.subtopics.find(st => st.id === subtopicId);
      if (subtopic) {
        subtopic.comments.push(comment);
        return;
      }
    }
  }

  async getProgress(userId: string): Promise<UserProgress[]> {
    return this.progress.get(userId) || [];
  }

  async saveProgress(progress: UserProgress): Promise<void> {
    const userProgress = this.progress.get(progress.userId) || [];
    const index = userProgress.findIndex(p => p.subtopicId === progress.subtopicId);
    if (index >= 0) {
      userProgress[index] = progress;
    } else {
      userProgress.push(progress);
    }
    this.progress.set(progress.userId, userProgress);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === username);
  }

  async createUser(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }
}

export const storage = new MemStorage();
