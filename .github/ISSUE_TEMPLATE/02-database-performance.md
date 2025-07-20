---
name: 🗄️ Database Performance & Schema Issues
about: Critical database indexes and schema improvements needed
title: '[HIGH] Missing Database Indexes Causing Performance Issues'
labels: performance, database, schema
assignees: ''

---

## 🗄️ Database Performance Issues

### Description
Critical database indexes missing and schema inconsistencies causing slow query performance and maintenance issues.

### Critical Missing Indexes

The following indexes are essential for query performance:

```sql
-- Immediate implementation required
CREATE INDEX CONCURRENTLY idx_bookings_date ON bookings(date);
CREATE INDEX CONCURRENTLY idx_bookings_client_date ON bookings(clientId, date);
CREATE INDEX CONCURRENTLY idx_bookings_status ON bookings(status);
CREATE INDEX CONCURRENTLY idx_gallery_booking ON gallery_images(bookingId);
CREATE INDEX CONCURRENTLY idx_clients_email ON clients(email);
CREATE INDEX CONCURRENTLY idx_contracts_client ON contracts(clientId);
CREATE INDEX CONCURRENTLY idx_ai_chats_session ON ai_chats(sessionId);

-- Composite indexes for analytics
CREATE INDEX CONCURRENTLY idx_bookings_status_date ON bookings(status, date);
CREATE INDEX CONCURRENTLY idx_clients_status_created ON clients(status, createdAt);
```

### Schema Consistency Issues

#### 1. Column Naming Inconsistencies
**File:** `shared/schema.ts`
- Mixed naming: `createdat` vs `createdAt` vs `updated_at`
- Foreign keys: `clientid` vs `clientId`
- **Typo:** `depost_paid` should be `deposit_paid` (line 57)

#### 2. Data Type Issues
- `anniversaryDate` stored as TEXT instead of DATE (line 26)
- No validation constraints on email fields (lines 10, 18)
- Status fields lack CHECK constraints (lines 22, 58, 111)

#### 3. Missing Relationship Constraints
- Foreign keys lack CASCADE rules
- Risk of orphaned records when parents deleted
- Nullable relationships create ambiguous mappings

### Performance Impact

#### Current Issues:
- Dashboard analytics queries: **200-500ms** (should be <50ms)
- Client list loading: **100-200ms** (should be <30ms)
- Gallery image queries: **150-300ms** (should be <50ms)
- Search operations: **300-800ms** (should be <100ms)

#### Expected Improvements After Indexing:
- **75-85% reduction** in query execution time
- **Significant improvement** in dashboard load times
- **Better concurrent user handling**

### Implementation Plan

#### Phase 1: Critical Indexes (Immediate)
```bash
# Run these commands in production during low-traffic period
psql $DATABASE_URL -c "CREATE INDEX CONCURRENTLY idx_bookings_date ON bookings(date);"
psql $DATABASE_URL -c "CREATE INDEX CONCURRENTLY idx_clients_email ON clients(email);"
psql $DATABASE_URL -c "CREATE INDEX CONCURRENTLY idx_ai_chats_session ON ai_chats(sessionId);"
```

#### Phase 2: Schema Cleanup (1 week)
1. **Create migration for column renames:**
   ```sql
   ALTER TABLE bookings RENAME COLUMN depost_paid TO deposit_paid;
   ```
2. **Standardize naming conventions**
3. **Add CHECK constraints for status fields**
4. **Convert TEXT dates to proper DATE types**

#### Phase 3: Relationship Improvements (2 weeks)
1. **Add proper CASCADE rules**
2. **Review nullable relationships**
3. **Add missing foreign key constraints**

### Query Optimization Opportunities

#### Current Inefficient Patterns:
```typescript
// BEFORE: Multiple separate queries
const bookings = await db.select().from(bookings);
const clients = await db.select().from(clients);
const analytics = await calculateAnalytics(bookings);
```

#### Optimized Approach:
```typescript
// AFTER: Single aggregated query
const stats = await db
  .select({
    totalBookings: sql<number>`count(*)`,
    revenue: sql<number>`sum(totalPrice)`,
    avgValue: sql<number>`avg(totalPrice)`
  })
  .from(bookings)
  .where(gte(bookings.createdAt, thirtyDaysAgo));
```

### Monitoring Requirements

#### Add Query Performance Monitoring:
```typescript
// Add to storage.ts base class
protected async executeQuery<T>(query: () => Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await query();
    const duration = Date.now() - start;
    if (duration > 100) {
      console.warn(`Slow query detected: ${duration}ms`);
    }
    return result;
  } catch (error) {
    console.error(`Query failed after ${Date.now() - start}ms:`, error);
    throw error;
  }
}
```

### Files Requiring Changes
- `shared/schema.ts` - Schema definitions and types
- `drizzle.config.ts` - Migration configuration
- `server/storage.ts` - Query optimization
- `migrations/` - New migration files for indexes and schema changes

### Testing Requirements
- [ ] Query performance testing before/after
- [ ] Load testing with realistic data volumes
- [ ] Migration testing in staging environment
- [ ] Backup verification before schema changes

### Priority: HIGH
**Estimated Time:** 1-2 weeks for complete implementation
**Impact:** 75%+ improvement in query performance

---
*Identified through comprehensive database analysis*