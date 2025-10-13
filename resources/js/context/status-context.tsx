import { Status } from "@/types";
import { usePage } from "@inertiajs/react";
import { createContext, Dispatch, PropsWithChildren, useContext, useReducer } from "react";

interface DispatchAction {
  type: 'set'
  status: Status
}

export const StatusContext = createContext<string | null>(null);
export const StatusDispatchContext = createContext<Dispatch<DispatchAction> | null>(null);

export function StatusProvider({ children }: PropsWithChildren) {
  const { status: userStatus } = usePage().props.auth.user;
  const [status, dispatch] = useReducer(statusReducer, userStatus ?? 'unavailable');

  return (
    <StatusContext.Provider value={status}>
      <StatusDispatchContext.Provider value={dispatch}>
        {children}
      </StatusDispatchContext.Provider>
    </StatusContext.Provider>
  )
}

export function useStatus() {
  const context = useContext(StatusContext);
  if (!context) throw new Error('useStatus must be used inside a StatusProvider component.');
  return context;
}

export function useStatusDispatch() {
  const context = useContext(StatusDispatchContext);
  if (!context) throw new Error('useStatus must be used inside a StatusProvider component.');
  return context;
}

function statusReducer(status: Status, action: DispatchAction) {
  switch(action.type) {
    case 'set':
      return action.status;

    default:
      throw new Error('Invalid action');
  }
}