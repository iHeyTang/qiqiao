import knex from "knex";

const pg = knex({
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    user: "qiqiao",
    password: "qiqiao",
    database: "qiqiao",
  },
});

export { pg };
