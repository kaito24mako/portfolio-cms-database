# One-to-Many Relationship: Clubs & Users

## The Relationship

**One Club → Many Users**  
**One User → One Club**

```
Club Z                          Club Y
  ├── User A (clubId = Z's id)    ├── User D (clubId = Y's id)
  ├── User B (clubId = Z's id)    └── User E (clubId = Y's id)
  └── User C (clubId = Z's id)
```

---

## How It Works (No Arrays Needed!)

### Key Concept: The "Many" Side Stores the Foreign Key

In a One-to-Many relationship, you **DON'T store an array in the Club**. Instead:

✅ **Each User stores a reference to their Club** (via `clubId` foreign key)  
❌ **Club does NOT store an array of user IDs**

### Database Structure:

#### Clubs Table:

```
| id (UUID)  | name    | location    |
|------------|---------|-------------|
| club-z-id  | Club Z  | Melbourne   |
| club-y-id  | Club Y  | Sydney      |
```

#### Users Table:

```
| id (UUID)  | username | email        | clubId (FK)  |
|------------|----------|--------------|--------------|
| user-a-id  | Alice    | a@email.com  | club-z-id    |  ← Alice belongs to Club Z
| user-b-id  | Bob      | b@email.com  | club-z-id    |  ← Bob belongs to Club Z
| user-c-id  | Charlie  | c@email.com  | club-z-id    |  ← Charlie belongs to Club Z
| user-d-id  | Diana    | d@email.com  | club-y-id    |  ← Diana belongs to Club Y
| user-e-id  | Eve      | e@email.com  | club-y-id    |  ← Eve belongs to Club Y
```

**Notice**: Club Z doesn't store [A, B, C]. Instead, Users A, B, and C each store Club Z's ID!

---

## How to Assign Multiple Users to a Club

### Scenario: Assign Users A, B, C to Club Z

There are **several ways** to do this:

### Method 1: Set clubId When Creating Users

```javascript
const { Club, User } = require("./models/models");

// First, create or find Club Z
const clubZ = await Club.create({
	name: "Club Z",
	location: "Melbourne",
});

// Create users and assign them to Club Z
const userA = await User.create({
	username: "Alice",
	email: "alice@example.com",
	password: "hashedPassword123",
	clubId: clubZ.id, // ← Assign to Club Z
});

const userB = await User.create({
	username: "Bob",
	email: "bob@example.com",
	password: "hashedPassword123",
	clubId: clubZ.id, // ← Assign to Club Z
});

const userC = await User.create({
	username: "Charlie",
	email: "charlie@example.com",
	password: "hashedPassword123",
	clubId: clubZ.id, // ← Assign to Club Z
});

console.log(`Club ${clubZ.name} now has users A, B, C assigned!`);
```

---

### Method 2: Update Existing Users to Join a Club

```javascript
// Find existing users
const userA = await User.findOne({ where: { username: "Alice" } });
const userB = await User.findOne({ where: { username: "Bob" } });
const userC = await User.findOne({ where: { username: "Charlie" } });

// Find Club Z
const clubZ = await Club.findOne({ where: { name: "Club Z" } });

// Assign each user to Club Z
await userA.update({ clubId: clubZ.id });
await userB.update({ clubId: clubZ.id });
await userC.update({ clubId: clubZ.id });

console.log(`Users A, B, C now belong to ${clubZ.name}`);
```

---

### Method 3: Bulk Update Multiple Users

```javascript
// Find Club Z
const clubZ = await Club.findOne({ where: { name: "Club Z" } });

// Update multiple users at once
await User.update(
	{ clubId: clubZ.id }, // Set clubId to Club Z's id
	{
		where: {
			username: ["Alice", "Bob", "Charlie"], // For these users
		},
	},
);

console.log("Users A, B, C assigned to Club Z in one operation!");
```

---

### Method 4: Using Sequelize Association Methods

When you define `Club.hasMany(User)`, Sequelize automatically creates helper methods:

```javascript
const clubZ = await Club.findOne({ where: { name: "Club Z" } });
const userA = await User.findOne({ where: { username: "Alice" } });
const userB = await User.findOne({ where: { username: "Bob" } });
const userC = await User.findOne({ where: { username: "Charlie" } });

// Add users to club using association methods
await clubZ.addUser(userA); // Singular: add one user
await clubZ.addUsers([userB, userC]); // Plural: add multiple users

// This automatically sets clubId for each user!
```

---

### Method 5: Using setUsers (Replace All Users)

```javascript
const clubZ = await Club.findOne({ where: { name: "Club Z" } });

// Find all users you want in the club
const users = await User.findAll({
	where: {
		username: ["Alice", "Bob", "Charlie"],
	},
});

// Replace all users in this club with the specified users
await clubZ.setUsers(users);

// This will:
// 1. Remove any existing users from Club Z (set their clubId to NULL)
// 2. Add users A, B, C to Club Z (set their clubId to Club Z's id)
```

---

## How to Query: Get All Users in a Club

### Method 1: Query from Club (Using Include)

```javascript
const clubZ = await Club.findOne({
	where: { name: "Club Z" },
	include: User, // Include associated users
});

console.log(`Club: ${clubZ.name}`);
console.log(`Users:`, clubZ.Users); // Array of User objects
// clubZ.Users = [userA, userB, userC]
```

### Method 2: Query from Club (Using Association Method)

