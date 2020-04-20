FROM arm32v7/python:3-slim

WORKDIR /usr/src/app

COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

COPY ./entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

COPY . /usr/src/app

EXPOSE 8080

ENTRYPOINT /usr/src/app/entrypoint.sh
