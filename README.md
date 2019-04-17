# Kue Getting Started

Getting started with queue based on Redis

## Running

```sh
cp .env.dist .env
docker-compose up -d --build
```

## Usage

```sh
curl -X POST -H 'Content-Type: application/json' -d '{ "task": "some" }' http://0.0.0.0:3000/task
```

## Monitoring

```sh
docker-compose logs --follow worker
```

## Scale Workers

```sh
docker-compose up -d --scale worker=4
```

## API

`POST /task`

```
{
    "task": "some",
    "payload": {},
    "priority": "normal",
    "attempts": 5
}
```
