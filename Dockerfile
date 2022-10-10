FROM node:slim
USER node
SHELL [ "bash" ]
VOLUME /home/node/perusal
WORKDIR /home/node/perusal
ENV NODE_OPTIONS=--openssl-legacy-provider
EXPOSE 8080
ENTRYPOINT ["npm", "run"]
CMD ["dev"]