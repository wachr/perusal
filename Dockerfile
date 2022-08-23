FROM node:latest
USER node
SHELL [ "bash" ]
VOLUME /home/node/perusal
WORKDIR /home/node/perusal
EXPOSE 8080
ENTRYPOINT ["npm", "run"]
CMD ["dev"]

# Use the below command to run a local webpack server that watches for file changes.
# > docker run -d -e 'USE_NFS_POLLING=true' -p 8080:8080 -v ${PWD}:/home/node/perusal perusal
# Use the below command to run jest interactively
# > docker run -it -v ${PWD}:/home/node/perusal perusal test -- --watch