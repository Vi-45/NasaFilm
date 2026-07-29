import { createContext, useContext, useState } from "react";

const CinematicBackdropContext = createContext(null);

export const CinematicBackdropProvider = ({ children }) => {
  const [activeBackdrop, setActiveBackdrop] = useState(null);
  const [activeMovieId, setActiveMovieId] = useState(null);

  return (
    <CinematicBackdropContext.Provider
      value={{
        activeBackdrop,
        setActiveBackdrop,
        activeMovieId,
        setActiveMovieId,
      }}
    >
      {children}
    </CinematicBackdropContext.Provider>
  );
};

export const useCinematicBackdrop = () => {
  const context = useContext(CinematicBackdropContext);
  if (!context) {
    throw new Error(
      "useCinematicBackdrop must be used within a CinematicBackdropProvider"
    );
  }
  return context;
};