```javascript
const clubZ = await Club.findOne({ where: { name: "Club Z" } });

// Use the auto-generated getUsers() method
const users = await clubZ.getUsers();

console.log(`Club ${clubZ.name} has ${users.length} users:`);
users.forEach((user) => console.log(`- ${user.username}`));
```

### Method 3: Query Users Directly

```javascript
const clubZ = await Club.findOne({ where: { name: "Club Z" } });

// Find all users with this club's ID
const users = await User.findAll({
	where: { clubId: clubZ.id },
});

console.log(
	`Users in Club Z:`,
	users.map((u) => u.username),
);
// ["Alice", "Bob", "Charlie"]
```

---

## How to Query: Get a User's Club

```javascript
const userA = await User.findOne({
	where: { username: "Alice" },
	include: Club, // Include the associated club
});

console.log(`${userA.username} belongs to ${userA.Club.name}`);
// "Alice belongs to Club Z"
```

---

## Why No Arrays?

### ❌ Don't Do This (Array Storage):

```javascript
// WRONG - Don't store arrays in relational databases!
const clubZ = {
	id: "club-z-id",
	name: "Club Z",
	userIds: ["user-a-id", "user-b-id", "user-c-id"], // ❌ Bad practice
};
```

### ✅ Do This Instead (Foreign Keys):

```javascript
// CORRECT - Store foreign key in the "many" side
const userA = {
	id: "user-a-id",
	username: "Alice",
	clubId: "club-z-id", // ✅ Good practice
};
```

### Why Foreign Keys Are Better:

1. **Database Integrity**: Foreign keys enforce referential integrity
2. **Efficient Queries**: Indexes on foreign keys make lookups fast
3. **No Array Limitations**: SQLite doesn't support arrays (PostgreSQL's array is an exception)
4. **Standard Relational Design**: This is how relational databases are meant to work
5. **Automatic Joins**: Database can efficiently join tables
6. **Easy Updates**: Changing a user's club is a single UPDATE statement

---

## Common Operations

### Remove a User from Their Club

```javascript
const userA = await User.findOne({ where: { username: "Alice" } });
await userA.update({ clubId: null });
// Alice no longer belongs to any club
```

### Transfer User to Different Club

```javascript
const userA = await User.findOne({ where: { username: "Alice" } });
const clubY = await Club.findOne({ where: { name: "Club Y" } });

await userA.update({ clubId: clubY.id });
// Alice moved from Club Z to Club Y
```

### Count Users in a Club

```javascript
const clubZ = await Club.findOne({ where: { name: "Club Z" } });
const userCount = await clubZ.countUsers();
console.log(`Club Z has ${userCount} users`);
```

### Check If User Belongs to a Specific Club

```javascript
const userA = await User.findOne({ where: { username: "Alice" } });
const clubZ = await Club.findOne({ where: { name: "Club Z" } });

if (userA.clubId === clubZ.id) {
	console.log("Alice is in Club Z");
}

// Or using association method:
const hasUser = await clubZ.hasUser(userA);
console.log(`Club Z has Alice: ${hasUser}`);
```

---

## Complete Example: Building a Club with Users

```javascript
const { Club, User } = require("./models/models");
const bcrypt = require("bcrypt");

async function createClubWithUsers() {
	try {
		// 1. Create Club Z
		const clubZ = await Club.create({
			name: "Club Z",
			location: "123 Main Street, Melbourne",
		});
		console.log(`✅ Created ${clubZ.name}`);

		// 2. Create users and assign to Club Z
		const usersData = [
			{ username: "Alice", email: "alice@example.com" },
			{ username: "Bob", email: "bob@example.com" },
			{ username: "Charlie", email: "charlie@example.com" },
		];

		const hashedPassword = await bcrypt.hash("SecurePass123!", 10);

		for (const userData of usersData) {
			await User.create({
				...userData,
				password: hashedPassword,
				clubId: clubZ.id, // Assign to Club Z
			});
			console.log(`✅ Created user ${userData.username} in ${clubZ.name}`);
		}

		// 3. Verify - get all users in Club Z
		const clubWithUsers = await Club.findOne({
			where: { name: "Club Z" },
			include: User,
		});

		console.log(
			`\n${clubWithUsers.name} has ${clubWithUsers.Users.length} members:`,
		);
		clubWithUsers.Users.forEach((user, index) => {
			console.log(`  ${index + 1}. ${user.username} (${user.email})`);
		});
	} catch (error) {
		console.error("Error:", error);
	}
}

// Run it
createClubWithUsers();
```

---

## Summary

### Key Points:

1. ✅ **Users store `clubId`** (foreign key to Clubs table)
2. ✅ **Clubs don't store user arrays**
3. ✅ **To assign multiple users to Club Z**: Set each user's `clubId` to Club Z's id
4. ✅ **To get all users in a club**: Query users where `clubId = club.id` or use `include`
5. ✅ **This works in ALL SQL databases** (SQLite, MySQL, PostgreSQL, etc.)

### The Relationship in Code:

```javascript
// In models.js:
Club.hasMany(User, { foreignKey: "clubId" }); // One club has many users
User.belongsTo(Club); // Each user belongs to one club
```

This creates the foreign key `clubId` in the Users table, NOT an array in the Clubs table!

---

## Additional Resources

🔗 [Sequelize One-to-Many Associations](https://sequelize.org/docs/v6/core-concepts/assocs/#one-to-many-relationships)  
🔗 [Foreign Keys Explained](https://en.wikipedia.org/wiki/Foreign_key)  
🔗 [Relational Database Design](https://en.wikipedia.org/wiki/Relational_database)
