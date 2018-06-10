import {Observer} from './observer';

export interface IObservable {
    observer: Observer,
    event: string,
    callback: () => void
}