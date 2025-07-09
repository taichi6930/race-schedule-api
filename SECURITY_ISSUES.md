# Security Issues to Address

## High Priority Security Issues

### 1. Hardcoded Google API Credentials Exposure
**Issue**: Google API credentials are directly accessed from environment variables without proper validation or secure handling.

**Location**: `lib/src/gateway/implement/googleCalendarGateway.ts`
```typescript
credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
},
```

**Risk**: 
- Credentials could be logged or exposed in error messages
- No validation if credentials are present
- Potential for credential leakage in CI/CD logs

**Recommended Fix**:
- Implement secure credential validation
- Use AWS Secrets Manager or Parameter Store
- Add credential rotation mechanism
- Validate credentials before use

---

### 2. Overly Permissive IAM Policies
**Issue**: AWS IAM role uses wildcard permissions for logging.

**Location**: `lib/stack/iam-setup.ts`
```typescript
effect: iam.Effect.ALLOW,
resources: ['*'],
```

**Risk**: 
- Principle of least privilege violation
- Could access logs from other applications
- Potential for privilege escalation

**Recommended Fix**:
- Restrict permissions to specific log groups
- Use resource-specific ARNs
- Implement role-based access controls

---

### 3. Missing Input Validation and Sanitization
**Issue**: API controllers lack proper input validation.

**Location**: Multiple controllers (e.g., `lib/src/controller/jraRaceController.ts`)
```typescript
const { startDate, finishDate, grade, location } = req.query;
// No validation before using these values
```

**Risk**:
- SQL injection potential
- XSS vulnerabilities  
- Data corruption
- DoS attacks through malformed inputs

**Recommended Fix**:
- Implement input validation using Zod or Joi
- Add request sanitization middleware
- Validate date formats and ranges
- Sanitize all user inputs

---

### 4. Error Information Leakage
**Issue**: Internal error details exposed to clients.

**Location**: Multiple controllers
```typescript
const errorMessage = error instanceof Error ? error.message : String(error);
res.status(500).send(`サーバーエラーが発生しました: ${errorMessage}`);
```

**Risk**:
- Stack traces could reveal system information
- Internal paths and secrets exposure
- Information disclosure vulnerabilities

**Recommended Fix**:
- Implement error handling middleware
- Use generic error messages for clients
- Log detailed errors server-side only
- Add error classification system

---

### 5. No Authentication or Authorization
**Issue**: All API endpoints are publicly accessible.

**Location**: `lib/src/index.ts` - All routes are unprotected
```typescript
app.use('/api/races/nar', narRaceController.router);
app.use('/api/races/jra', jraRaceController.router);
// No authentication middleware
```

**Risk**:
- Unauthorized data access
- API abuse and DoS
- Data manipulation by unauthorized users

**Recommended Fix**:
- Implement API key authentication
- Add JWT token validation
- Implement rate limiting
- Add role-based access control

---

### 6. Missing Security Headers and HTTPS Enforcement
**Issue**: No security headers or HTTPS enforcement.

**Location**: `lib/src/index.ts`
```typescript
const app: Application = express();
app.use(express.json());
// No security middleware
```

**Risk**:
- Man-in-the-middle attacks
- XSS vulnerabilities
- Clickjacking attacks
- CSRF vulnerabilities

**Recommended Fix**:
- Add helmet.js for security headers
- Implement HTTPS enforcement
- Add CORS configuration
- Implement CSRF protection

---

## Medium Priority Security Issues

### 7. Insecure Default Configuration
**Issue**: Default port and configuration without security considerations.

**Recommended Fix**:
- Use secure defaults
- Implement configuration validation
- Add environment-specific security settings

### 8. Missing Request Size Limits
**Issue**: No limits on request body size.

**Recommended Fix**:
- Implement request size limits
- Add timeout configurations
- Implement connection limits

### 9. No Security Monitoring
**Issue**: No security event logging or monitoring.

**Recommended Fix**:
- Implement security event logging
- Add intrusion detection
- Monitor authentication failures
- Add audit trails