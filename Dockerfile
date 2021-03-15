FROM nginx
COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
ADD certs /etc/nginx/certs/server
EXPOSE 443
