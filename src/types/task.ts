export interface Task {
  description: string;
  priority: number;
  type: 'meeting' | 'email' | 'other';
  status: 'pending' | 'completed' | 'failed';
}