import { io } from "socket.io-client";
import React from "react";
const SOCKET_URL = "http://localhost:4000";
const socket = io(SOCKET_URL);
const AppContext = React.createContext();

export { socket, AppContext };