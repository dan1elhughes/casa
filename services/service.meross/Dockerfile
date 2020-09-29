FROM python:3.8

COPY ./requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

RUN pip install fastapi uvicorn

EXPOSE 3000

COPY ./app /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3000"]
