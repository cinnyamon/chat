# Anonymous (or not) live chat using socket.io with Redis DB, PostgreSQL and message encryption functionalities.

Create a postgres database first and then make a table with the name `chat_messages`:

    CREATE TABLE chat_messages (
        id SERIAL PRIMARY KEY,
        message_id UUID NOT NULL UNIQUE,
        text TEXT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        user_id VARCHAR(100),
        metadata JSONB
      );

Rename .env.example to .env and fill it up with your database information as well as the `CRYPT_KEY` using:

```
const key = crypto.randomBytes(32).toString('base64');
console.log(key) // prints your key, just copy-paste it into the .env file
```

and the `REDIS_URL` if you have a website, otherwise just use `127.0.0.1:PORT` where `PORT` is your desired port.

Run and profit?
