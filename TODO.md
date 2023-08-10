# To-Do Checklist

## Server

### Authentication and Authorization

- [x] Incorporate social logins
  - [x] Google
  - [ ] Apple
- [x] Add refresh token support
  - [x] track current refresh token in database
  - [x] add `/auth/email/refresh` route to refresh access token
- [ ] 2FA support

### User Management

- [ ] add `isEmailVerified` property
- [ ] add email support
  - [ ] account verification
  - [ ] password reset
- [ ] Switch to true RBAC

### API

- [ ] Add pagination support

### Database

- [ ] Database migrations
- [ ] Database seeding (creating random users)

### Miscellaneous

- [x] Add Sentry error reporting support
- [ ] Winston logging
- [x] Terminus health checks

## Documentation

- [ ] Use VuePress to set up static docs site

## Repository

- [ ] Dockerfile
- [ ] Kubernetes manifests
- [ ] Update README with project details/acknowledgements
