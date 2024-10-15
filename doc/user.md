# User API Spec

## Register User

Endpoint : POST /api/users
Request Body :

```json
{
  "username": "muh.murtadlo",
  "password": "password123",
  "name": "Muh Murtadlo"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "muh.murtadlo",
    "name": "Muh Murtadlo"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Username must not blank..."
}
```

## Login User

Endpoint : POST /api/users/login
Request Body :

```json
{
  "username": "muh.murtadlo",
  "password": "password123"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "muh.murtadlo",
    "name": "Muh Murtadlo",
    "token": "randomtoken"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "username or password wrong..."
}
```

## Get User

Endpoint : GET /api/users/current

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data": {
    "username": "muh.murtadlo",
    "name": "Muh Murtadlo",
    "token": "randomtoken"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized..."
}
```

## Update User

Endpoint : PATCH /api/users/current

Request Header :

- X-API-TOKEN : token

Request Body :

```json
{
  "password": "password123",
  "name": "Muh Murtadlo"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "muh.murtadlo", //opsional
    "name": "Muh Murtadlo" //opsional
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized..."
}
```

## Logout User

Endpoint : DELETE /api/users/current

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
  "errors": "Unauthorized..."
}
```
