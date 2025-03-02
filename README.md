# Info Reus - Consola de administración

## Servicios

| Tipo de servicio | Nombre |
|------------------|--------|
| Base de datos | [Neon DB][1] |
| Almacenamiento | [Google Cloud Storage][2] |
| Autenticación | [Clerk][3]
| Alojamiento | [Vercel][4] |

## Variables de entorno

| Nombre | Descripción |
|--------|-------------|
| DATABASE_URL | URL de la base de datos |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Clave pública de Clerk |
| CLERK_SECRET_KEY | Clave secreta de Clerk |
| GOOGLE_PROJECT_ID | ID de proyecto de Google Cloud |
| GOOGLE_BUCKET | Nombre del bucket de Google Storage |
| GOOGLE_PRIVATE_KEY_ID | ID de la clave privada del acceso IAM |
| GOOGLE_PRIVATE_KEY | Clave privada del acceso IAM |
| GOOGLE_CLIENT_EMAIL | Correo electrónico de la cuenta de servicio del acceso IAM (ejemplo: late-uy@inforeus.iam.gserviceaccount.com) |
| GOOGLE_CLIENT_ID | ID de la cuenta de servicio del acceso IAM |
| GOOGLE_AUTH_URI | URL de la API de autenticación del acceso IAM (https://accounts.google.com/o/oauth2/auth) |
| GOOGLE_TOKEN_URI | URL de la API de tokens del acceso IAM (https://oauth2.googleapis.com/token) |
| GOOGLE_AUTH_PROVIDER_X509_CERT_URL | URL de la API de autenticación que otorga el certificado X509 (https://www.googleapis.com/oauth2/v1/certs) |
| GOOGLE_CLIENT_X509_CERT_URL | URL del certificado X509 del proyecto |
| GOOGLE_UNIVERSE_DOMAIN | URL genérica (googleapis.com) |

[1]: https://console.neon.tech/
[2]: https://console.cloud.google.com/storage
[3]: https://dashboard.clerk.com/
[4]: https://vercel.com/