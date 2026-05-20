# Login Flowchart

This flowchart reflects the current login logic implemented in `src/routes/auth.js` and `src/controllers/auth.js`.

```mermaid
flowchart TD
    A[Client sends POST /login] --> B[Express route forwards request to login controller]
    B --> C[Controller reads username, email, and password from req.body]
    C --> D[Query User.findOne with username, email, and password]
    D --> E{Was a user found?}
    E -- No --> F[Return 400 Invalid login details]
    E -- Yes --> G[Set validPassword = user.password]
    G --> H{Does validPassword equal req.body.password?}
    H -- No --> I[Return 400 Invalid login details]
    H -- Yes --> J[Call user.generateAuthToken]
    J --> K[Sign JWT with API_PRIVATE_KEY]
    K --> L[Send token in response body]

    D -. query error .-> M[Catch error]
    J -. token generation error .-> M
    M --> N[Return 503 Internal error]
```

## Notes

- The route is `POST /login`.
- The current lookup includes `password` in `User.findOne(...)`.
- After the user is found, the controller does a second direct password equality check.
- `bcrypt` is imported, but the active code is not using `bcrypt.compare()` right now.
- The JWT is generated with `process.env.API_PRIVATE_KEY`.
