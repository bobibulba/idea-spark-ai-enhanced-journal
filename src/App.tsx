import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import EntriesPage from './pages/EntriesPage';
import EntryDetailPage from './pages/EntryDetailPage';
import SettingsPage from './pages/SettingsPage';
import useStore from './store';
import { scheduleNotification } from './utils';

function App() {
  const { user } = useStore();
  
  useEffect(() => {
    // Schedule notification based on user preferences
    if (user.notificationsEnabled) {
      scheduleNotification(user.notificationTime);
    }
  }, [user.notificationsEnabled, user.notificationTime]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="entries" element={<EntriesPage />} />
          <Route path="entry/:id" element={<EntryDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
