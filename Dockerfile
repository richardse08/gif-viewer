FROM mhart/alpine-node:8
WORKDIR /src
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
COPY . /src
RUN npm install
