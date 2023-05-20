FROM node:16.13.1

WORKDIR /app

COPY . /app

CMD ["npm", "run", "start"]