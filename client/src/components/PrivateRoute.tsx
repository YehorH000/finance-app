import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import React, { JSX } from 'react';


export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
