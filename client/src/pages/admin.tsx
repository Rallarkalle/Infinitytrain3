import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { useTraining, Topic, Subtopic } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function AdminDashboard() {
  const { topics, users, progress, addTopic, updateTopic } = useTraining();
  
  // Dialogs & State
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedModuleForDetail, setSelectedModuleForDetail] = useState<Topic | null>(null);
  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<string | null>(null);
  const [isEmployeeDetailOpen, setIsEmployeeDetailOpen] = useState(false);
  const [selectedEmployeeForOverview, setSelectedEmployeeForOverview] = useState<any>(null);

  const activeTopics = topics.filter(t => !t.isDeleted);
  const employees = users.filter(u => u.role === 'employee');

  // Calculate progress for a specific module across all employees (OVERALL progress)
  const getModuleProgressStats = (topicId: string) => {
    const topic = activeTopics.find(t => t.id === topicId);
    if (!topic || !topic.subtopics.length) return { overallPercentage: 0, details: [] };

    const subtopicIds = topic.subtopics.map(s => s.id);
    const employeeStats = employees.map(emp => {
      const empProgress = progress.filter(p => p.userId === emp.id && subtopicIds.includes(p.subtopicId));
      const completed = empProgress.filter(p => p.status === 'fully_understood').length;
      const percentage = Math.round((completed / topic.subtopics.length) * 100);
      return { userId: emp.id, userName: emp.name, percentage, avatar: emp.avatar };
    });

    // Overall progress = total fully understood / (total subtopics * total employees)
    const totalPossible = topic.subtopics.length * employees.length;
    const totalFullyUnderstood = employees.reduce((sum, emp) => {
      const empProgress = progress.filter(p => p.userId === emp.id && subtopicIds.includes(p.subtopicId));
      return sum + empProgress.filter(p => p.status === 'fully_understood').length;
    }, 0);

    const overallPercentage = totalPossible > 0 ? Math.round((totalFullyUnderstood / totalPossible) * 100) : 0;

    return { overallPercentage, details: employeeStats };
  };

  // Get detailed progress for an employee in a specific module
  const getEmployeeModuleDetail = (userId: string, topicId: string) => {
    const topic = activeTopics.find(t => t.id === topicId);
    if (!topic) return [];

    return topic.subtopics.map(subtopic => {
      const prog = progress.find(p => p.userId === userId && p.subtopicId === subtopic.id);
      return {
        id: subtopic.id,
        title: subtopic.title,
        status: prog?.status || 'not_addressed'
      };
    });
  };

  const handleAddModule = () => {
    if (!newModuleTitle.trim()) return;
    addTopic({
      title: newModuleTitle,
      icon: newModuleIcon,
      subtopics: []
    });
    setNewModuleTitle('');
    setNewModuleIcon('HelpCircle');
  const getStatusColor = (status: string) => {
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTopics.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Learners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(progress.map(p => p.userId)).size}</div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Modules Management</CardTitle>
            <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-black hover:bg-[#7acc00] text-white">
                  <Plus className="w-4 h-4" /> Add Module
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white text-black border-none shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-black">Add New Module</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="module-title" className="text-right text-black">Title</Label>
                    <Input 
                      id="module-title" 
                      value={newModuleTitle} 
                      onChange={(e) => setNewModuleTitle(e.target.value)} 
                      className="col-span-3 bg-white text-black border-gray-200" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="module-icon" className="text-right text-black">Icon</Label>
                    <Select value={newModuleIcon} onValueChange={setNewModuleIcon}>
                      <SelectTrigger className="col-span-3 bg-white text-black border-gray-200">
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent className="h-64 bg-white text-black border-gray-200">
                        {[
                          'Anchor', 'Ship', 'Navigation', 'Compass', 'Map', 'MapPin', 'Globe', 'Waves', 'Wind', 'CloudRain', 
        {/* Modules Management */}
        <Card>
          <CardHeader>
            <CardTitle>Modules Overview</CardTitle>
          </CardHeader>       onClick={() => setSelectedModuleForSubtopic(topic.id)}
                            >
                              <Plus className="w-4 h-4 mr-1" /> Subtopic
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white text-black border-none shadow-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-black">Add Subtopic to {topic.title}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="subtopic-title" className="text-right text-black">Title</Label>
                                <Input 
                                  id="subtopic-title" 
                                  value={newSubtopicTitle} 
                                  onChange={(e) => setNewSubtopicTitle(e.target.value)} 
                                  className="col-span-3 bg-white text-black border-gray-200" 
                                  placeholder="Subtopic Title"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button onClick={handleAddSubtopic} className="bg-black text-white hover:bg-[#7acc00]">Add Subtopic</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {/* Employee Progress in this Module */}
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-sm font-medium text-black mb-2">Employee Progress:</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {details.map((emp) => (
                          <Dialog key={`${topic.id}-${emp.userId}`} open={isDetailOpen && selectedModuleForDetail?.id === topic.id && selectedEmployeeForDetail === emp.userId} onOpenChange={(open) => {
                            if (open) {
                              setSelectedModuleForDetail(topic);
                              setSelectedEmployeeForDetail(emp.userId);
                            } else {
                              setSelectedEmployeeForDetail(null);
                            }
                            setIsDetailOpen(open);
                          }}>
                            <DialogTrigger asChild>
                              <button className="w-full flex items-center justify-between p-2 hover:bg-white rounded transition-colors cursor-pointer text-left">
                                <div className="flex items-center gap-2">
                                  <img src={emp.avatar} className="h-6 w-6 rounded-full" alt="" />
                                  <span className="text-sm font-medium text-black">{emp.userName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-primary">{emp.percentage}%</span>
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                </div>
                              </button>
                            </DialogTrigger>
                            <DialogContent className="bg-white text-black border-none shadow-2xl max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-black flex items-center gap-2">
                                  <img src={emp.avatar} className="h-6 w-6 rounded-full" alt="" />
                                  {emp.userName} - {topic.title}
                                </DialogTitle>
                              </DialogHeader>
                              <ScrollArea className="h-96">
                                <div className="space-y-3 pr-4">
                                  {getEmployeeModuleDetail(emp.userId, topic.id).map((detail) => (
                                    <div key={detail.id} className="border rounded p-3">
                                      <p className="font-medium text-black mb-2">{detail.title}</p>
                                      <Badge className={getStatusColor(detail.status)}>
                                        {detail.status.replace(/_/g, ' ').charAt(0).toUpperCase() + detail.status.slice(1).replace(/_/g, ' ')}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
