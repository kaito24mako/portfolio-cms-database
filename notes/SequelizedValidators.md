# Validators

Model validators allow you to specify format/content/inheritance validations for each attribute of the model.

Validations are automatically run on create, update and save.

You can also call validate() to manually validate an instance.

```javascript
sequelize.define('foo', {
  bar: {
    type: DataTypes.STRING,
    validate: {
      // matches this RegExp - checks to see if string consists entirely of "word characters" (letters, numbers, and underscores) and literal periods
      is: /^[a-z]+$/i,

      // same as above, but constructing the RegExp from a string (different way of typing it)
      is: ["^[a-z]+$",'i'],

      // Use the ASCII character range in your character class. All characters, symbols and numbers.
      is: /^[\x20-\x7E]+$/i,
      isAscii: true,

      // Expanded character set to include Unicode Latin ranges or explicitly add common accented character
      is: /^[\x20-\x7E\u00C0-\u00FF]+$/i,

      // Ensuring it contains at least one uppercase letter, one lowercase letter, one number, and one symbol
      is: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E])[\x20-\x7E]+$/,

      // does not match this RegExp
      not: /^[a-z]+$/i,

      // same as above, but constructing the RegExp from a string
      not: ["^[a-z]+$",'i'],

      // checks for email format (foo@bar.com)
      isEmail: true,

      // checks for url format (https://foo.com)
      isUrl: true,

      // checks for IPv4 (129.89.23.1) or IPv6 format
      isIP: true,

      // checks for IPv4 (129.89.23.1)
      isIPv4: true,

      // checks for IPv6 format
      isIPv6: true,

      // will only allow letters
      isAlpha: true,

      // will only allow alphanumeric characters, so "_abc" will fail
      isAlphanumeric: true,

      // will only allow numbers
      isNumeric: true,

      // checks for valid integers
      isInt: true,

      // checks for valid floating point numbers
      isFloat: true,

      // checks for any numbers
      isDecimal: true,

      // checks for lowercase
      isLowercase: true,

      // checks for uppercase
      isUppercase: true,

      // won't allow null
      notNull: true,

      // only allows null
      isNull: true,

      // don't allow empty strings
      notEmpty: true,

      // only allow a specific value
      equals: 'specific value',

      // force specific substrings
      contains: 'foo',

      // check the value is not one of these
      notIn: [['foo', 'bar']],

      // check the value is one of these
      isIn: [['foo', 'bar']],

      // don't allow specific substrings
      notContains: 'bar',

      // only allow values with length between 2 and 10
      len: [2,10],

      // only allow uuids
      isUUID: 4,

      // only allow date strings
      isDate: true,

      // only allow date strings after a specific date
      isAfter: "2011-11-05",

      // only allow date strings before a specific date
      isBefore: "2011-11-05",

      // only allow values <= 23
      max: 23,

      // only allow values >= 23
      min: 23,

      // check for valid credit card numbers
      isCreditCard: true,

      // Examples of custom validators:
      isEven(value) {
        if (parseInt(value) % 2 !== 0) {
          throw new Error('Only even values are allowed!');
        }
      }
      isGreaterThanOtherField(value) {
        if (parseInt(value) <= parseInt(this.otherField)) {
          throw new Error('Bar must be greater than otherField.');
        }
      }
    }
  }
});
```
