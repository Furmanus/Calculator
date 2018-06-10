import {IObservable} from './IObservable';

export class Observer {
    private observers: IObservable[] = [];

    on(observer: Observer, event: string, callback: () => void): void {
        this.observers.push({
            observer,
            event,
            callback
        });
    }
    off(observer: Observer, event: string): void {
        this.observers.forEach((entry, index) => {
            if(entry.observer === observer && entry.event === event) {
                this.observers.splice(index, 1);
            }
        });
    }
    notify(event: string, data = {}) {
        this.observers.forEach((entry) => {
            if(entry.event === event) {
                entry.callback.call(entry.observer, data);
            }
        });
    }
}