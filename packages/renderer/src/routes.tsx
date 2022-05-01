import React from 'react';

import Home from '@/pages/home';
import Settings from '@/pages/settings';

const rootRoute = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
];

export default rootRoute;
