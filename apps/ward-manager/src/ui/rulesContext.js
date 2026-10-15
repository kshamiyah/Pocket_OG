import { createContext, useContext } from "react";

// Lets any alert citation open its rule and sources without prop drilling.
export const RulesContext = createContext({ openRule: null });
export const useRules = () => useContext(RulesContext);
