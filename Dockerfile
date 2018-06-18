FROM mhart/alpine-node:8
WORKDIR /src
COPY . /src
RUN npm install
EXPOSE 4000
ENTRYPOINT ["npm", "start"]
