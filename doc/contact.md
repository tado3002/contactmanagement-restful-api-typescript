# Contact API Spec

## Create Contact

Endpoint : POST /api/contact

Request Header :

- X-API-TOKEN : token

Request Body :

```json
{
  "firstname": "jokowi",
  "lastname": "widodo",
  "email": "jokowidodo@gmail.com",
  "phone": "0821479754234"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "firstname": "jokowi",
    "lastname": "widodo",
    "email": "jokowidodo@gmail.com",
    "phone": "0821479754234"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "firstname must not blank, ..."
}
```

## Get Contact

Endpoint :GET /api/contact/:id

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "firstname": "jokowi",
    "lastname": "widodo",
    "email": "jokowidodo@gmail.com",
    "phone": "0821479754234"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "contact with id not found, ..."
}
```

## Update Contact

Endpoint : PATCH /api/contact/:id

Request Header :

- X-API-TOKEN : token

Request Body :

```json
{
  "firstname": "jokowi",
  "lastname": "widodo",
  "email": "jokowidodo@gmail.com",
  "phone": "0821479754234"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": 1,
    "firstname": "jokowi",
    "lastname": "widodo",
    "email": "jokowidodo@gmail.com",
    "phone": "0821479754234"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "firstname must not blank, ..."
}
```

## Remove Contact

Endpoint : DELETE /api/contact/:id

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data": "OK"
}
```

Response Body (Failed) :

```json
{
  "errors": "contact not found, ..."
}
```

## Search Contact

Endpoint : GET /api/contact/

Query Parameter :

- name : string, contact firstname or contact lastname, optional
- phone : string, contact phone, optional
- email : string, contact email, optional
- page : number, default 1
- size : number, default 10

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data": [
    {
      "id": 1,
      "firstname": "jokowi",
      "lastname": "widodo",
      "email": "jokowidodo@gmail.com",
      "phone": "0821479754234"
    }
  ],

  "paging": {
    "current_page": 1,
    "total_page": 23,
    "size": 10
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "contact not fount, ..."
}
```
