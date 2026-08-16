import { createHashRouter } from 'react-router'
import { App } from './App'
import { AppLayout } from './AppLayout'
import { TodayPage } from './pages/TodayPage'
import { LearnPage } from './pages/LearnPage'
import { PracticePage } from './pages/PracticePage'
import { SongsPage } from './pages/SongsPage'
import { RecordingsPage } from './pages/RecordingsPage'
import { ProgressPage } from './pages/ProgressPage'
import { SettingsPage } from './pages/SettingsPage'
import { TunerPage } from './pages/TunerPage'
import { HandbookPage } from './pages/HandbookPage'

export const router = createHashRouter([
  {
    // App holds the gates: boot, profile, invocation.
    path: '/',
    element: <App />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <TodayPage /> },
          { path: 'learn', element: <LearnPage /> },
          { path: 'handbook', element: <HandbookPage /> },
          { path: 'practice/:lessonId', element: <PracticePage /> },
          { path: 'tuner', element: <TunerPage /> },
          { path: 'songs', element: <SongsPage /> },
          { path: 'recordings', element: <RecordingsPage /> },
          { path: 'progress', element: <ProgressPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])
