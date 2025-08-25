import { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { TaskList } from "./components/TaskList";
import { TaskModal } from "./components/TaskModal";
import { taskService } from "./services/taskService";
import type { Task, TaskFormData } from "./types";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getAllTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks. Please check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = async (taskData: TaskFormData) => {
    try {
      if (editingTask) {
        // Update existing task
        const updatedTask = await taskService.updateTask(editingTask.id, taskData);
        setTasks(prev => prev.map(task => 
          task.id === editingTask.id ? updatedTask : task
        ));
        toast.success('Task updated successfully!');
      } else {
        // Create new task
        const newTask = await taskService.createTask(taskData);
        setTasks(prev => [newTask, ...prev]);
        toast.success('Task created successfully!');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task. Please try again.');
      throw error; // Re-throw to let modal handle the error
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      const updatedTask = await taskService.toggleTaskCompletion(id, completed);
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
      toast.success(completed ? 'Task completed!' : 'Task marked as pending!');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task status. Please try again.');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Task Manager
          </h1>
          <p className="text-muted-foreground">
            A complete CRUD application built with React, TypeScript, Tailwind CSS, and Supabase
          </p>
        </div>

        <TaskList
          tasks={tasks}
          loading={loading}
          onToggleComplete={handleToggleComplete}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onCreateTask={handleCreateTask}
        />

        <TaskModal
          task={editingTask}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSave={handleSaveTask}
        />

        {/* Instructions for setting up Supabase */}
        {tasks.length === 0 && !loading && (
          <div className="mt-8 p-6 bg-muted/50 rounded-lg border-2 border-dashed">
            <h3 className="text-lg font-semibold mb-3">Setup Instructions</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>1. Create a Supabase project:</strong> Visit <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">supabase.com</a> and create a new project</p>
              <p><strong>2. Create the tasks table:</strong> Run this SQL in your Supabase SQL editor:</p>
              <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
{`CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
              </pre>
              <p><strong>3. Set environment variables:</strong> Create a <code>.env</code> file with:</p>
              <pre className="bg-muted p-2 rounded text-xs">
{`VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`}
              </pre>
              <p><strong>4. Enable Row Level Security (optional):</strong> Configure RLS policies in your Supabase dashboard</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
