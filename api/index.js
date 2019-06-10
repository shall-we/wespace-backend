const UserAPI = require("./user");
const FolderAPI = require("./folder");
const NoteAPI = require("./note");
const NoticeAPI = require("./notice");
const AttachmentAPI =require('./attachment');
const Common = require('./common');


let router = require("express").Router();

router.all("/*", Common.checkToken);

// user
router.post("/join", UserAPI.register);
router.post("/login", UserAPI.login);
router.get("/user", UserAPI.getUserList);
router.get("/autoLogin", UserAPI.autoLogin);
router.get("/logout", UserAPI.logout);
// folder
router.post("/folder", FolderAPI.register);

router.post("/folder/shared", FolderAPI.share);
router.delete("/folder/shared/:folder_id/:user_id", FolderAPI.unshare);

router.get("/folder/shared", FolderAPI.getSharedList);
router.get("/folder/private", FolderAPI.getPrivateList);
router.delete("/folder/:id", FolderAPI.delete);
router.patch("/folder/:id/:name", FolderAPI.updateFolderName);

// note
router.get("/note/list", NoteAPI.getNoteList);
router.post("/note",NoteAPI.register);
router.patch("/note/:id/:name",NoteAPI.updateNoteName);
router.patch("/note/status/:id/:status",NoteAPI.setStatus);



// notice
router.post("/notice",NoticeAPI.create);
router.get("/notice",NoticeAPI.getNoticeList);
router.patch("/notice/:to/:object/:type", NoticeAPI.updateNoticeList);


router.post("/attachment/create/:note_id", AttachmentAPI.create);
router.delete("/attachment/:id", AttachmentAPI.delete);
router.get("/attachment/list", AttachmentAPI.getAttachmentList);
router.post("/attachment/download", AttachmentAPI.downloadAttachment);


module.exports = router;
