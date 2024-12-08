

FROM node:20-alpine


WORKDIR /usr/src/app


COPY . ./

RUN npm install
RUN npx prisma generate
COPY . .

CMD ["npm", "start"]



EXPOSE 3000


# RUN npm install
# COPY server ./
# RUN npm install