# AWS CI/CD Sample App

[![Deploy to AWS](https://github.com/YOUR_USERNAME/aws-ci-cd-sample-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/aws-ci-cd-sample-app/actions/workflows/deploy.yml)

A professional Node.js Express web application with automated CI/CD pipeline using GitHub Actions and AWS Elastic Beanstalk.

## Features

- **Express.js API** with health check and CRUD operations
- **Automated Testing** with Jest
- **Code Quality** with ESLint and Prettier
- **Containerized** with Docker
- **CI/CD Pipeline** with GitHub Actions
- **AWS Deployment** to Elastic Beanstalk
- **Health Monitoring** with automatic rollback

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Clone repository
git clone <repository-url>
cd aws-ci-cd-sample-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm start     # Start production server
npm run dev   # Start development server with nodemon
npm test      # Run Jest tests
npm run lint  # Run ESLint
```

### Testing Locally

```bash
# Run all tests
npm test

# Test API endpoints
curl http://localhost:8080/health
curl http://localhost:8080/api/items
```

## CI/CD Pipeline

The automated pipeline runs on every push to the `main` branch:

### 1. **Test Stage**
- Install dependencies
- Run ESLint for code quality
- Execute Jest test suite
- Fail fast if any step fails

### 2. **Deploy Stage** (only after tests pass)
- Configure AWS credentials using OIDC
- Create deployment package
- Deploy to Elastic Beanstalk
- Wait for deployment completion
- Run health check on deployed application
- Automatic rollback on health check failure

### Pipeline Features

- **Security**: Uses GitHub OIDC instead of stored AWS keys
- **Reliability**: Comprehensive testing before deployment
- **Monitoring**: Post-deploy health verification
- **Safety**: Automatic rollback on failure

## AWS Setup Requirements

### 1. Elastic Beanstalk Environment

Create an Elastic Beanstalk application and environment:

```bash
# Using AWS CLI
aws elasticbeanstalk create-application --application-name "aws-ci-cd-sample-app"
aws elasticbeanstalk create-environment \
  --application-name "aws-ci-cd-sample-app" \
  --environment-name "production" \
  --platform-arn "arn:aws:elasticbeanstalk:region::platform/Node.js running on 64bit Amazon Linux 2"
```

### 2. IAM Role for GitHub Actions

Create an IAM role with trust policy for GitHub OIDC:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT-ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:YOUR_USERNAME/aws-ci-cd-sample-app:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

Attach policies: `AWSElasticBeanstalkWebTier`, `AWSElasticBeanstalkWorkerTier`, `AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy`

### 3. GitHub Secrets

Configure these repository secrets:

- `AWS_ROLE_ARN`: ARN of the IAM role created above
- `AWS_REGION`: AWS region (e.g., `us-east-1`)
- `EB_APPLICATION_NAME`: Elastic Beanstalk application name
- `EB_ENVIRONMENT_NAME`: Elastic Beanstalk environment name
- `EB_ENVIRONMENT_URL`: Environment URL for health checks

### 4. OIDC Provider Setup

If not already configured, add GitHub OIDC provider:

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 \
  --client-id-list sts.amazonaws.com
```

## Docker Deployment

```bash
# Build image
docker build -t aws-ci-cd-sample-app .

# Run container
docker run -p 8080:8080 aws-ci-cd-sample-app
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License