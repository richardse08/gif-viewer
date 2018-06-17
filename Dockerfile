FROM node:7.7.4
WORKDIR /src
COPY . /src
RUN npm install
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
