FROM registry.cn-chengdu.aliyuncs.com/sniqny/nginx:1.20.2-ssl

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

COPY html /usr/share/nginx/html