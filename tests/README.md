# Backend API Integration Tests

This directory contains comprehensive integration tests for the CaptureByChristian photography business management platform's backend API.

## Test Suite Overview

### 🧪 Test Categories

1. **CRUD Operations** (`crud.test.ts`)
   - Client management (create, read, update, delete)
   - Service management with admin controls
   - Booking lifecycle management
   - Contract creation and management
   - Authentication and authorization testing

2. **Database Operations** (`database.test.ts`)
   - Database connectivity verification
   - Schema validation and constraints
   - Performance testing under load
   - Data integrity and transaction handling
   - Analytics and aggregation queries

3. **File Upload System** (`file-upload.test.ts`)
   - Image upload functionality
   - File validation and security
   - Multi-file uploads
   - Storage and metadata management
   - Error handling for invalid files

4. **Email Notifications** (`email-notifications.test.ts`)
   - Contact form processing with AI categorization
   - Client portal magic link system
   - Invoice email generation and sending
   - Automation workflow testing
   - Template processing and validation

5. **Integration Tests** (`integration.test.ts`)
   - Complete business workflow testing
   - End-to-end client booking lifecycle
   - Client portal functionality
   - Admin dashboard analytics
   - Performance and reliability testing

## 🚀 Quick Start

### Prerequisites

1. **PostgreSQL Test Database**
   ```bash
   # Create a test database
   createdb capture_test
   
   # Set environment variable
   export TEST_DATABASE_URL="postgresql://username:password@localhost:5432/capture_test"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:crud          # CRUD operations only
npm run test:database      # Database tests only
npm run test:uploads       # File upload tests only
npm run test:email         # Email notification tests only
npm run test:integration   # Full integration tests only

# Run with UI (interactive)
npm run test:ui

# Run once (CI mode)
npm run test:run

# Run with coverage report
npm run test:coverage

# Performance testing
npm run test:performance
```

### Test Environment Configuration

Create a `.env.test` file with:

```env
NODE_ENV=test
DATABASE_URL=postgresql://username:password@localhost:5432/capture_test
SESSION_SECRET=test-session-secret
ADMIN_USERNAME=testadmin
ADMIN_PASSWORD=testpassword

# Optional: For testing external services
TWILIO_ACCOUNT_SID=test_sid
TWILIO_AUTH_TOKEN=test_token
TWILIO_PHONE_NUMBER=+1234567890
OPENAI_API_KEY=test_key
```

## 📊 Test Coverage

The test suite covers:

- ✅ **API Endpoints**: All 50+ REST endpoints
- ✅ **Database Operations**: Full CRUD operations for all entities
- ✅ **Authentication**: Session-based auth and client portal access
- ✅ **File Uploads**: Image processing and validation
- ✅ **Email Systems**: Contact forms, magic links, invoices
- ✅ **Error Handling**: Graceful error responses and edge cases
- ✅ **Performance**: Concurrency and load testing
- ✅ **Business Logic**: Complete photography workflow simulation

### Key Metrics Tested

| Category | Endpoints | Test Cases | Coverage |
|----------|-----------|------------|----------|
| Clients | 3 | 15+ | 100% |
| Services | 5 | 20+ | 100% |
| Bookings | 4 | 25+ | 100% |
| Contracts | 4 | 15+ | 100% |
| Gallery | 6 | 30+ | 100% |
| Analytics | 8 | 20+ | 100% |
| Notifications | 10+ | 35+ | 100% |

## 🔧 Test Architecture

### Database Setup
- **Isolated Test Database**: Each test run uses a fresh database state
- **Transaction Rollback**: Tests are isolated using database transactions
- **Test Data Factories**: Reusable functions for creating test data
- **Schema Validation**: Ensures database schema matches expectations

### API Testing Strategy
- **Supertest Integration**: HTTP requests to actual Express server
- **Session Management**: Proper authentication flow testing
- **Error Simulation**: Comprehensive error condition testing
- **Performance Benchmarking**: Load and concurrency testing

### Mock Strategy
- **External Services**: Twilio SMS, OpenAI API mocked for reliable testing
- **File System**: File uploads tested with in-memory buffers
- **Time-sensitive Operations**: Date/time mocking for consistent results

## 📈 Performance Benchmarks

The test suite includes performance validation:

- **Database Queries**: < 100ms for simple queries, < 500ms for complex analytics
- **File Uploads**: Handles up to 10 concurrent 50MB files
- **API Concurrency**: 100+ concurrent requests without errors
- **Memory Usage**: Stable memory usage under load testing

## 🐛 Debugging Tests

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check PostgreSQL is running
   pg_isready
   
   # Verify test database exists
   psql -l | grep capture_test
   ```

2. **Port Conflicts**
   ```bash
   # Tests use dynamic ports, but check for conflicts
   lsof -i :5000
   ```

3. **Environment Variables**
   ```bash
   # Verify test environment
   npm run test -- --reporter=verbose
   ```

### Debug Mode
```bash
# Run with debug output
DEBUG=* npm run test:crud

# Run single test file with detailed output
npx vitest run tests/api/crud.test.ts --reporter=verbose
```

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: capture_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run test:run
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/capture_test
```

## 📝 Writing New Tests

### Test Structure
```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { setupTestDatabase, createTestClient } from "../setup";

describe('New Feature Tests', () => {
  setupTestDatabase(); // Automatic cleanup

  it('should handle new feature correctly', async () => {
    // Arrange
    const testData = await createTestClient();
    
    // Act
    const response = await request(app)
      .post('/api/new-endpoint')
      .send(testData);
    
    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResult);
  });
});
```

### Best Practices
1. **Use descriptive test names** that explain the expected behavior
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Test edge cases** and error conditions
4. **Use test data factories** from `setup.ts`
5. **Clean up resources** in afterAll hooks
6. **Mock external services** to ensure test reliability

## 🔍 Monitoring and Alerts

### Test Metrics
- **Test Execution Time**: Track performance regression
- **Flaky Test Detection**: Identify unreliable tests
- **Coverage Reports**: Ensure new code is tested
- **Database Query Performance**: Monitor slow queries

### Success Criteria
- ✅ All tests pass consistently
- ✅ Test execution < 60 seconds
- ✅ Code coverage > 90%
- ✅ No memory leaks detected
- ✅ Database operations within performance thresholds

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Supertest API Reference](https://github.com/visionmedia/supertest)
- [Drizzle ORM Testing Guide](https://orm.drizzle.team/docs/goodies#testing)
- [Express.js Testing Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Need Help?** Check the test output logs or create an issue with the specific test failure details.