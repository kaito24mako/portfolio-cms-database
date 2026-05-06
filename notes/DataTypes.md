# Sequelize Data Types (SQLite)

Every column you define in your model must have a data type. Sequelize provides a lot of built-in data types. This guide covers data types compatible with **SQLite**.

## Importing DataTypes

To access a built-in data type, you must import DataTypes:

```javascript
const { DataTypes } = require("sequelize");
```

---

## Strings

Strings are used to store text data. Different types offer various sizes and performance characteristics.

```javascript
DataTypes.STRING; // VARCHAR(255) - Variable-length string up to 255 characters
DataTypes.STRING(1234); // VARCHAR(1234) - Custom max length (e.g., 1234 characters)
DataTypes.STRING.BINARY; // VARCHAR BINARY - Case-sensitive string comparison
DataTypes.TEXT; // TEXT - Unlimited length text (no max length limit)
DataTypes.TEXT("tiny"); // TINYTEXT - Small text field
```

### String Type Differences

- **VARCHAR(n)**: Variable-length string with a maximum length. More efficient for shorter, predictable text (like usernames, emails).
- **TEXT**: Unlimited length string ideal for large content (articles, descriptions, comments). No length limit needed.
- **BINARY**: Makes string comparisons case-sensitive and byte-by-byte rather than character-based.

---

## Boolean

Boolean types store true/false values.

```javascript
DataTypes.BOOLEAN; // Stores true/false values (SQLite: stored as 0 or 1)
```

**SQLite Note**: SQLite doesn't have a native boolean type. Booleans are stored as integers: `0` for false, `1` for true.

---

## Numbers

Numbers are used for numeric data. Choose the type based on whether you need whole numbers or decimals.

### Integers

Integers store whole numbers (no decimal points).

```javascript
DataTypes.INTEGER; // INTEGER - Standard whole numbers (-2,147,483,648 to 2,147,483,647)
DataTypes.BIGINT; // BIGINT - Very large whole numbers
DataTypes.BIGINT(11); // BIGINT(11) - BIGINT with display width
```

**Use Cases**:

- `INTEGER`: User IDs, counts, ages, quantities
- `BIGINT`: Very large numbers like timestamps, large IDs

### Floating Point & Decimals

Floating point and decimal types store numbers with decimal places.

```javascript
DataTypes.FLOAT; // FLOAT - Approximate decimal numbers (7 digits precision)
DataTypes.FLOAT(11); // FLOAT(11) - With precision
DataTypes.FLOAT(11, 10); // FLOAT(11,10) - With precision and scale

DataTypes.DOUBLE; // DOUBLE - High-precision decimals (15 digits precision)
DataTypes.DOUBLE(11); // DOUBLE(11) - With precision
DataTypes.DOUBLE(11, 10); // DOUBLE(11,10) - With precision and scale

DataTypes.DECIMAL; // DECIMAL - Exact decimal numbers
DataTypes.DECIMAL(10, 2); // DECIMAL(10,2) - 10 total digits, 2 after decimal (e.g., 12345678.90)
```

**Type Differences**:

- **FLOAT/DOUBLE**: Approximate values, faster, good for scientific calculations
- **DECIMAL**: Exact values, perfect for money/currency (no rounding errors)

**Example**: For prices, use `DECIMAL(10, 2)` to store values like `1299.99` (up to 99,999,999.99)

---

## Dates

Date types store temporal (time-based) data.

```javascript
DataTypes.DATE; // DATETIME - Stores date and time (e.g., 2026-05-05 14:30:00)
DataTypes.DATEONLY; // DATE - Stores only date without time (e.g., 2026-05-05)
```

**Type Differences**:

- **DATE**: Full timestamp with date and time (use for created_at, updated_at, event times)
- **DATEONLY**: Just the date, no time component (use for birthdays, due dates, appointment days)

---

## UUIDs

**UUID** stands for **Universally Unique Identifier** - a 128-bit number used as a unique identifier that is (practically) guaranteed to be unique across all systems.

### What is a UUID?

A UUID looks like this: `550e8400-e29b-41d4-a716-446655440000`

UUIDs are ideal for:

- Distributed systems where IDs need to be generated independently
- Security (harder to guess than sequential IDs like 1, 2, 3...)
- Merging databases without ID conflicts

### Using UUIDs in Sequelize

For UUIDs, use `DataTypes.UUID`. In SQLite, it's stored as `CHAR(36)` (a 36-character string).

Sequelize can generate UUIDs automatically for these fields:

```javascript
{
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4  // Automatically generates a random UUID
}
```

**UUID Versions**:

- **UUIDv1** (`DataTypes.UUIDV1`): Based on timestamp and machine MAC address
- **UUIDv4** (`DataTypes.UUIDV4`): Completely random (recommended for most uses)

**Example Use Case**:

```javascript
const User = sequelize.define("User", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	username: DataTypes.STRING,
});
// Creates users with IDs like: 'a3bb189e-8bf9-3888-9912-ace4e6543002'
```

---

## ENUMs

**ENUM** (enumeration) is a data type that restricts a column to only accept a predefined set of values.

### What is an ENUM?

ENUMs ensure data integrity by only allowing specific values. Perfect for status fields, categories, or any field with a fixed set of options.

```javascript
DataTypes.ENUM("foo", "bar"); // Only accepts 'foo' or 'bar' - nothing else
```

### Examples

**Simple ENUM**:

```javascript
// Order status that can only be: 'pending', 'processing', 'shipped', or 'delivered'
DataTypes.ENUM("pending", "processing", "shipped", "delivered");
```

**Using the `values` field**:

```javascript
sequelize.define("User", {
	status: {
		type: DataTypes.ENUM,
		values: ["active", "suspended", "deleted"],
		defaultValue: "active",
	},
	role: {
		type: DataTypes.ENUM,
		values: ["user", "admin", "moderator"],
		defaultValue: "user",
	},
});
```

**Benefits**:

- Prevents invalid data (e.g., can't set status to "invalid_status")
- Self-documenting (clearly shows what values are valid)
- Database-level validation

---

## Summary: Choosing the Right Data Type

### `STRING`

**Best Used For:** Short text with known max length  
_Example:_ Usernames, emails, names

### `TEXT`

**Best Used For:** Long text, no length limit  
_Example:_ Articles, descriptions, comments

### `BOOLEAN`

**Best Used For:** True/false values  
_Example:_ isActive, isVerified

### `INTEGER`

**Best Used For:** Whole numbers  
_Example:_ User IDs, counts, ages

### `DECIMAL(10,2)`

**Best Used For:** Money/currency  
_Example:_ Prices, balances

### `FLOAT/DOUBLE`

**Best Used For:** Scientific calculations  
_Example:_ Measurements, coordinates

### `DATE`

**Best Used For:** Date and time  
_Example:_ created_at, updated_at

### `DATEONLY`

**Best Used For:** Date only  
_Example:_ Birthdays, due dates

### `UUID`

**Best Used For:** Unique identifiers  
_Example:_ Primary keys in distributed systems

### `ENUM`

**Best Used For:** Limited set of values  
_Example:_ Status, role, category

---

## Additional Resources

For more data types and advanced usage:

🔗 [Sequelize Data Types Documentation](https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types)  
🔗 [SQLite Data Types](https://www.sqlite.org/datatype3.html)
