```
flowchart LR
  Browser -->|HTTP(S)| NextJS[Next.js (Public + Admin)]
  NextJS -->|REST / GraphQL| API[NestJS API]
  API --> MongoDB[(MongoDB)]
  API --> Redis[(Redis cache)]
  API --> BullMQ[(BullMQ)] --> Worker((Worker: thumbnail/email))
  Worker -->|read/write| MongoDB
  NextJS -->|Socket| API
  Note[DevOps: Docker Compose, CI/CD -> Vercel (FE), Render (BE)]
