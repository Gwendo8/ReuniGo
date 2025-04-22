import express from "express";
import pkg from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Pool } = pkg;

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "azerty",
  database: "Carder",
  port: 5432,
});

const JWT_SECRET = "votre_cle_secrete";

// inscription
app.post("/register", async (req, res) => {
  const { firstname, lastname, sgid, password, mail } = req.body;

  if (!firstname || !lastname || !sgid || !password || !mail) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  try {
    const checkEmail = await pool.query(
      `SELECT * FROM public."Users" WHERE "mail" = $1`,
      [mail]
    );
    if (checkEmail.rows.length > 0) {
      return res.status(401).json({ message: "Email déja utilisé" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      `INSERT INTO public."Users"("firstname","lastname","sgid","mail","password","idrole") VALUES ($1,$2,$3,$4,$5,$6) RETURNING "id"`,
      [firstname, lastname, sgid, mail, hashedPassword, 1]
    );
    res.status(201).json({
      message: "Utilisateur crée avec succès !",
      userId: newUser.rows[0].id,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription", error);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
});

// connexion
app.post("/login", async (req, res) => {
  const { sgid, password } = req.body;
  // requête pour récupérer l'utilisateur par son sgid
  try {
    const result = await pool.query(
      `
      SELECT u.*, r.name AS rolename
      FROM public."Users" u
      JOIN public."Roles" r ON u."idrole" = r."id"
      WHERE u."sgid" = $1;`,
      [sgid]
    );
    // récupération des infos de l'utilisateur
    const user = result.rows[0];
    // vérification de l'existence de l'utilisateur
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    // comparaison entre le mot de passe saisi et le mot de passe dans la base de donnée
    const isGood = await bcrypt.compare(password, user.password);
    // si le mot de passe est incorrect
    // on renvoie une erreur 401
    if (!isGood) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }
    // construction de la réponse du serveur
    // donc on stock toutes ses informations dans le token
    // ce qui veux dire que toutes ses informations vont être enregistré dedans
    const token = jwt.sign(
      {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        sgid: user.sgid,
        mail: user.mail,
        rolename: user.rolename,
      },
      JWT_SECRET,
      // la je dis que le token expire après 7 jours
      // ce qui signifie que l'utilisateur devra se reconnecter 7 jours après
      { expiresIn: "7d" }
    );
    console.log("✅ Utilisateur connecté :", {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      mail: user.mail,
      rolename: user.rolename,
      token: token,
    });
    res.status(200).json({ token }); // <-- renvoie le token au front
  } catch (error) {
    console.error("Erreur lors de la connexion", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// récupération des utilisateurs
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.lastname, u.firstname, u.sgid, u.idrole, u.mail, u.password, r.name as rolename FROM public."Users" u JOIN public."Roles" r ON u."idrole" = r."id";`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récuparation des utilisateurs", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// récuparation des rôles
app.get("/roles", async (req, res) => {
  try {
    const result = await pool.query(`SELECT name FROM public."Roles"`);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récuparation des rôles", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ajouter un utilisateur admin
app.post("/admin-create", async (req, res) => {
  const { firstname, lastname, sgid, password, mail, idrole } = req.body;
  if (!firstname || !lastname || !sgid || !password || !mail || !idrole) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }
  try {
    const roleResult = await pool.query(
      `SELECT id FROM public."Roles" WHERE name = $1`,
      [idrole]
    );

    if (roleResult.rows.length === 0) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }
    const roleId = roleResult.rows[0].id;

    const sgidExists = await pool.query(
      `SELECT * FROM public."Users" WHERE sgid = $1`,
      [sgid]
    );
    if (sgidExists.rows.length > 0) {
      return res.status(409).json({ message: "SGID déjà utilisé" });
    }

    const existing = await pool.query(
      `SELECT * FROM public."Users" WHERE "mail" = $1`,
      [mail]
    );
    if (existing.rows.length > 0) {
      return res.status(410).json({ message: "Email déjà utilisé" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO public."Users"("firstname","lastname","sgid","mail","password","idrole") VALUES ($1,$2,$3,$4,$5,$6) RETURNING "id"`,
      [firstname, lastname, sgid, mail, hashed, roleId]
    );
    res
      .status(201)
      .json({ message: "Utilisateur créé", userId: result.rows[0].id });
  } catch (err) {
    console.error("Erreur création user admin :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// modifier un utilisateur admin
// id ici représente le sgid de l'utilisateur
app.put("/admin-update/:id", async (req, res) => {
  // je récupère l'id de l'utilisateur depuis les paramètres de l'URL
  const id = req.params.id;
  const { firstname, lastname, password, mail, idrole } = req.body;

  try {
    // d'abord je vérifie si le rôle existe
    const roleResult = await pool.query(
      `SELECT id FROM public."Roles" WHERE name = $1`,
      [idrole]
    );
    // si il n'existe pas je renvoie une erreur 404
    if (roleResult.rows.length === 0) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }
    // la je récupère l'id du rôle
    const roleId = roleResult.rows[0].id;

    let hashedPassword;
    // si un nouveau mot de passe a été fourni
    if (password && password.trim() !== "") {
      // je hash ce mot de passe
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      // sinon je récupère l'ancien
      const userResult = await pool.query(
        `SELECT password FROM public."Users" WHERE sgid = $1`,
        [id]
      );
      // si l'utilisateur n'existe pas on renvoie une erreur 404
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      // on garde l'ancien mot de passe
      hashedPassword = userResult.rows[0].password;
    }

    const result = await pool.query(
      // dans cette requête je renvoie toutes les informations de la modifications
      `UPDATE public."Users" 
       SET firstname = $1, lastname = $2, password = $3, mail = $4, idrole = $5 
       WHERE sgid = $6 RETURNING *`,
      [firstname, lastname, hashedPassword, mail, roleId, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Récupérer le nom du rôle mis à jour
    const updatedRoleResult = await pool.query(
      `SELECT name FROM public."Roles" WHERE id = $1`,
      [roleId]
    );
    const updatedRoleName = updatedRoleResult.rows[0].name;

    // Vu que je renvoie toutes les informations avec ma requêtes
    // je créer un nouveau token avec les nouvelles informations
    const updatedUser = result.rows[0];
    const newToken = jwt.sign(
      {
        id: updatedUser.id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        sgid: updatedUser.sgid,
        mail: updatedUser.mail,
        rolename: updatedRoleName,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // et je renvoie le nouveau token dans la réponse
    res.status(200).json({
      message: "Utilisateur modifié avec succès",
      token: newToken,
    });
  } catch (error) {
    console.error("Erreur lors de la modification de l'utilisateur", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// supprimer un utilisateur
app.delete("/admin-delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `DELETE FROM public."Users" WHERE sgid = $1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

////////////////// REUNIONS

// récupéreation des réunions

app.get("/meetings", async (req, res) => {
  const userId = req.query.id;
  try {
    const result = await pool.query(
      `
      SELECT 
        m.name AS meeting_name,
        m.lieu AS meeting_lieu,
        m.date AS meeting_date,
        creator.lastname || ' ' || creator.firstname AS creator_name,  
        STRING_AGG(participant.lastname || ' ' || participant.firstname, ', ') AS participants_names
      FROM public."Meetings" m
      JOIN public."Users" creator ON m.createdby = creator.id
      LEFT JOIN public."UsersMeeting" um ON um.idmeeting = m.id
      LEFT JOIN public."Users" participant ON um.iduser = participant.id
      WHERE m.createdby = $1
         OR m.id IN (
           SELECT idmeeting FROM public."UsersMeeting" WHERE iduser = $2
         )
      GROUP BY m.id, creator.lastname, creator.firstname;
      `,
      [userId, userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des réunions", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
