import { AlertCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { toast as sonnerToast } from "sonner";

export default function toast(type: ToastProps['type'], title: string, description: string) {
    return sonnerToast.custom((id) => (
    <Toast
        id={id}
        type={type}
        title={title}
        description={description}
    />
  ));
}

interface ToastProps {
    id: string | number;
    type: 'error' | 'success' | 'warning';
    title: string;
    description: string;
}

function Toast({ id, type, title, description }: ToastProps) {
    return (
        <div
            className={'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 ease-in-out ' + 
                type === 'error' ? 'border-l-4 border-red-500' :
                    type === 'success' ? 'border-l-4 border-green-500' :
                    'border-l-4 border-yellow-500'
            }
        >
          <div className="p-4">
            <div className="flex items-center">
              <div className="shrink-0">
                  <AlertCircle
                      className={'h-5 w-5 ' +
                          type === 'error' ? 'text-red-400' :
                              type === 'success' ? 'text-green-400' :
                              'text-yellow-400'
                      }
                  />
              </div>

              <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  <p className="mt-1 text-sm text-gray-500">{description}</p>
              </div>

              <div className="ml-4 shrink-0 flex">
                  <Button
                      onClick={() => sonnerToast.dismiss(id)}
                      ><X className="h-5 w-5" /></Button>
              </div>
            </div>
          </div>
        </div>
    )
}