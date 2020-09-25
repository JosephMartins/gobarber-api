import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../service/CreateUserService';
import UpdateUserAvatarService from '../service/UpdateAvatarUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({ name, email, password });

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, resopnse) => {
    try {
      const { filename } = request.file;
      const { id } = request.user;

      const updateUserAvatarService = new UpdateUserAvatarService();

      const user = await updateUserAvatarService.execute({
        avatarFileName: filename,
        user_id: id,
      });

      return resopnse.json({ user });
    } catch (err) {
      return resopnse.json({ error: err.message });
    }
  },
);

export default usersRouter;
