import { User } from "@/services/database/migrations/v1/schema_v1";
import React, { createContext, PropsWithChildren, useState } from "react";

interface UserContextType {
  user: User | null;
  setUserData: (user: User | null) => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUserData: async () => {},
});

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const setUserData = async (user: User | null) => {
    setUser(user);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
