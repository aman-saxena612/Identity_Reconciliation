import { Request, Response, NextFunction, RequestHandler } from 'express';
import { processIdentifyRequest } from '../service/contactService';

export const identifyContact: RequestHandler = async (req, res, next) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      res.status(400).json({ error: 'At least one of email or phoneNumber is required.' });
      return;
    }

    const result = await processIdentifyRequest(email, phoneNumber);
    res.status(200).json({ contact: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
