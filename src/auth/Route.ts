import express from "express";

const router = express.Router();

import { register, login, update, deleteUser } from "./Auth";

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/update').post(update);
router.route('/deleteUser').post(deleteUser);

export default router;