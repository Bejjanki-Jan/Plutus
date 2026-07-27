import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'

// Lazy load page components
const Home = lazy(() => import('../pages/Home/Home'))
const Insights = lazy(() => import('../pages/Insights/Insights'))
const Savings = lazy(() => import('../pages/Savings/Savings'))
const BluePrints = lazy(() => import('../pages/BluePrints/BluePrints'))
const Profile = lazy(() => import('../pages/Profile/Profile'))
const GeneralDetailsPage = lazy(() => import('../pages/Profile/GeneralDetailsPage'))
const AccountDetailsPage = lazy(() => import('../pages/Profile/AccountDetailsPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'insights',
        element: <Insights />,
      },
      {
        path: 'savings',
        element: <Savings />,
      },
      {
        path: 'blueprints',
        element: <BluePrints />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'profile/general',
        element: <GeneralDetailsPage />,
      },
      {
        path: 'profile/account',
        element: <AccountDetailsPage />,
      },
    ],
  },
])
