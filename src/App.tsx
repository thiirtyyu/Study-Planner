import React, { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { LectureSummarizer } from './components/LectureSummarizer';
import { GroupWorkAllocator } from './components/GroupWorkAllocator';
import { PitchDeckView } from './components/PitchDeckView';
import { PricingModal } from './components/PricingModal';
import { UploadModal } from './components/UploadModal';

import { MOCK_SUBJECTS, MOCK_MATERIALS } from './data/mockData';
import { Subject, LectureMaterial, GroupProject, GroupTask } from './types';
import { getSession, logoutUser, UserSession } from './utils/authStore';
import { 
  getAllGroups, 
  getActiveGroupId, 
  setActiveGroupId, 
  createNewGroup, 
  joinGroupByCode, 
  addTaskToGroup, 
  updateTaskStatusInGroup, 
  recordTaskReminder 
} from './utils/groupStore';
import { Heart } from 'lucide-react';

export function App() {
  // Persistent Auth State
  const [session, setSession] = useState<UserSession | null>(() => getSession());

  // Navigation Tab
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'summarizer' | 'groupwork' | 'pitch'>('dashboard');
  
  // Study Subjects & Summaries
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [materials, setMaterials] = useState<Record<string, LectureMaterial>>(MOCK_MATERIALS);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sub-1');

  // Groups State from Store
  const [allGroups, setAllGroups] = useState<GroupProject[]>(() => getAllGroups());
  const [activeGroupId, setActiveId] = useState<string>(() => getActiveGroupId());

  // Current Active Group
  const activeGroup: GroupProject = allGroups.find(g => g.id === activeGroupId) || allGroups[0];

  // Modals
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Quick Nudge Action Target from Dashboard
  const [activeNudgeTarget, setActiveNudgeTarget] = useState<{ memberName: string; taskTitle: string } | null>(null);

  // Sync groups across tabs / events
  useEffect(() => {
    const handleGroupsUpdate = () => {
      const updated = getAllGroups();
      setAllGroups(updated);
      const currentActive = getActiveGroupId();
      setActiveId(currentActive);
    };

    window.addEventListener('unisync_groups_updated', handleGroupsUpdate);
    window.addEventListener('storage', handleGroupsUpdate);
    return () => {
      window.removeEventListener('unisync_groups_updated', handleGroupsUpdate);
      window.removeEventListener('storage', handleGroupsUpdate);
    };
  }, []);

  // Logout handler
  const handleLogout = () => {
    logoutUser();
    setSession(null);
  };

  // Group Management Handlers
  const handleSelectGroup = (groupId: string) => {
    setActiveGroupId(groupId);
    setActiveId(groupId);
  };

  const handleCreateGroup = (data: { title: string; subjectCode: string; description?: string; deadline?: string }) => {
    if (!session) return;
    const newGroup = createNewGroup(data, session);
    const updated = getAllGroups();
    setAllGroups(updated);
    setActiveId(newGroup.id);
  };

  const handleJoinGroup = (code: string) => {
    if (!session) return { ok: false, error: 'กรุณาเข้าสู่ระบบก่อน' };
    const result = joinGroupByCode(code, session);
    if (result.ok && result.group) {
      const updated = getAllGroups();
      setAllGroups(updated);
      setActiveId(result.group.id);
    }
    return result;
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: GroupTask['status']) => {
    const updatedGroup = updateTaskStatusInGroup(activeGroupId, taskId, newStatus);
    if (updatedGroup) {
      setAllGroups(getAllGroups());
    }
  };

  const handleAddTask = (newTaskData: Omit<GroupTask, 'id'>) => {
    const updatedGroup = addTaskToGroup(activeGroupId, newTaskData);
    if (updatedGroup) {
      setAllGroups(getAllGroups());
    }
  };

  const handleRecordReminder = (taskId: string) => {
    const updatedGroup = recordTaskReminder(activeGroupId, taskId);
    if (updatedGroup) {
      setAllGroups(getAllGroups());
    }
  };

  // Quick Nudge from Dashboard
  const handleTriggerQuickNudge = (memberName: string, taskTitle: string) => {
    setActiveNudgeTarget({ memberName, taskTitle });
    setCurrentTab('groupwork');
  };

  // Subject Selection
  const handleSelectSubject = (id: string) => {
    setSelectedSubjectId(id);
    setCurrentTab('summarizer');
  };

  // Real File Upload Success
  const handleRealUploadSuccess = (newSubject: Subject, newMaterial: LectureMaterial) => {
    setSubjects(prev => [newSubject, ...prev]);
    setMaterials(prev => ({
      ...prev,
      [newSubject.id]: newMaterial
    }));
    setSelectedSubjectId(newSubject.id);
    setCurrentTab('summarizer');
  };

  // If not logged in, render AuthPage (persistent session ensures returning users skip this)
  if (!session) {
    return <AuthPage onLogin={(s) => setSession(s)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-800 font-sans selection:bg-brand-100 selection:text-brand-900">
      
      {/* 🧭 Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenPricing={() => setIsPricingOpen(true)}
        daysToFinal={5}
        session={session}
        onLogout={handleLogout}
        onSessionChange={(s) => setSession(s)}
      />

      {/* 🌟 Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {currentTab === 'dashboard' && (
          <StudentDashboard
            subjects={subjects}
            groupProject={activeGroup}
            onSelectSubject={handleSelectSubject}
            onNavigateToGroup={() => setCurrentTab('groupwork')}
            onNavigateToSummarizer={() => setCurrentTab('summarizer')}
            onTriggerQuickNudge={handleTriggerQuickNudge}
          />
        )}

        {currentTab === 'summarizer' && (
          <LectureSummarizer
            subjects={subjects}
            materials={materials}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={setSelectedSubjectId}
            onOpenUploadModal={() => setIsUploadOpen(true)}
          />
        )}

        {currentTab === 'groupwork' && (
          <GroupWorkAllocator
            project={activeGroup}
            allGroups={allGroups}
            currentSession={session}
            onSelectGroup={handleSelectGroup}
            onCreateGroup={handleCreateGroup}
            onJoinGroup={handleJoinGroup}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onAddTask={handleAddTask}
            onRecordReminder={handleRecordReminder}
            activeNudgeTarget={activeNudgeTarget}
            onClearNudgeTarget={() => setActiveNudgeTarget(null)}
          />
        )}

        {currentTab === 'pitch' && (
          <PitchDeckView />
        )}

      </main>

      {/* 🦶 Footer */}
      <footer className="border-t border-stone-200/80 bg-white/60 py-8 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800">UniSync AI</span>
              <span>• แพลตฟอร์มเพื่อนคู่คิดช่วงสอบสำหรับนักศึกษายุคใหม่</span>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentTab('pitch')}
                className="hover:text-brand-600 transition-colors font-medium underline underline-offset-2"
              >
                ดูสรุป AI Pitch Requirement
              </button>
              <button 
                onClick={() => setIsPricingOpen(true)}
                className="hover:text-brand-600 transition-colors font-medium"
              >
                ราคา Pro 99฿/ด.
              </button>
              <span className="text-stone-300">|</span>
              <span className="flex items-center">
                ออกแบบด้วยความเข้าใจนักศึกษาไทย <Heart className="w-3 h-3 text-rose-500 ml-1 inline" />
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* 🪟 Modals */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleRealUploadSuccess}
      />

    </div>
  );
}

export default App;
