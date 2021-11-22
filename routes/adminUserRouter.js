const express = require("express");
const userRouter = express.Router();
const userAdminCtl = require("../control/userAdminCtl");

//��ʾ�û���Ϣ�б�ҳ��
userRouter.get("/showUserList", userAdminCtl.showUserList);
//��ʾҪ�༭���û���Ϣҳ��
userRouter.get("/showUserOne", userAdminCtl.showUserOne);
//ɾ���û�
userRouter.get("/doDeleteUser", userAdminCtl.doDeleteUser);
//�޸��û���Ϣ
userRouter.post("/doModifyUser", userAdminCtl.doModifyUser);
//�����û���Ϣ
userRouter.post("/doSearchUser", userAdminCtl.doSearchUser);


module.exports = userRouter;