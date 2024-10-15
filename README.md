
# Belajar Typescript BackEnd Manajemen Kontak RESTFUL API

API RESTful ini dibangun menggunakan TypeScript, Express.js, dan Prisma ORM untuk menyediakan CRUD (Create, Read, Update, Delete) operations pada tabel users, contacts, dan addresses. API ini mengandalkan MySQL sebagai database utama dan menggunakan Jest untuk pengujian unit, Babel untuk transpiling TypeScript ke JavaScript, serta Winston untuk logging.




## Run Locally

Clone the project

```bash
  git clone https://github.com/tado3002/contactmanagement-restful-api-typescript.git
```

Go to the project directory

```bash
  cd contactmanagement-restful-api-typescript
```

Create .env

```
DATABASE_URL="mysql://root:yourpassword@localhost:3306/belajar_typescript_restful_api"
```


Install dependencies

```bash
  npm install
```

Migrate prisma ORM

```bash
    npx prisma migrate dev
```

Generate Database with prisma ORM

```bash
    npx prisma generate
```

Compile typescript files 

```bash
    tsc
```

Run server 

```bash
    node dist/main.js
```



## Endpoint API

Untuk daftar lengkap endpoint dan detailnya, silakan lihat file [doc/].

## Contributing

Jika Anda ingin berkontribusi, silakan fork repository ini, buat perubahan, dan kirimkan pull request.



## Authors

- [@tado3002](https://www.github.com/tado3002)

