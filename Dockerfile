FROM node:0.12

#a bit from here
#http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app

EXPOSE 3000

CMD [ "npm", "run", "serve" ]