FROM arm32v7/python:3-slim

WORKDIR /usr/src/app

COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt

COPY . /usr/src/app

EXPOSE 5000

CMD ["waitress-serve", "--port=5000", "--call", "app:create_app"]
