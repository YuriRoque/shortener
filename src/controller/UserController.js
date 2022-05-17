import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

import UserModel from '../model/UserModel.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const hashPassword = password => {
  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(password, salt);

  return hash;
};

class UserController {
  async index(request, response) {
    const users = await UserModel.find();

    response.send({ users });
  }

  async getOne(request, response) {
    const id = request.params.id;

    try {
      const user = await UserModel.findById(id);

      if (user) {
        return response.send({ user });
      }

      response.status(404).send('User not found');
    } catch (error) {
      console.error(error.stack);

      response.status(400).send({ message: 'An unexpected error happened' });
    }
  }

  async remove(request, response) {
    const id = request.params.id;

    const user = await UserModel.findById(id);

    if (user) {
      await user.remove();

      return response.send({ message: 'User deleted' });
    }

    response.status(404).send({ message: 'User not found' });
  }

  async store(request, response) {
    try {
      const { name, email, password, state, dateBirth, phones } = request.body;

      const user = await UserModel.create({
        name,
        email,
        password: hashPassword(password),
        state,
        dateBirth,
        phones,
      });

      response.send({ message: 'User Created!', user });
    } catch (error) {
      console.log(error);

      response.status(500).send({ message: 'Data invalid' });
    }
  }

  async update(request, response) {
    try {
      const id = request.params.id;

      const { name, email, password, state, dateBirth, phones } = request.body;

      const user = await UserModel.findByIdAndUpdate(
        id,
        {
          name,
          email,
          password: hashPassword(password),
          state,
          dateBirth,
          phones,
        },
        {
          new: true,
        },
      );

      response.send({ message: 'User updated', user: user });
    } catch (error) {
      console.log(error);

      response.status(404).send({ message: 'User not found' });
    }
  }

  async login(request, response) {
    const { email, password } = request.body;
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }

    if (!bcryptjs.compareSync(password, user.password)) {
      return response.status(404).json({ message: 'User not found' });
    }

    // Delete the user password to not pass on into the jwt
    delete user.password;

    const token = jsonwebtoken.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: 60 },
    );

    return response.json({ token });
  }
}

export default UserController;
