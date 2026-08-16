import { toast, type Renderable, type ValueOrFunction } from "react-hot-toast";

export function toastSuccess(text: string) {
    toast.custom(
        <div className="toast-notification toast-notification-success">
            {text}
        </div>);    
}

export function toastError(text: string) {
    toast.custom(
        <div className="toast-notification toast-notification-error">
            {text}
        </div>);    
}


export function toastInfo(text: string) {
    toast.custom(
        <div className="toast-notification toast-notification-info">
            {text}
        </div>);    
}

export function toastPromise<T>(promise:Promise<T>, onSuccess : ValueOrFunction<Renderable, T>, onError : ValueOrFunction<Renderable, T>) {
    toast.promise(promise,
      {
        loading: 'Loading',
        success: onSuccess,
        error: onError,
      }
    )
}