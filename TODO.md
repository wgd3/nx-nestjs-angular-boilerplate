# To-Do Checklist

## Server

### Authentication and Authorization

- [ ] Incorporate social logins
  - [ ] Google
  - [ ] Apple
- [ ] Add refresh token support
  - [ ] track current refresh token in database
  - [ ] add `/auth/email/refresh` route to refresh access token
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

- [ ] Add Sentry error reporting support
- [ ] Winston logging
- [ ] Terminus health checks

## Documentation

- [ ] Use VuePress to set up static docs site

## Repository

- [ ] Dockerfile
- [ ] Kubernetes manifests
- [ ] Update README with project details/acknowledgements
