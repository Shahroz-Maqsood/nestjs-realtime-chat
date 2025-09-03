# nestjs-realtime-chat

A complete NestJS real‑time chat application using Socket.io gateway, MongoDB (Mongoose), JWT auth, role-based authorization, Swagger docs, Docker, and Jest tests.

## Tech Stack
- NestJS
- Socket.io via `@WebSocketGateway`
- MongoDB with Mongoose
- JWT authentication with roles (`user`, `admin`)
- REST APIs + Swagger at `/api-docs`
- Jest (unit + e2e)
- Docker + Docker Compose
- ESLint + Prettier
- `@nestjs/config` for environment variables

## Features
- User signup/login (JWT-based)
- Admin can create/delete chat rooms
- Users can join/leave rooms
- Real-time messaging in rooms
- Stores chat history in MongoDB
- Typing indicators + online/offline status
- REST APIs for users, rooms, history
- Notifications for new/unread messages
- Example events:
  - `send_message`
  - `receive_message`
  - `typing`
  - `join_room`
  - `leave_room`
  - `user_online`
  - `user_offline`

## Folder Structure
```
src
├── app.module.ts
├── main.ts
├── common
│   ├── decorators
│   │   └── roles.decorator.ts
│   ├── guards
│   │   ├── roles.guard.ts
│   │   └── ws-jwt.guard.ts
│   ├── interceptors
│   │   └── transform.interceptor.ts
│   └── filters
│       └── http-exception.filter.ts
├── auth
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── dto
│   │   ├── login.dto.ts
│   │   └── signup.dto.ts
│   └── jwt.strategy.ts
├── users
│   ├── dto
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   ├── users.service.ts
│   └── user.schema.ts
├── rooms
│   ├── dto
│   │   └── create-room.dto.ts
│   ├── rooms.controller.ts
│   ├── rooms.module.ts
│   ├── rooms.service.ts
│   └── room.schema.ts
└── chat
    ├── chat.gateway.ts
    ├── chat.module.ts
    ├── chat.service.ts
    └── message.schema.ts
```

## Run

### With Docker
1. Copy `.env.example` → `.env` and adjust values if needed.
2. Build & run:
   ```bash
   docker compose up --build
   ```
3. API: `http://localhost:3000`  
   Swagger: `http://localhost:3000/api-docs`  
   Socket.io namespace: default (path `/socket.io`).

### Manually
```bash
cp .env.example .env
npm install
npm run start:dev
```

## Example Socket.io Usage

Client connects with JWT:
```js
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000', {
  auth: { token: 'Bearer <JWT_TOKEN>' }
});
```

Events:
- `join_room` → `{ roomId: string }`
- `leave_room` → `{ roomId: string }`
- `send_message` → `{ roomId: string, content: string }`
- `receive_message` → `{ _id, room, sender, content, createdAt }`
- `typing` → `{ roomId: string, isTyping: boolean }`
- `user_online` → `{ userId }`
- `user_offline` → `{ userId }`

## Tests
- At least 2 unit tests per module
- e2e test for chat gateway (connects with JWT and verifies `receive_message`).

---
MIT ©
