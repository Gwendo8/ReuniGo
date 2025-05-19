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
      `SELECT id, name, path FROM public."FilesMeeting" WHERE id_meeting = $1`,
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

  // Convertir les participants et équipes en objets/array
  const participants = req.body.participants
    ? JSON.parse(req.body.participants)
    : [];
  const teams = req.body.teams ? JSON.parse(req.body.teams) : [];

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
    const creatorRes = await pool.query(
      `SELECT id FROM public."Users" WHERE firstname = $1 AND lastname = $2`,
      [parsedCreator.firstname, parsedCreator.lastname]
    );

    if (creatorRes.rows.length === 0) {
      return res.status(404).json({ message: "Créateur non trouvé" });
    }

    const creatorId = creatorRes.rows[0].id;

    const result = await pool.query(
      `INSERT INTO public."Meetings"("name", "lieu", "date", "time", "createdby")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING "id"`,
      [meeting_name, meeting_lieu, meeting_date, meeting_time, creatorId]
    );

    const meetingId = result.rows[0].id;
    const uniqueParticipantIds = new Set();

    if (participants) {
      for (const participant of participants) {
        const userRes = await pool.query(
          `SELECT id FROM public."Users" WHERE firstname = $1 AND lastname = $2`,
          [participant.firstname, participant.lastname]
        );
        if (userRes.rows.length > 0) {
          uniqueParticipantIds.add(userRes.rows[0].id);
        }
      }
    }

    if (teams) {
      const teamMembersRes = await pool.query(
        `SELECT user_id FROM public."UsersTeam" WHERE team_id = ANY($1)`,
        [teams]
      );
      teamMembersRes.rows.forEach((row) => {
        uniqueParticipantIds.add(row.user_id);
      });
    }

    for (const userId of uniqueParticipantIds) {
      await pool.query(
        `INSERT INTO public."UsersMeeting"("idmeeting", "iduser")
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [meetingId, userId]
      );
    }

    // ✅ Gestion sécurisée des fichiers multiples
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const files = req.files?.files;
    if (files) {
      const fileArray = Array.isArray(files) ? files : [files];
      for (const file of fileArray) {
        const filePath = path.join(uploadDir, file.name);
        await file.mv(filePath);

        await pool.query(
          `INSERT INTO public."FilesMeeting" (name, path, id_meeting)
           VALUES ($1, $2, $3)`,
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
  const id = req.params.id;
  try {
    // On supprimer d'abord les participants de la réunion
    await pool.query(`DELETE FROM public."UsersMeeting" WHERE idmeeting = $1`, [
      id,
    ]);
    // Ensuite on supprime la réunion elle-même
    const result = await pool.query(
      `DELETE FROM public."Meetings" WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Réunion non trouvée" });
    }
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
    if (role !== "ADMIN" && creatorId !== parseInt(userId)) {
      return res.status(403).json({
        message: "Vous n'êtes pas autorisé à supprimer cette réunion",
      });
    }
    // D'abord on supprime les participants de la réunion
    await pool.query(`DELETE FROM public."UsersMeeting" WHERE idmeeting = $1`, [
      id,
    ]);
    // Ensuite, on supprime la réunion elle-même
    await pool.query(`DELETE FROM public."Meetings" WHERE id = $1`, [id]);
    res.status(200).json({ message: "Réunion supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la réunion", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la suppression de la réunion" });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
