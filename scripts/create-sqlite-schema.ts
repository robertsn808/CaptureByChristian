
import { db } from '../server/db';
import * as schema from '@shared/schema';
import { getTableName, getTableColumns } from 'drizzle-orm';

async function createSqliteSchema() {
  console.log('Creating SQLite schema...');

  // @ts-ignore
  const tableCreationQueries = Object.values(schema).filter(table => getTableColumns(table)).map(table => {
    const tableName = getTableName(table);
    const columns = getTableColumns(table);
    const columnDefinitions = Object.entries(columns).map(([columnName, column]) => {
        let columnType = getSqliteType(column);
        let columnDefinition = `${column.name} ${columnType}`;
        if (column.isPrimaryKey) {
            columnDefinition += ' PRIMARY KEY';
        }
        if (column.notNull) {
            columnDefinition += ' NOT NULL';
        }
        if (column.default) {
            columnDefinition += ` DEFAULT ${column.default}`;
        }
        return columnDefinition;
    }).join(', ');

    const foreignKeyDefinitions = Object.entries(columns).map(([columnName, column]) => {
        if (column.foreignKey) {
            const foreignTableName = getTableName(column.foreignKey.table);
            const foreignColumnName = column.foreignKey.column.name;
            return `FOREIGN KEY (${column.name}) REFERENCES ${foreignTableName}(${foreignColumnName})`;
        }
        return null;
    }).filter(fk => fk !== null).join(', ');

    return `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions}${foreignKeyDefinitions ? ', ' + foreignKeyDefinitions : ''})`;
  });

  for (const query of tableCreationQueries) {
    try {
        // @ts-ignore
        await db.run(query);
        console.log(`Executed: ${query}`);
    } catch (e) {
        console.error(`Failed to execute query: ${query}`, e);
    }
  }

  console.log('SQLite schema created.');
}

function getSqliteType(column: any) {
    switch(column.dataType) {
        case 'string':
        case 'text':
            return 'TEXT';
        case 'number':
        case 'integer':
            return 'INTEGER';
        case 'boolean':
            return 'INTEGER';
        case 'date':
        case 'datetime':
            return 'TEXT';
        case 'json':
            return 'TEXT';
        default:
            if (column.dataType.startsWith('varchar')) {
                return 'TEXT';
            }
            return 'TEXT';
    }
}

createSqliteSchema();
