FROM node:latest
USER node
SHELL [ "bash" ]
ENV NODE_OPTIONS=--openssl-legacy-provider
VOLUME /home/node/perusal
WORKDIR /home/node/perusal
EXPOSE 8080
ENTRYPOINT ["npm", "run"]
CMD ["dev"]