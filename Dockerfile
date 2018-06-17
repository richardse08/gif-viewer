FROM mhart/alpine-node:8
WORKDIR /src
COPY . /src
RUN npm install
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
