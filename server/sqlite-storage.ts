import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  initialize?(): Promise<void>;
}

export class SQLiteStorage implements IStorage {
  private db: Database.Database;

  constructor(dbPath?: string) {
    // For local development, use current directory
    const defaultPath = path.join(process.cwd(), 'training.db');
    
    const finalPath = dbPath || defaultPath;
    
    // Ensure directory exists
    const dbDir = dirname(finalPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.db = new Database(finalPath);
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Create tables
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL,
        avatar TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS topics (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        icon TEXT NOT NULL,
        isDeleted INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS subtopics (
        id TEXT PRIMARY KEY,
        topicId TEXT NOT NULL,
        title TEXT NOT NULL,
        resources TEXT NOT NULL,
        FOREIGN KEY (topicId) REFERENCES topics(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        subtopicId TEXT NOT NULL,
        userId TEXT NOT NULL,
        text TEXT,
        imageUrl TEXT,
        drawingUrl TEXT,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (subtopicId) REFERENCES subtopics(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS progress (
        userId TEXT NOT NULL,
        subtopicId TEXT NOT NULL,
        status TEXT NOT NULL,
        PRIMARY KEY (userId, subtopicId),
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (subtopicId) REFERENCES subtopics(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_subtopics_topicId ON subtopics(topicId);
      CREATE INDEX IF NOT EXISTS idx_comments_subtopicId ON comments(subtopicId);
      CREATE INDEX IF NOT EXISTS idx_progress_userId ON progress(userId);
    `);

    // Check if we need to initialize with mock data
    const userCount = this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    
    if (userCount.count === 0) {
      this.initializeMockData();
    }
  }

  private initializeMockData() {
    const insertUser = this.db.prepare(`
      INSERT INTO users (id, name, email, role, avatar) 
      VALUES (?, ?, ?, ?, ?)
    `);

    const mockUsers = [
      { id: 'u1', name: 'Admin', email: 'admin@oceaninfinity.com', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
      { id: 'u2', name: 'May', email: 'may@oceaninfinity.com', role: 'employee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=May' },
      { id: 'u3', name: 'Adam', email: 'adam@oceaninfinity.com', role: 'employee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adam' },
      { id: 'u4', name: 'Chris', email: 'chris@oceaninfinity.com', role: 'employee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris' },
      { id: 'u5', name: 'Arta', email: 'arta@oceaninfinity.com', role: 'employee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arta' },
      { id: 'u6', name: 'Enya', email: 'enya@oceaninfinity.com', role: 'employee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Enya' },
    ];

    mockUsers.forEach(user => {
      insertUser.run(user.id, user.name, user.email, user.role, user.avatar);
    });

    const mockTopics = [
      {
        id: 't1',
        title: 'Safety First',
        icon: 'ShieldCheck',
        subtopics: [
          { id: 'st1', title: 'Emergency Procedures', resources: '# Emergency Procedures\n\nIn case of emergency...' },
          { id: 'st2', title: 'PPE Guidelines', resources: '# Personal Protective Equipment\n\nAlways wear...' },
        ]
      },
      {
        id: 't2',
        title: 'Ocean Navigation',
        icon: 'Compass',
        subtopics: [
          { id: 'st3', title: 'Chart Reading', resources: '# Reading Charts\n\nKey symbols include...' },
        ]
      },
      {
        id: 't3',
        title: 'Equipment Ops',
        icon: 'Wrench',
        subtopics: [
          { id: 'st4', title: 'ROV Maintenance', resources: '# ROV Maintenance Checklist\n\n1. Check seals...' },
        ]
      },
      {
        id: 't4',
        title: 'Data Analysis',
        icon: 'BarChart3',
        subtopics: [
          { id: 'st5', title: 'Sonar Interpretation', resources: '# Sonar Data\n\nHow to read sonar...' },
        ]
      },
      {
        id: 't5',
        title: 'Communication',
        icon: 'Radio',
        subtopics: [
          { id: 'st6', title: 'Radio Protocols', resources: '# Radio Etiquette\n\nOver and out.' },
        ]
      },
      {
        id: 't6',
        title: 'Environmental',
        icon: 'Leaf',
        subtopics: [
          { id: 'st7', title: 'Marine Life Protection', resources: '# Protecting Marine Life\n\nGuidelines...' },
        ]
      },
      {
        id: 't7',
        title: 'Vessel Maintenance',
        icon: 'Ship',
        subtopics: [
          { id: 'st8', title: 'Engine Checks', resources: '# Engine Maintenance\n\nDaily checks...' },
          { id: 'st9', title: 'Hull Inspection', resources: '# Hull Integrity\n\nRegular inspection...' },
        ]
      },
      {
        id: 't8',
        title: 'Weather Systems',
        icon: 'Wind',
        subtopics: [
          { id: 'st10', title: 'Storm Recognition', resources: '# Storm Systems\n\nIdentifying threats...' },
        ]
      },
    ];

    const insertTopic = this.db.prepare(`
      INSERT INTO topics (id, title, icon, isDeleted) 
      VALUES (?, ?, ?, 0)
    `);

    const insertSubtopic = this.db.prepare(`
      INSERT INTO subtopics (id, topicId, title, resources) 
      VALUES (?, ?, ?, ?)
    `);

    mockTopics.forEach(topic => {
      insertTopic.run(topic.id, topic.title, topic.icon);
      topic.subtopics.forEach(subtopic => {
        insertSubtopic.run(subtopic.id, topic.id, subtopic.title, subtopic.resources);
      });
    });
  }

  async getTopics(): Promise<Topic[]> {
    const topics = this.db.prepare('SELECT * FROM topics').all() as any[];
    
    const result: Topic[] = [];
    for (const topic of topics) {
      const subtopics = this.db.prepare(
        'SELECT * FROM subtopics WHERE topicId = ?'
      ).all(topic.id) as any[];

      const subtopicsWithComments: Subtopic[] = [];
      for (const subtopic of subtopics) {
        const comments = this.db.prepare(
          'SELECT * FROM comments WHERE subtopicId = ? ORDER BY timestamp DESC'
        ).all(subtopic.id) as any[];

        subtopicsWithComments.push({
          id: subtopic.id,
          title: subtopic.title,
          resources: subtopic.resources,
          comments: comments.map(c => ({
            ...c,
            timestamp: new Date(c.timestamp)
          }))
        });
      }

      result.push({
        id: topic.id,
        title: topic.title,
        icon: topic.icon,
        subtopics: subtopicsWithComments,
        isDeleted: topic.isDeleted === 1
      });
    }

    return result;
  }

  async saveTopic(topic: Topic): Promise<void> {
    const topicId = topic.id || randomUUID();
    
    this.db.prepare(`
      INSERT OR REPLACE INTO topics (id, title, icon, isDeleted) 
      VALUES (?, ?, ?, ?)
    `).run(topicId, topic.title, topic.icon, topic.isDeleted ? 1 : 0);

    // Delete existing subtopics for this topic
    this.db.prepare('DELETE FROM subtopics WHERE topicId = ?').run(topicId);

    // Insert new subtopics
    const insertSubtopic = this.db.prepare(`
      INSERT INTO subtopics (id, topicId, title, resources) 
      VALUES (?, ?, ?, ?)
    `);

    for (const subtopic of topic.subtopics) {
      const subtopicId = subtopic.id || randomUUID();
      insertSubtopic.run(subtopicId, topicId, subtopic.title, subtopic.resources);

      // Insert comments for this subtopic
      const insertComment = this.db.prepare(`
        INSERT INTO comments (id, subtopicId, userId, text, imageUrl, drawingUrl, timestamp) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const comment of subtopic.comments) {
        insertComment.run(
          comment.id,
          subtopicId,
          comment.userId,
          comment.text || null,
          comment.imageUrl || null,
          comment.drawingUrl || null,
          comment.timestamp.toISOString()
        );
      }
    }
  }

  async updateTopic(topic: Topic): Promise<void> {
    await this.saveTopic(topic);
  }

  async deleteTopic(topicId: string): Promise<void> {
    this.db.prepare('UPDATE topics SET isDeleted = 1 WHERE id = ?').run(topicId);
  }

  async restoreTopic(topicId: string): Promise<void> {
    this.db.prepare('UPDATE topics SET isDeleted = 0 WHERE id = ?').run(topicId);
  }

  async addComment(subtopicId: string, comment: Comment): Promise<void> {
    this.db.prepare(`
      INSERT INTO comments (id, subtopicId, userId, text, imageUrl, drawingUrl, timestamp) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      comment.id,
      subtopicId,
      comment.userId,
      comment.text || null,
      comment.imageUrl || null,
      comment.drawingUrl || null,
      comment.timestamp.toISOString()
    );
  }

  async getProgress(userId: string): Promise<UserProgress[]> {
    const rows = this.db.prepare(
      'SELECT * FROM progress WHERE userId = ?'
    ).all(userId) as any[];

    return rows.map(row => ({
      userId: row.userId,
      subtopicId: row.subtopicId,
      status: row.status
    }));
  }

  async saveProgress(progress: UserProgress): Promise<void> {
    this.db.prepare(`
      INSERT OR REPLACE INTO progress (userId, subtopicId, status) 
      VALUES (?, ?, ?)
    `).run(progress.userId, progress.subtopicId, progress.status);
  }

  async getUser(id: string): Promise<User | undefined> {
    const row = this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
    return row ? {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      avatar: row.avatar
    } : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const row = this.db.prepare('SELECT * FROM users WHERE email = ?').get(username) as any;
    return row ? {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      avatar: row.avatar
    } : undefined;
  }

  async createUser(user: User): Promise<User> {
    this.db.prepare(`
      INSERT INTO users (id, name, email, role, avatar) 
      VALUES (?, ?, ?, ?, ?)
    `).run(user.id, user.name, user.email, user.role, user.avatar);
    return user;
  }

  close() {
    this.db.close();
  }

  async initialize(): Promise<void> {
    // SQLite initialization happens in constructor
    return Promise.resolve();
  }
}

export const storage = new SQLiteStorage();
