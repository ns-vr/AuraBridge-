/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { OnboardingFlow } from './components/OnboardingFlow';
import { DashboardHome } from './components/DashboardHome';
import { UnderstandFlow } from './components/UnderstandFlow';
import { CommunicateFlow } from './components/CommunicateFlow';
import { AdaptiveDemo } from './components/AdaptiveDemo';
import { ActionsFlow } from './components/ActionsFlow';
import { ProfileView } from './components/ProfileView';
import { ExplainabilityModal } from './components/ExplainabilityModal';
import {
  UserProfile,
  ExplainabilityTarget,
  ActionChecklistItem,
  DEFAULT_USER_PROFILE,
  DEFAULT_CHECKLIST_ITEMS,
} from './types';
import { SAMPLE_DOCUMENTS } from './data/samples';
import { speechService } from './utils/speech';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('landing');
  const [explainabilityTarget, setExplainabilityTarget] = useState<ExplainabilityTarget | null>(null);

  // User Profile & Preferences State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('aurabridge_user_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load profile from storage', e);
    }
    return DEFAULT_USER_PROFILE;
  });

  // Action Checklists State
  const [checklists, setChecklists] = useState<ActionChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem('aurabridge_checklists');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load checklists from storage', e);
    }
    return DEFAULT_CHECKLIST_ITEMS;
  });

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem('aurabridge_user_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.warn('Failed to persist profile', e);
    }
  }, [userProfile]);

  // Persist checklists
  useEffect(() => {
    try {
      localStorage.setItem('aurabridge_checklists', JSON.stringify(checklists));
    } catch (e) {
      console.warn('Failed to persist checklists', e);
    }
  }, [checklists]);

  // Handlers for Profile Updates
  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
  };

  const handleResetPreferences = () => {
    setUserProfile(DEFAULT_USER_PROFILE);
    setChecklists(DEFAULT_CHECKLIST_ITEMS);
  };

  const handleToggleAccessibility = (key: keyof UserProfile['accessibility']) => {
    setUserProfile((prev) => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [key]: !prev.accessibility[key],
      },
    }));
  };

  // Handlers for Checklists
  const handleToggleChecklist = (id: string) => {
    setChecklists((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };

  const handleAddChecklist = (item: ActionChecklistItem) => {
    setChecklists((prev) => [item, ...prev]);
  };

  const handleUpdateChecklist = (updated: ActionChecklistItem) => {
    setChecklists((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeleteChecklist = (id: string) => {
    setChecklists((prev) => prev.filter((item) => item.id !== id));
  };

  // Quick Understand from text search
  const handleQuickUnderstandText = (text: string) => {
    setCurrentView('understand');
  };

  // Check Accessibility class modifiers
  const isHighContrast = userProfile.accessibility.highContrast;
  const isLargerText = userProfile.accessibility.largerText;

  return (
    <div
      id="aurabridge-root"
      className={`min-h-screen transition-colors duration-300 ${
        isHighContrast
          ? 'bg-black text-white selection:bg-amber-400 selection:text-black'
          : 'bg-[#FDFBF7] text-[#2D2D2D] selection:bg-[#EAE0D0] selection:text-[#2D2D2D]'
      } ${isLargerText ? 'text-lg' : 'text-base'}`}
    >
      {/* Persistent Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        accessibility={userProfile.accessibility}
        onToggleAccessibility={handleToggleAccessibility}
        userProfile={userProfile}
      />

      {/* Main View Router */}
      <main className="pb-16 pt-2">
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LandingPage
                onStartOnboarding={() => setCurrentView('onboarding')}
                onNavigate={(view) => setCurrentView(view)}
                accessibility={userProfile.accessibility}
                onOpenExplainability={(target) => setExplainabilityTarget(target)}
              />
            </motion.div>
          )}

          {currentView === 'onboarding' && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <OnboardingFlow
                userProfile={userProfile}
                onComplete={(updated) => {
                  setUserProfile(updated);
                  setCurrentView('home');
                }}
                onSkip={() => setCurrentView('home')}
              />
            </motion.div>
          )}

          {(currentView === 'home' || currentView === 'dashboard') && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DashboardHome
                userProfile={userProfile}
                onNavigate={(view) => setCurrentView(view)}
                checklists={checklists}
                onToggleChecklist={handleToggleChecklist}
                onQuickUnderstandText={handleQuickUnderstandText}
                onAddChecklist={handleAddChecklist}
                onUpdateChecklist={handleUpdateChecklist}
                onDeleteChecklist={handleDeleteChecklist}
              />
            </motion.div>
          )}

          {currentView === 'understand' && (
            <motion.div
              key="understand"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <UnderstandFlow
                userProfile={userProfile}
                onOpenExplainability={(target) => setExplainabilityTarget(target)}
                onAddChecklistItem={handleAddChecklist}
                onNavigate={(view) => setCurrentView(view)}
              />
            </motion.div>
          )}

          {currentView === 'communicate' && (
            <motion.div
              key="communicate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CommunicateFlow userProfile={userProfile} />
            </motion.div>
          )}

          {currentView === 'adaptive' && (
            <motion.div
              key="adaptive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdaptiveDemo userProfile={userProfile} />
            </motion.div>
          )}

          {currentView === 'actions' && (
            <motion.div
              key="actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ActionsFlow
                userProfile={userProfile}
                checklists={checklists}
                onToggleChecklist={handleToggleChecklist}
                onAddChecklist={handleAddChecklist}
                onDeleteChecklist={handleDeleteChecklist}
                onNavigate={(view) => setCurrentView(view)}
              />
            </motion.div>
          )}

          {currentView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProfileView
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
                onResetPreferences={handleResetPreferences}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Explainability Modal ("🔎 Show me why") */}
      <ExplainabilityModal
        target={explainabilityTarget}
        onClose={() => setExplainabilityTarget(null)}
        accessibility={userProfile.accessibility}
      />
    </div>
  );
}
