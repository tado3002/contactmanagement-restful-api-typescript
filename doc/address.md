# Address API Spec

## Create Address

Endpoint : POST /api/contacts/:idContact/addresses

Request Header :

- X-API-TOKEN : token

Request Body :

```json
{
  "street": "jalan. jambu",
  "city": "Pasuruan",
  "province": "Jawa Timur",
  "postal_code": "67184"
}
```

Response (Success) :

```json
{
  "data": {
    "id": 1,
    "street": "jalan. jambu",
    "city": "Pasuruan",
    "province": "Jawa Timur",
    "postal_code": "67184",
    "country": "Indonesia"
  }
}
```

Response (Failed) :

```json
{
  "errors": "postal code required, ..."
}
```

## Get Address

Endpoint : GET /api/contacts/:idContact/addresses/:idAddress

Request Header :

- X-API-TOKEN : token

Response (Success) :

```json
{
  "data": {
    "id": 1,
    "street": "jalan. jambu",
    "city": "Pasuruan",
    "province": "Jawa Timur",
    "postal_code": "67184"
  }
}
```

Response (Failed) :

```json
{
  "errors": "adddress not found, ..."
}
```

## Update Address

Endpoint : PUT /api/contacts/:idContact/addresses/:idAddress

Request Header :

- X-API-TOKEN : token

Request Body :

```json
{
  "street": "jalan. jambu",
  "city": "Pasuruan",
  "province": "Jawa Timur",
  "postal_code": "67184"
}
```

Response (Success) :

```json
{
  "data": {
    "id": 1,
    "street": "jalan. jambu",
    "city": "Pasuruan",
    "province": "Jawa Timur",
    "postal_code": "67184"
  }
}
```

Response (Failed) :

```json
{
  "errors": "postal code required, ..."
}
```

## Remove Address

Endpoint : DELETE /api/contacts/:idContact/addresses/:idAddress

Request Header :

- X-API-TOKEN : token

Response (Success) :

```json
{
  "data": "OK"
}
```

Response (Failed) :

```json
{
  "errors": "adddress not found, ..."
}
```

## List Address

Endpoint : GET /api/contacts/:idContact/addresses

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data": [
    {
      "id": 1,
      "street": "jalan. jambu",
      "city": "Pasuruan",
      "province": "Jawa Timur",
      "postal_code": "67184"
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
  "errors": "contacts is not found, ..."
}
```
