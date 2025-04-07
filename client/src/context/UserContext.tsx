import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    console.log('Fetching current user with token...'); 
  
    fetch('http://localhost:5000/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        console.log('Fetched user:', data);
        setUser(data);
      })
      .catch(err => {
        console.error('Failed to fetch user:', err);
        setUser(null);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
