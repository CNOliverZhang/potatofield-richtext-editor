import React from 'react';

import Home from '@/pages/home';
import Settings from '@/pages/settings';
import Editor from '@/pages/editor';

const rootRoute = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/editor',
    element: <Editor />,
  },
];

export default rootRoute;
