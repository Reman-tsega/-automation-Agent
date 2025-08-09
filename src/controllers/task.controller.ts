import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { AgentService } from "../services/agent.service";
import { LoggerService } from "../utils/logger";
import { Task } from "../types/task";

export class TaskController {
  constructor(
    private agentService: AgentService,
    private logger: LoggerService
  ) {}

  async checkHealth(req: Request, res: Response): Promise<void> {
    res.status(200).json({ status: "OK" });
  }

  async createMeeting(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validations = [
        body("title").isString().notEmpty().withMessage("Title is required"),
        body("date")
          .isISO8601()
          .withMessage("Date must be a valid ISO 8601 date"),
        body("participants")
          .isArray({ min: 1 })
          .withMessage("Participants must be an array with at least one email"),
        body("participants.*")
          .isEmail()
          .withMessage("Each participant must be a valid email address"),
      ];

      await Promise.all(validations.map((validation) => validation.run(req)));

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const taskDescription = `Schedule meeting "${req.body.title}" on ${
        req.body.date
      } with participants: ${req.body.participants.join(", ")}`;

      const task: Task = {
        description: taskDescription,
        priority: req.body.priority || 1,
        type: "meeting",
        status: "pending",
      };
      await this.agentService.handleAgentTask(task);
      res.status(200).json({ status: "success" });
    } catch (err) {
      next(err);
    }
  }

  async sendEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validations = [
        body("to").isEmail().withMessage('Valid "to" email is required'),
        body("subject")
          .isString()
          .notEmpty()
          .withMessage("Subject is required"),
        body("body").isString().notEmpty().withMessage("Body is required"),
        body("priority")
          .optional()
          .isInt({ min: 1, max: 5 })
          .withMessage("Priority must be between 1 and 5"),
      ];

      await Promise.all(validations.map((v) => v.run(req)));

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const description = `Send email to ${req.body.to} with subject "${req.body.subject}" and body "${req.body.body}"`;

      const task: Task = {
        description,
        priority: req.body.priority || 1,
        type: "email",
        status: "pending",
      };
      await this.agentService.handleAgentTask(task);
      res.status(200).json({ status: "success" });
    } catch (err) {
      next(err);
    }
  }

  async processNLP(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await body("command")
        .isString()
        .notEmpty()
        .withMessage("Command is required")
        .run(req);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const response = await this.agentService.processNaturalLanguage(
        req.body.command
      );
      res.status(200).json({ response });
    } catch (err) {
      next(err);
    }
  }

  async getTaskHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tasks = this.agentService.getTaskHistory();
      res.status(200).json({ tasks });
    } catch (err) {
      next(err);
    }
  }
}
