import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Edit2, Trash2, Plus } from 'lucide-react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggleComplete: (id: number, completed: boolean) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => Promise<void>;
  onCreateTask: () => void;
}

export function TaskList({ 
  tasks, 
  loading, 
  onToggleComplete, 
  onEditTask, 
  onDeleteTask, 
  onCreateTask 
}: TaskListProps) {
  const [deletingTasks, setDeletingTasks] = useState<Set<number>>(new Set());

  const handleDelete = async (id: number) => {
    setDeletingTasks(prev => new Set(prev).add(id));
    
    try {
      await onDeleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setDeletingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading tasks...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks</CardTitle>
        <Button onClick={onCreateTask} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg mb-2">No tasks found</p>
            <p className="text-sm">Create your first task to get started!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Done</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => 
                        onToggleComplete(task.id, Boolean(checked))
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                      {task.title}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <span className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.description || 'No description'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={task.completed ? 'secondary' : 'default'}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(task.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditTask(task)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(task.id)}
                        disabled={deletingTasks.has(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}