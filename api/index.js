const UserAPI = require("./user");
const FolderAPI = require("./folder");
const NoteAPI = require("./note");
const NoticeAPI = require("./notice");
const AttachmentAPI = require("./attachment");
const AnnouncementAPI = require("./announcement");
const Common = require("./common");

let router = require("express").Router();

router.all("/*", Common.checkToken);

// User
router.post("/join", UserAPI.register);
router.post("/login", UserAPI.login);
router.get("/user", UserAPI.getUserList);
router.get("/autoLogin", UserAPI.autoLogin);
router.get("/logout", UserAPI.logout);

// Folder
router.post("/folder", FolderAPI.register);
router.post("/folder/shared", FolderAPI.share);
router.delete("/folder/shared/:folder_id/:user_id", FolderAPI.unshare);
router.get("/folder/shared", FolderAPI.getSharedList);
router.get("/folder/private", FolderAPI.getPrivateList);
router.delete("/folder/:id", FolderAPI.delete);
router.patch("/folder/:id/:name", FolderAPI.updateFolderName);

// Note
router.get("/note/list", NoteAPI.getNoteList);
router.get("/note/searchlist",NoteAPI.getSearchNoteList);
router.post("/note", NoteAPI.register);
router.patch("/note/:id/:name", NoteAPI.updateNoteName);
router.patch("/note/status/:id/:status", NoteAPI.setStatus);
router.patch("/note/lock/:id/:lock", NoteAPI.setLock);
router.get("/note/lock/", NoteAPI.getLock);

// Notice
router.post("/notice", NoticeAPI.create);
router.get("/notice", NoticeAPI.getNoticeList);
router.patch("/notice/:to/:object/:type", NoticeAPI.updateNoticeList);

// Attachment
router.post("/attachment/create/:note_id", AttachmentAPI.create);
router.delete("/attachment/:id", AttachmentAPI.delete);
router.get("/attachment/list", AttachmentAPI.getAttachmentList);
router.post("/attachment/download", AttachmentAPI.downloadAttachment);

// Announcement
router.get("/admin/announcement", AnnouncementAPI.getAnnouncementList);
router.post("/admin/announcement", AnnouncementAPI.register);
router.get("/admin/announcement/:id", AnnouncementAPI.getAnnouncement);
router.patch("/admin/announcement/:id", AnnouncementAPI.updateAnnouncement);
router.delete("/admin/announcement/:id", AnnouncementAPI.deleteAnnouncement);

router.get("/admin/user", UserAPI.getAllUserList);
router.get("/admin/folder", UserAPI.getAllFolderList);
router.get("/admin/note", UserAPI.getAllNoteList);
router.delete("/admin/user/:id", UserAPI.deleteUser);
router.delete("/admin/note/:id", NoteAPI.permanentDeleteNote);

module.exports = router;
