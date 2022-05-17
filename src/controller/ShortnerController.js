import crypto from 'crypto';
import parser from 'ua-parser-js';

import ShortnerModel from '../model/ShortnerModel.js';

class ShortnerController {
  async getOne(request, response) {
    const { id } = request.params;

    try {
      const shortner = await ShortnerModel.findById(id);

      if (!shortner) {
        return response.status(404).json({ message: 'Shortner not found' });
      }

      response.json(shortner);
    } catch (error) {
      console.error(error);

      response.status(400).json({ message: 'Something bad happened...' });
    }
  }

  async index(request, response) {
    const shortners = await ShortnerModel.find();

    response.json({ items: shortners });
  }

  async store(request, response) {
    const { link = '' } = request.body;

    if (!link.trim()) {
      return response.status(400).json({ message: 'Link is missing' });
    }

    try {
      const [hash] = crypto.randomUUID().split('-');

      const shortner = await ShortnerModel.create({
        link,
        hash,
        ownerId: request.loggedUser.id,
      });

      response.status(201).json({ message: 'Shortner created', shortner });
    } catch (error) {
      console.error(error);

      response.status(400).json({ message: 'Shortner not created' });
    }
  }

  async update(request, response) {
    const { link } = request.body;
    const { id } = request.params;

    try {
      const shortner = await ShortnerModel.findByIdAndUpdate(
        id,
        { link },
        { new: true }
      );

      if (!shortner) {
        return response.status(404).json({ message: 'Shortner not found' });
      }

      response.json(shortner);
    } catch (error) {
      console.error(error);

      response.status(400).json({ message: 'Something bad happened' });
    }
  }

  async remove(request, response) {
    const { id } = request.params;

    try {
      const shortner = await ShortnerModel.findById(id);

      if (!shortner) {
        return response.status(404).json({ message: 'Shortner not found' });
      }

      await shortner.remove();

      response.json({ message: 'Shortner removed' });
    } catch (error) {
      console.error(error);

      response.status(400).json({ message: 'Something bad happened' });
    }
  }

  async redirect(request, response) {
    const { hash } = request.params;

    const shortner = await ShortnerModel.findOne({ hash });

    if (!shortner) {
      return response.redirect('/');
    }

    const metadata = {
      ip: request.ip,
      parser: parser(request.headers['user-agent']),
    };

    shortner.hits += 1;
    shortner.metatada = [...shortner.metadata, metadata];

    await shortner.save();

    response.redirect(shortner.link);
  }
}

export default ShortnerController;
