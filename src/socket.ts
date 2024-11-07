import { reactive } from 'vue';
import { io, Socket } from 'socket.io-client';

export const state = reactive({
    connected: false,
    fooEvents: [],
    barEvents: []
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    hello: () => void;
}

// interface InterServerEvents {
//     ping: () => void;
// }

// interface SocketData {
//     name: string;
//     age: number;
// }

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL);

socket.on('connect', () => {
    state.connected = true;
});

socket.on('disconnect', () => {
    state.connected = false;
});

// socket.on('foo', (...args) => {
//     state.fooEvents.push(args);
// });

// socket.on('bar', (...args) => {
//     state.barEvents.push(args);
// });
