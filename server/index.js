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
  try {
    const result = await pool.query(
      `
      SELECT 
        m.id,
        m.name AS meeting_name,
        m.lieu AS meeting_lieu,
        m.date AS meeting_date,
        m.time AS meeting_time,
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

// récupération des utilisateurs pour la réunion
app.get("/users-meeting/:id", async (req, res) => {
  const meetingId = req.params.id;
  console.log("ID de la réunion reçu : ", meetingId);
  try {
    const result = await pool.query(
      `SELECT m.id AS usersmeeting_id,
        json_agg(
          json_build_object(
            'id', u.id,
            'firstname', u.firstname,
            'lastname', u.lastname,
            'sgid', u.sgid  -- <<=== AJOUT ici
          )
        ) AS participants
      FROM public."UsersMeeting" ur 
      JOIN public."Users" u ON ur.iduser = u.id
      JOIN public."Meetings" m ON ur.idmeeting = m.id
      WHERE m.id = $1
      GROUP BY m.id;`,
      [meetingId]
    );
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs", error);
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
  const {
    meeting_name,
    meeting_lieu,
    meeting_date,
    meeting_time,
    participants,
    teams,
    createdby,
  } = req.body;

  // la je vérifie si tous les champs requis sont remplis
  if (
    !meeting_name ||
    !meeting_lieu ||
    !meeting_date ||
    !meeting_time ||
    // et si au moins un participant ou une équipe est sélectionné
    ((!participants || participants.length === 0) &&
      (!teams || teams.length === 0)) ||
    !createdby ||
    !createdby.firstname ||
    !createdby.lastname
  ) {
    return res.status(400).json({
      message:
        "Tous les champs requis (nom, lieu, date, heure, créateur) doivent être remplis, et au moins un participant ou une équipe doit être sélectionné.",
    });
  }

  try {
    // Trouver l'ID du créateur par rapport à son nom et prénom
    const creatorRes = await pool.query(
      `SELECT id FROM public."Users" WHERE firstname = $1 AND lastname = $2`,
      [createdby.firstname, createdby.lastname]
    );

    if (creatorRes.rows.length === 0) {
      return res.status(404).json({ message: "Créateur non trouvé" });
    }

    // du coup si un créateur est trouvé on récupère son id on à le stock dans cette variable
    const creatorId = creatorRes.rows[0].id;
    // Insértion de la réunion dans la table "Meetings"
    const result = await pool.query(
      `INSERT INTO public."Meetings"("name", "lieu", "date", "time", "createdby")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING "id"`,
      // la je renvoie l'id de la réunion
      // pour pouvoir l'utiliser après pour ajouter les participants et les équipes
      [meeting_name, meeting_lieu, meeting_date, meeting_time, creatorId]
    );

    // la du coup je récupère l'id de la réunion
    const meetingId = result.rows[0].id;

    // la je créer un ensemble avec un Set pour stocker les ID des participants
    const uniqueParticipantIds = new Set();

    // si des participants sont fournis
    if (participants && participants.length > 0) {
      // je parcours le tableau des participants
      for (const participant of participants) {
        // et je fais une requête pour trouver l'id de chaque participant
        // en fonction de son nom et prénom
        const userRes = await pool.query(
          `SELECT id FROM public."Users" WHERE firstname = $1 AND lastname = $2`,
          [participant.firstname, participant.lastname]
        );

        // si l'utilisateur est trouvé
        if (userRes.rows.length > 0) {
          // je l'ajoute à l'ensemble avec son id
          uniqueParticipantIds.add(userRes.rows[0].id);
        } else {
          // sinon j'envoie un avertissement dans la console
          console.warn(
            `Participant non trouvé: ${participant.firstname} ${participant.lastname}`
          );
        }
      }
    }
    // si des équipes sont fournies
    if (teams && teams.length > 0) {
      // je fais une requête pour trouver les membres de chaque équipe
      // en utilisant l'id de l'équipe
      // et je récupère tous les id des membres de l'équipe
      // en utilisant la clause ANY pour vérifier si l'id de l'équipe est dans le tableau des équipes
      const teamMembersRes = await pool.query(
        `SELECT user_id FROM public."UsersTeam" WHERE team_id = ANY($1)`,
        [teams]
      );

      // la je parcours le tableau des équipes
      teamMembersRes.rows.forEach((row) => {
        // et j'ajoute chaque membre de l'équipe à l'ensemble
        // en utilisant son id
        // et vu que je fais un Set il ne peut y'avoir aucun doublon
        // du coup si un utilisateur est déjà membre d'une autre équipe il ne sera ajouté qu'une seule fois
        uniqueParticipantIds.add(row.user_id);
      });
    }
    // donc la je parcours tous les id qui sont stockés dans l'ensemble uniqueParticipantIds
    for (const userId of uniqueParticipantIds) {
      const existingEntry = await pool.query(
        // et pour chaque id je vérifie si il existe déjà dans la table UsersMeeting
        `SELECT 1 FROM public."UsersMeeting" WHERE idmeeting = $1 AND iduser = $2`,
        [meetingId, userId]
      );

      // si il n'existe pas je l'ajoute
      if (existingEntry.rows.length === 0) {
        await pool.query(
          `INSERT INTO public."UsersMeeting"("idmeeting", "iduser")
               VALUES ($1, $2)`,
          [meetingId, userId]
        );
      }
    }
    res.status(201).json({
      message: "Réunion créée avec succès",
      meetingId: meetingId,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la réunion", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la création de la réunion" });
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
       array_agg(u.firstname || ' ' || u.lastname) AS members_full_name,
       leader.firstname || ' ' || leader.lastname AS leader_full_name
       FROM public."Teams" t
       LEFT JOIN public."UsersTeam" ut ON t.id = ut.team_id
       LEFT JOIN public."Users" u ON ut.user_id = u.id
       LEFT JOIN public."Users" leader ON t.leader_id = leader.id
       GROUP BY t.id, t.name, leader.firstname, leader.lastname, t.colors
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

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
