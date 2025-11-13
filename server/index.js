import express from "express";
import pkg from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fileUpload from "express-fileupload";
import path from "path";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pkg;

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("❌ Erreur connexion Neon :", err);
  else console.log("✅ Connexion Neon OK :", res.rows[0]);
});

// clé token JWT
const JWT_SECRET = process.env.JWT_SECRET;

//clé api pour l'envoi d'email
sgMail.setApiKey(process.env.SENDGRID_API);

app.get("/", (req, res) => {
  res.send("API ReuniGo OK");
});

// route pour envoyer un mail de la page contact
app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).send("Tous les champs sont requis.");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(401).send("Adresse email invalide.");
  }
  const msg = {
    // sa c'est l'adresse mail qui va recevoir le mail
    to: [{ email: "gwendolinedardari7@gmail.com" }],
    // et sa c'est l'adresse mail vérifiée par SendGrid
    // qui va envoyer le mail
    from: "gwendolinedardari7@gmail.com",
    subject,
    // au cas où si le client mail ne supporte pas le HTML
    text: `Message de ${name} <${email}>\n\n${message}`,
    // un peu de style pour le mail
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #333;">Nouveau message de ${name}</h2>
      <p><strong>Email de :</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Sujet :</strong> ${subject}</p>
      <hr style="margin: 20px 0;" />
      <p>${message.replace(/\n/g, "<br>")}</p>
    </div>
  `,
  };
  try {
    await sgMail.send(msg);
    res.status(200).send("Email envoyé avec succès");
  } catch (error) {
    console.error(error.response.body);
    res.status(500).send("Erreur lors de l'envoi de l'email");
  }
});

// fonction pour générer un mot de passe aléatoire
function generateRandomPassword() {
  const alphabet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const numbers = "0123456789";
  let password = "";
  for (let i = 0; i < 6; i++) {
    password += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  return password;
}

// route pour le mot de passe oublié
app.post("/forgot-password", async (req, res) => {
  const { mail } = req.body;
  if (!mail) {
    return res.status(400).json({ message: "Veuillez renseigner votre mail" });
  }
  const checkedMail = await pool.query(
    'SELECT * FROM public."Users" WHERE mail = $1',
    [mail]
  );
  if (checkedMail.rows.length === 0) {
    return res
      .status(404)
      .json({ message: "Aucun compte n'existe pour cette email" });
  }
  const newPassword = generateRandomPassword();
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await pool.query(`UPDATE public."Users" SET password = $1 WHERE mail = $2`, [
    hashedNewPassword,
    mail,
  ]);

  const msg = {
    to: [{ email: mail }],
    from: "gwendolinedardari7@gmail.com",
    subject: "Réinitialisation de votre mot de passe",
    text: `Votre nouveau mot de passe est : ${newPassword}\nVeuillez le changer après connexion.`,
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; background-color: #f9f9f9;">
      <h2 style="color: #2c3e50;">Réinitialisation de mot de passe</h2>
      <p style="font-size: 16px; color: #333;">
        Bonjour,<br><br>
        Vous avez demandé la réinitialisation de votre mot de passe. Voici votre nouveau mot de passe temporaire :
      </p>
      <p style="font-size: 18px; font-weight: bold; color: #e74c3c;">${newPassword}</p>
      <p style="font-size: 14px; color: #555;">
        Veuillez vous connecter avec ce mot de passe puis le modifier dans votre profil pour garantir la sécurité de votre compte.
      </p>
      <hr style="margin: 20px 0;" />
      <p style="font-size: 12px; color: #999;">
        Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.
      </p>
    </div>
  `,
  };
  try {
    await sgMail.send(msg);
    res.status(200).send("Email envoyé avec succès");
  } catch (error) {
    console.error(error.response.body);
    return res.status(500).send("Erreur lors de l'envoi de l'email");
  }
});

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
  const sgid = req.params.id;
  try {
    // Récupérer l'id de l'utilisateur à partir du sgid
    const userResult = await pool.query(
      `SELECT id FROM public."Users" WHERE sgid = $1`,
      [sgid]
    );
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const userId = userResult.rows[0].id;
    // On supprime d'abord les dépendances dans UsersMeeting
    await pool.query(`DELETE FROM public."UsersMeeting" WHERE iduser = $1`, [
      userId,
    ]);
    // Ensuite on supprime les dépendances dans UsersTeam
    await pool.query(`DELETE FROM public."UsersTeam" WHERE user_id = $1`, [
      userId,
    ]);
    // Puis on supprime l'utilisateur
    const deleteResult = await pool.query(
      `DELETE FROM public."Users" WHERE id = $1 RETURNING *`,
      [userId]
    );
    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// récupération des informations de l'utilisateur connecté
app.get("/user-info/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (userId === null || userId === undefined) {
    return res.status(400).json({ message: "ID utilisateur manquant" });
  }
  try {
    const result = await pool.query(
      `SELECT id, firstname, lastname, mail, password FROM public."Users" WHERE id =$1`,
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations de l'utilisateur",
      error
    );
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// modification des informations de l'utilisateur connecté
app.put("/update-user-info/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { firstname, lastname, mail, password } = req.body;
  try {
    let hashedPassword;
    // si un nouveau mot de passe a été fourni
    if (password && password.trim() !== "") {
      // je hash ce mot de passe
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      // sinon je récupère l'ancien
      const userResult = await pool.query(
        `SELECT password FROM public."Users" WHERE id = $1`,
        [userId]
      );
      // si l'utilisateur n'existe pas on renvoie une erreur 404
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      // on garde l'ancien mot de passe
      hashedPassword = userResult.rows[0].password;
    }
    const result = await pool.query(
      `UPDATE public."Users" SET firstname = $1, lastname = $2, mail = $3, password = $4 WHERE id = $5 RETURNING *`,
      [firstname, lastname, mail, hashedPassword, userId]
    );
    const updatedUser = result.rows[0];
    // Récupérer le rôle de l'utilisateur
    // Je récupère le rôle pour permettre le rafraîchissement de la page correctement quand un utilisateur modifie ses infos personnelles
    // Je m'explqique :
    // Si je ne récupère pas le rôle et que l'utilsateur est admin par exemple
    // Quand il va modifier une de ses informations personnelles avec le refresh il ne pourra plus voir les liens vers la page admin et la page stat
    // Car dans le nouveau token le rôle ne sera pas présent et que ses pages ne sont accessibles que pour les personnes qui ont le rôle admin
    const roleResult = await pool.query(
      `SELECT r.name as rolename 
       FROM public."Users" u 
       JOIN public."Roles" r ON u.idrole = r.id 
       WHERE u.id = $1`,
      [userId]
    );

    if (roleResult.rows.length === 0) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }

    const newToken = jwt.sign(
      {
        id: updatedUser.id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        mail: updatedUser.mail,
        rolename: roleResult.rows[0].rolename,
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
    console.error("Erreur lors de la récupération du mot de passe", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

////////////////// REUNIONS
// récupéreation des réunions
app.get("/meetings", async (req, res) => {
  const userId = req.query.id;
  const role = req.query.role; // je récupère le rôle de l'utilisateur
  try {
    let query = `
      SELECT 
        m.id,
        m.name AS meeting_name,
        m.lieu AS meeting_lieu,
        m.date AS meeting_date,
        m.time AS meeting_time,
        m.createdby AS creator_id,
        creator.lastname || ' ' || creator.firstname AS creator_name,  
        STRING_AGG(participant.lastname || ' ' || participant.firstname, ', ') AS participants_names
      FROM public."Meetings" m
      JOIN public."Users" creator ON m.createdby = creator.id
      LEFT JOIN public."UsersMeeting" um ON um.idmeeting = m.id
      LEFT JOIN public."Users" participant ON um.iduser = participant.id
    `;
    // Pour les utilisateurs et les managers, on filtre par userId
    if (role !== "ADMIN") {
      query += `
        WHERE m.createdby = $1 
        OR m.id IN (
          SELECT idmeeting FROM public."UsersMeeting" WHERE iduser = $1
        )
      `;
    }
    query += `
      GROUP BY m.id, creator.lastname, creator.firstname;
    `;
    // La on exécute la requête en y ajoutant des paramètres
    // si le role de l'utilisateur est ADMIN alors on ne met pas de paramètres en mettant un tablea vide
    // sinon on met l'id de l'utilisateur en paramètre
    const result = await pool.query(query, role === "ADMIN" ? [] : [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des réunions", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// récupération des utilisateurs pour la réunion
app.get("/users-meeting/:id", async (req, res) => {
  const meetingId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT m.id AS usersmeeting_id,
        u.id,
        u.firstname,
        u.lastname,
        u.sgid,
        ur.is_present AS present,
        m.createdby AS creator_id
      FROM public."UsersMeeting" ur 
      JOIN public."Users" u ON ur.iduser = u.id
      JOIN public."Meetings" m ON ur.idmeeting = m.id
      WHERE m.id = $1;`,
      [meetingId]
    );

    const participants = result.rows.map((row) => ({
      id: row.id,
      firstname: row.firstname,
      lastname: row.lastname,
      sgid: row.sgid,
      present: row.present,
    }));

    res.json([
      {
        usersmeeting_id: meetingId,
        creatorId: result.rows[0]?.creator_id,
        participants,
      },
    ]);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// récupération des fichiers de la réunion
app.get("/files-meeting/:id", async (req, res) => {
  const meetingId = req.params.id;
  try {
    // ici je récupère que les fichiers de la réunion sélectionnée
    const result = await pool.query(
      `SELECT id, name, path FROM public."FilesMeeting" WHERE idmeeting = $1`,
      [meetingId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des fichiers", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour pouvoir télécharger les fichiers d'une réunion
// filename est un paramètre dynamique pour le nom du fichier à télécharger
app.get("/download-file/:filename", (req, res) => {
  // ici je récupère le nom du fichier depuis l'url
  const filename = req.params.filename;
  // la je construit le chemin vers le fichier à télécharger
  //__dirname est le répertoire courant du fichier dans lequel le script est exécuté
  // uploads le dossier ou les fichiers sont stockés
  // et filename le nom du fichier téléchargé
  const filePath = path.join(__dirname, "uploads", filename);
  console.log("Chemin du fichier :", filePath);
  // fs.existsSync permet de vérifier si le fichier existe sur le serveur
  // donc la je vérifie si le chemin du fichier existe
  if (fs.existsSync(filePath)) {
    // la j'envoie le fichier au client pour qu'il puisse le télécharger
    res.download(filePath);
  } else {
    res.status(404).json({ error: "Fichier non trouvé" });
  }
});

// ici une route patch car la on ne va modifier que la présence d'un utilisateur
// le put sert quand on doit tout modifier
app.patch("/users-meeting/:meetingId/:userId", async (req, res) => {
  const { meetingId, userId } = req.params;
  const { is_present } = req.body;
  try {
    const updateResult = await pool.query(
      `UPDATE public."UsersMeeting" 
       SET is_present = $1 
       WHERE idmeeting = $2 AND iduser = $3 
       RETURNING *;`,
      [is_present, meetingId, userId]
    );
    if (updateResult.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Utilisateur ou réunion introuvable." });
    }
    res.json({
      message: "Statut de présence mis à jour.",
      data: updateResult.rows[0],
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la présence", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/usersmeeting", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, firstname, lastname FROM public."Users"`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ajout d'une réunion
app.post("/add-meeting", async (req, res) => {
  const { meeting_name, meeting_lieu, meeting_date, meeting_time, createdby } =
    req.body;
  // De base les participants et les équipes sont envoyé sous forme de chaine JSON
  // La je convertis les chaines JSON en tableau d'objet
  // Si aucune valeur n'est fournie, je mets un tableau vide
  // J'ai convertis toutes ses données car en front j'utilise un formData pour envoyer les fichiers
  const participants = req.body.participants
    ? JSON.parse(req.body.participants)
    : [];
  const teams = req.body.teams ? JSON.parse(req.body.teams) : [];
  // Pareil ici je convertis la chaine JSON en tableau d'objet
  const parsedCreator = JSON.parse(createdby);
  if (
    !meeting_name ||
    !meeting_lieu ||
    !meeting_date ||
    !meeting_time ||
    (participants.length === 0 && teams.length === 0) ||
    !parsedCreator ||
    !parsedCreator.firstname ||
    !parsedCreator.lastname
  ) {
    return res.status(400).json({
      message:
        "Tous les champs requis (nom, lieu, date, heure, créateur) doivent être remplis, et au moins un participant ou une équipe doit être sélectionné.",
    });
  }
  try {
    // ici je récupère l'id du créateur de la réunion
    const creatorRes = await pool.query(
      `SELECT id FROM public."Users" WHERE firstname = $1 AND lastname = $2`,
      [parsedCreator.firstname, parsedCreator.lastname]
    );

    if (creatorRes.rows.length === 0) {
      return res.status(404).json({ message: "Créateur non trouvé" });
    }

    const creatorId = creatorRes.rows[0].id;
    // La on insère la nouvelle réunion dans la table "Meetings"
    const result = await pool.query(
      `INSERT INTO public."Meetings"("name", "lieu", "date", "time", "createdby")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING "id"`,
      [meeting_name, meeting_lieu, meeting_date, meeting_time, creatorId]
    );

    const meetingId = result.rows[0].id;
    // la je créer une variable pour stocker les id des participants
    // j'utilise un Set pour éviter les doublons
    const uniqueParticipantIds = new Set();

    if (participants) {
      // la je parcours chaque participant
      for (const participant of participants) {
        // ici je récupère l'id de chaque participant
        const userRes = await pool.query(
          `SELECT id FROM public."Users" WHERE firstname = $1 AND lastname = $2`,
          [participant.firstname, participant.lastname]
        );
        // si un participant est troouvé
        if (userRes.rows.length > 0) {
          // j'ajoute ce participant dans le Set uniqueParticipantIds
          uniqueParticipantIds.add(userRes.rows[0].id);
        }
      }
    }
    if (teams) {
      // ici je récupère tous les ids des membres de l'équipe
      const teamMembersRes = await pool.query(
        `SELECT user_id FROM public."UsersTeam" WHERE team_id = ANY($1)`, // ANY permet de vérfier si une ou pluaieurs valeurs sont présentes dans le tableau
        [teams]
      );
      // pour chaque membre de l'équipe
      teamMembersRes.rows.forEach((row) => {
        // on ajoute l'id du membre dans le Set uniqueParticipantIds
        uniqueParticipantIds.add(row.user_id);
      });
    }
    // la je parcours tous les ids des participants uniques
    for (const userId of uniqueParticipantIds) {
      // et j'insère ses ids dans la table UsersMeeting
      // j'utilsie ON CONFLICT DO NOTHING pour éviter les doublons
      await pool.query(
        `INSERT INTO public."UsersMeeting"("idmeeting", "iduser")
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [meetingId, userId]
      );
    }
    // Partie pour l'insertion des fichiers
    // ici je créer le chemin vers le dossier uploads
    // __dirname est le répertoire courant du fichier dans lequel ce code est éxécuté
    // avec /uploads à la fin pour créer le dossier uploads
    const uploadDir = path.join(__dirname, "uploads");
    // la je vérifie si le dossier uploads existe
    if (!fs.existsSync(uploadDir)) {
      // si il n'existe pas je le crée
      fs.mkdirSync(uploadDir);
    }
    // ici je récupère les fichiers envoyés dans la requête si il y'en a
    const files = req.files?.files;
    // du coup si il y'a des fichiers
    if (files) {
      // je vérifie si file est un tableau ou un seul fichier
      // si jamais il n'y a qu'un seul fichier
      // alors il est convertis en un tableau d'un seul élément
      const fileArray = Array.isArray(files) ? files : [files];
      // ici je parcours chaque fichier du tableau de fichiers fileArray
      for (const file of fileArray) {
        // la je créer le chemin complet de la où le fichier sera enregistré
        // en y ajoutant le nom du fichier
        const filePath = path.join(uploadDir, file.name);
        // du coup ici je déplace le fichier téléchargé vers le chemin de filePath
        await file.mv(filePath);
        // et du coup ici j'insère le ou les fichiers dans la table FilesMeeting
        await pool.query(
          `INSERT INTO public."FilesMeeting" (name, path, idmeeting)
           VALUES ($1, $2, $3)`,
          // par le nom du fichier
          // son chemin
          // et l'id de la réunion avec lequel il est associé
          [file.name, filePath, meetingId]
        );
      }
    }
    res.status(201).json({
      message: "Réunion créée avec succès",
      meetingId: meetingId,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la réunion", error);
    res.status(500).json({
      message: "Erreur serveur lors de la création de la réunion",
    });
  }
});

// Supprimer une réunion
app.delete("/delete-meeting/:id", async (req, res) => {
  // req.params.id (id vient de l'url du nom que je donne après le /:)
  const id = req.params.id;
  // le req query permet d'ajouter des paramètres dans l'url
  // par exemple pour le const userId = req.query.userId si jamais mis à la place const userId = req.query.toto dans mon url front j'aurai mit tot et pas userId
  // a voir dans le fichier deleteMeetingFetch.jsx ou il y'a l'url
  const userId = req.query.userId; // Sa représente l'id de l'utilisateur qui fait la demande de suppression
  const role = req.query.role; // Rôle de l'utilisateur (ADMIN ou MANAGER)
  try {
    // La je récupère toutes les informations de la réunion sur laquelle l'utilisateur à cliqué
    const meeting = await pool.query(
      `SELECT * FROM public."Meetings" WHERE id = $1`,
      [id]
    );
    if (meeting.rows.length === 0) {
      return res.status(404).json({ message: "Réunion non trouvée" });
    }
    // dans cette variable je stock l'id du créateur de la réunion
    const creatorId = meeting.rows[0].createdby;

    // la je vérifie si l'utilisateur qui fait la demande de suppression
    // est soit un admin soit le créateur de la réunion
    // si ce n'est pas le cas je renvoie une erreur 403
    if (role !== "ADMIN" && creatorId !== userId) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à supprimer cette réunion",
      });
    }
    // D'abord on supprime les fichiers de la réunion
    await pool.query(`DELETE FROM public."FilesMeeting" WHERE idmeeting = $1`, [
      id,
    ]);
    // Ensuite on supprime les participants de la réunion
    await pool.query(`DELETE FROM public."UsersMeeting" WHERE idmeeting = $1`, [
      id,
    ]);
    // Puis on supprime la réunion elle-même
    const result = await pool.query(
      `DELETE FROM public."Meetings" WHERE id = $1 RETURNING *`,
      [id]
    );
    console.log("Réunion supprimée :", result.rows[0]);
    res.status(200).json({ message: "Réunion supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la réunion", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la suppression de la réunion" });
  }
});

// Afficher les équipes
app.get("/teams", async (req, res) => {
  try {
    const result = await pool.query(`SELECT t.id AS team_id, 
       t.name AS team_name, 
       t.colors AS team_colors,
       t.leader_id AS leader_id,
       array_agg(u.firstname || ' ' || u.lastname) AS members_full_name,
       leader.firstname || ' ' || leader.lastname AS leader_full_name
       FROM public."Teams" t
       LEFT JOIN public."UsersTeam" ut ON t.id = ut.team_id
       LEFT JOIN public."Users" u ON ut.user_id = u.id
       LEFT JOIN public."Users" leader ON t.leader_id = leader.id
       GROUP BY t.id, t.name, t.leader_id, leader.firstname, leader.lastname, t.colors
       ORDER BY t.id;`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des équipes", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Création d'une équipe
app.post("/create-team", async (req, res) => {
  console.log("Route /create-team atteinte");
  console.log("Corps de la requête :", req.body);
  const { teamName, members, colors, creatorId } = req.body;
  // Validation des champs
  if (!teamName || !members || !creatorId || !colors) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }
  try {
    // Insertion du nom de l'équipe dans la table "Teams"
    const newTeamResult = await pool.query(
      `INSERT INTO public."Teams"("name", "leader_id", "colors") VALUES ($1, $2, $3) RETURNING "id"`,
      [teamName, creatorId, colors]
    );
    const teamId = newTeamResult.rows[0].id;
    // Ajouter les membres à la table "TeamMembers"
    for (const memberId of members) {
      await pool.query(
        `INSERT INTO public."UsersTeam"("team_id", "user_id") VALUES ($1, $2)`,
        [teamId, memberId]
      );
    }

    res.status(201).json({ message: "Équipe créée avec succès", teamId });
  } catch (error) {
    console.error("Erreur lors de la création de l'équipe", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la création de l'équipe" });
  }
});

// Récupération des détails d'une équipe
app.get("/teams/:id", async (req, res) => {
  const teamId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT 
        t.id AS team_id,
        t.name AS team_name,
        t.colors AS team_colors,
        t.leader_id,
        CONCAT(leader.firstname, ' ', leader.lastname) AS leadername,
        json_agg(
          json_build_object(
            'id', u.id,
            'firstname', u.firstname,
            'lastname', u.lastname
          )
        ) AS members
      FROM public."Teams" t
      LEFT JOIN public."Users" leader ON t.leader_id = leader.id
      LEFT JOIN public."UsersTeam" ut ON t.id = ut.team_id
      LEFT JOIN public."Users" u ON ut.user_id = u.id
      WHERE t.id = $1
      GROUP BY t.id, leader.id, leader.firstname, leader.lastname`,
      [teamId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Équipe non trouvée" });
    }

    res.json(result.rows[0]);
    console.log("Équipe récupérée avec succès : ", result.rows[0]);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de l'équipe",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Modification d'une équipe
app.put("/update-team/:id", async (req, res) => {
  const teamId = req.params.id;
  const { teamName, members, colors, leaderId } = req.body;
  try {
    // La je récupère les informations actuelle de l'équipe
    const teamResult = await pool.query(
      `SELECT * FROM public."Teams" WHERE id = $1`,
      [teamId]
    );
    // La vérifie si l'équipe existe
    if (teamResult.rows.length === 0) {
      return res.status(404).json({ message: "Équipe non trouvée" });
    }
    // existingTeam contient les informations de l'équipe existante
    const existingTeam = teamResult.rows[0];
    // Utilisation des valeurs existantes si aucune nouvelle valeur n'est fournie
    // la par exemple soit on envoie le nouveau nom soit on garde le nom de base
    const updatedName = teamName || existingTeam.name;
    const updatedColors = colors || existingTeam.colors;
    const updatedLeaderId = leaderId ? leaderId : existingTeam.leader_id;
    // Mise à jour des informations de l'équipe
    await pool.query(
      `UPDATE public."Teams" 
       SET name = $1, colors = $2, leader_id = $3 
       WHERE id = $4`,
      [updatedName, updatedColors, updatedLeaderId, teamId]
    );
    // Si il y'a des membres
    if (members) {
      // la je parcours chaque membre
      const memberIds = members.map((member) => {
        // si le type est un objet avec le champ id
        if (typeof member === "object" && member.id) {
          // je renvoie l'id
          return member.id;
        }
        // sinon je renvoie la valeur directement
        return member;
      });
      // La je récupère les membres actuels de l'équipe
      const currentMembersResult = await pool.query(
        `SELECT user_id FROM public."UsersTeam" WHERE team_id = $1`,
        [teamId]
      );
      // dans currentMembers je tranforme les résultats pour obtenir un tableau d'id
      // je transforme le tableau d'objet en un tableau d'id
      const currentMembers = currentMembersResult.rows.map(
        (row) => row.user_id
      );
      // Méthode pour supprimer les membres d'une équipe
      const membersToRemove = currentMembers.filter(
        // pour chaque id je vérifie si il n'est pas présent dans la nouvelle liste de membre (memberIds)
        // si ce membre n'est plus dans la nouvelle liste, je le garde dans membersToRemove
        (id) => !memberIds.includes(id)
      );
      // Méthode pour ajouter des membres à une équipe
      const membersToAdd = memberIds.filter(
        // pour chaque id je vérifie si il n'est pas présent dans la liste des membres actuels (currentMembers)
        // si ce membre n'est pas dans la liste des membres actuels, je le garde dans membersToAdd
        (id) => !currentMembers.includes(id)
      );
      // La on supprime uniquement les membres qui ne sont plus dans la nouvelle liste
      if (membersToRemove.length > 0) {
        await pool.query(
          `DELETE FROM public."UsersTeam" 
           WHERE team_id = $1 AND user_id = ANY($2::bigint[])`, // ANY permet de vérifier si user_id correspond à l'une des valeurs du tableau
          // et $2::bigint[] permet de convertir la liste des membres en tableau d'entier
          [teamId, membersToRemove]
        );
      }
      // La on ajoute uniquement les membres qui ne sont pas déjà dans la liste des membres actuels
      if (membersToAdd.length > 0) {
        const insertPromises = membersToAdd.map((memberId) =>
          pool.query(
            `INSERT INTO public."UsersTeam"("team_id", "user_id") 
             VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            // ON CONFLICT DO NOTHING permet d'éviter les doublons donc si un utilisateur est déja dans l'équipe on ignore l'insertion
            [teamId, memberId]
          )
        );
        // permet d'attendre que toutes les insertions soient terminées
        await Promise.all(insertPromises);
      }
    }
    res.status(200).json({
      message: "Équipe modifiée avec succès",
      teamId: teamId,
    });
  } catch (error) {
    console.error("Erreur lors de la modification de l'équipe", error);
    res.status(500).json({
      message: "Erreur serveur lors de la modification de l'équipe",
    });
  }
});

// Suppression d'une équipe
app.delete("/delete-team/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query(`DELETE FROM public."UsersTeam" WHERE team_id = $1`, [id]);
    const result = await pool.query(
      `DELETE FROM public."Teams" WHERE id = $1 `,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Equipe non trouvée" });
    }
    res.status(200).json({ message: "Equipe supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'équipe", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la suppression de l'équipe" });
  }
});

///////////////////  STATISTIQUE
// récupération des utilisateurs pas présent au réunion
app.get("/users-presence", async (req, res) => {
  try {
    const userStats = await pool.query(`
      SELECT u.id, u.firstname, u.lastname,
      COUNT(*) FILTER (WHERE um.is_present = false) AS nb_absence
      FROM "UsersMeeting" um
      JOIN "Users" u ON um.iduser = u.id
      GROUP BY u.id, u.firstname, u.lastname;`);

    const totalUsers = await pool.query(`
      SELECT COUNT(DISTINCT iduser) AS total_guest_users FROM "UsersMeeting";
    `);
    res.json({
      users: userStats.rows,
      total_guest_users: totalUsers.rows[0].total_guest_users,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
// récupération des utilisateurs avec le plus d'absences aux réunion
app.get("/users-top-absences", async (req, res) => {
  try {
    const userStats = await pool.query(`SELECT u.id,
    CONCAT(u.firstname, ' ', u.lastname) AS name,
    COUNT(*) FILTER (WHERE um.is_present = false) AS nb_absence
    FROM "UsersMeeting" um
    JOIN "Users" u ON um.iduser = u.id
    GROUP BY u.id, u.firstname, u.lastname
    HAVING COUNT(*) FILTER (WHERE um.is_present = false) >= 1
    ORDER BY nb_absence DESC
    LIMIT 5;`);
    res.json(userStats.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
// récupération du nombre de rôles des utilisateurs
app.get("/users-nb-roles", async (req, res) => {
  try {
    const userStats = await pool.query(`SELECT COUNT(*) AS total_users,
    COUNT(*) FILTER (WHERE r.name = 'ADMIN') AS admin_count,
    COUNT(*) FILTER (WHERE r.name = 'USER') AS user_count,
    COUNT(*) FILTER (WHERE r.name = 'MANAGER') AS manager_count
    FROM public."Users" u
    JOIN public."Roles" r ON u.idrole = r.id;`);
    res.json(userStats.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
// récupération du nombre de réunion
app.get("/nb-meetings", async (req, res) => {
  try {
    // La je récupère le nombre de réunion passé, en cours et futur
    // COUNT va permettre de compter le nombre de ligne
    // donc pour que le premier COUNT on va compter le nombre de réunion qui sera infèrieur à la date actuelle
    // pour le second on va compter le nombre de réunion qui sera égale à la date actuelle
    // et pour le dernier on va compter le nombre de réunion qui sera supérieur à la date actuelle
    const meetingStats = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE date + (time || ' minutes')::interval < CURRENT_TIMESTAMP) AS past_meetings, 
        COUNT(*) FILTER (WHERE date <= CURRENT_TIMESTAMP AND date + (time || ' minutes')::interval >= CURRENT_TIMESTAMP) AS ongoing_meetings,
        COUNT(*) FILTER (WHERE date > CURRENT_TIMESTAMP) AS future_meetings
      FROM public."Meetings";
    `);
    // La je récupère le taux de participation globale aux réunions
    // ROUND va permettre d'arrondir le résultat
    // SUM va permettre de faire la somme des valeurs
    // avec le WHEN je dis que si is_present est vrai alors je compte 1
    // sinon je compte 0
    // et je divise le tout par le nombre total de réunion
    // NULLIF permet d'éviter la division par zéro
    // donc si le nombre de réunion est égal à 0 alors je renvoie NULL
    // si j'avais mit 5 par exemple à la place de 0 sa aurait renvoyé null si le nombre de réunion est égal à 5
    const participationStats = await pool.query(`
      SELECT 
        ROUND(
          100.0 * SUM(CASE WHEN is_present THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0)
        ) AS participation_rate
      FROM public."UsersMeeting";
    `);
    res.json({
      // le premier nom meetinStats est le nom de la variable que moi j'ai choisi elle aurait pu aussi s'appeler toto
      // le second nom meetingStats est le nom de la variable ou je stock les résultats de ma requête sql
      meetingStats: meetingStats.rows,
      // le 3ème nom participation_rate est le nom de la colonne dans ma requête sql
      participationStats: participationStats.rows[0].participation_rate,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
