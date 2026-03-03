import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import Event from "../models/Event";

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, date, location } = req.body;

    let imageUrl = "";

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload_stream(
        { folder: "code-rangers-events" },
        async (error, result) => {
          if (error) {
            res.status(500).json({ message: "Image upload failed" });
            return;
          }

          imageUrl = result?.secure_url || "";

          const event = await Event.create({
            title,
            description,
            date,
            location,
            image: imageUrl,
          });

          res.status(201).json(event);
        }
      );

      uploaded.end(req.file.buffer);
    } else {
      const event = await Event.create({
        title,
        description,
        date,
        location,
      });

      res.status(201).json(event);
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json(event);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const { title, description, date, location } = req.body;

    if (req.file) {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "code-rangers-events" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      event.image = result.secure_url;
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    const updated = await event.save();

    res.status(200).json(updated);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    await event.deleteOne();

    res.status(200).json({ message: "Event deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
};