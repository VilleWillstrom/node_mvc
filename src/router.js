import { Router } from "express";
import PasteController from "./controllers/paste.js";
import NoteController from './controllers/note.js';
import { catchError } from "./middlewares/error.js";

const router = new Router();

router.get("/", [PasteController.getAllPastes, catchError]);
router.get("/paste/:id", [PasteController.getPaste, catchError]);
router.get("/paste", PasteController.getCreateNewPaste);
router.post("/paste", [PasteController.postCreateNewPaste, catchError]);
router.get("/delete/:id", [PasteController.deletePaste, catchError]);

router.get("/notes", [NoteController.getAllNotes, catchError]);
router.get("/note/:id", [NoteController.getNote, catchError]);
router.get("/note", [NoteController.getCreateNewNote]);//ei tarvitse catchErroria, koska ei ole asynkroninen operaatio ja oletuksena onnistuu aina
router.post("/note", [NoteController.postCreateNewNote, catchError]);
router.get("/delete_note/:id", [NoteController.deleteNote, catchError]);
router.get("/edit/:id", [NoteController.getEditNote, catchError]);
router.post("/edit/:id", [NoteController.postEditNote, catchError]);

export default router;