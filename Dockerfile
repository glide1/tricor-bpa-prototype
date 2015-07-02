FROM node:0.12

RUN mkdir -p /opt/app 
WORKDIR /opt/app
ADD . /opt/app

RUN npm install --unsafe-perm

ENV NODE_ENV production

EXPOSE 3000

CMD [ "npm", "run", "start" ]