FROM node:12.16.3

WORKDIR /app

ADD steedos-projects/project-template/.steedos ./.steedos/
ADD steedos-projects/project-template/services ./services/
ADD steedos-projects/project-template/steedos-app ./steedos-app/
# ADD steedos-packages ./steedos-packages/
ADD steedos-projects/project-template/package.json .
ADD steedos-projects/project-template/moleculer.config.js .
ADD steedos-projects/project-template/init_home.sh .
ADD steedos-projects/project-template/steedos-config-k8s.yml ./steedos-config.yml

RUN npm config set registry http://registry.npm.taobao.org/
RUN yarn config set registry http://registry.npm.taobao.org/

RUN yarn

ENV NODE_ENV=production

CMD ["yarn", "start"]