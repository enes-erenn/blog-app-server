import mysql, { Connection } from "mysql";

export const db: Connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ankara278",
  database: "blog",
});
