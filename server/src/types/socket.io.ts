import { Socket } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    email: string;
    userId : number;
  }
}
