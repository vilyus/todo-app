FROM python:3.8

WORKDIR /usr/src/app

RUN pip install pipenv

COPY Pipfile ./
COPY Pipfile.lock ./
RUN pipenv sync

COPY . ./
ENV FLASK_APP=server
ENV FLASK_ENV=development
