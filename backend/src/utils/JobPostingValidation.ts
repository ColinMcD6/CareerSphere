import z from "zod";

const MIN_TITLE_LENGTH = 10;
const MAX_TITLE_LENGTH = 150;

const MAX_DESCRIPTION_LENGTH = 20000;
const MIN_DESCRIPTION_LENGTH = 50;

const MAX_POSITION_LENGTH = 100;
const MIN_POSITION_LENGTH = 5;

// Check for dates
const dateChecker = (value: string | undefined, ctx: z.RefinementCtx) => {
  {
    if (value === undefined)
      return true;

    // Check 1: Valid date format
    if (isNaN(Date.parse(value))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid date`,
      });
    }

    // Check 2: Date must be in the future
    if (new Date(value) <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Date must be in the future`,
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date must be in DD-MM-YYYY format",
        path: ["startDate"],
      });
    }
  }
}

export const JobPostingValidation = z.object({
  title: z.string().min(MIN_TITLE_LENGTH, `Title length must be a minimum of ${MIN_TITLE_LENGTH} characters long`).max(MAX_TITLE_LENGTH, `Title length can be a maximum of ${MAX_TITLE_LENGTH} characters long`),
  positionTitle: z.string().min(MIN_POSITION_LENGTH, `Position Title must have a minimum of ${MIN_POSITION_LENGTH} characters`).max(MAX_DESCRIPTION_LENGTH, `Position Title can have a maximum of ${MAX_POSITION_LENGTH} characters`),
  description: z.string().min(MIN_DESCRIPTION_LENGTH, `Description must have a minimum of ${MIN_DESCRIPTION_LENGTH} characters`).max(MAX_DESCRIPTION_LENGTH, `Description can have a maximum of ${MAX_DESCRIPTION_LENGTH} characters`),
  employer: z.string().min(1).max(225),
  employerId: z.string().min(1).max(225),
  location: z.string().min(1, "Location must have at least 1 character").max(225),
  compensationType: z.enum(['do-not-disclose', 'hourly', 'salary']),
  category: z.number(),
  salary: z.number().min(0, "Salary value must be greater than 0"),
  experience: z.array(z.string()),
  skills: z.array(z.string()),
  education: z.array(z.string()),
  status: z.string().min(1).max(225),
  jobType: z.enum(['Full-time', 'Part-time', 'Temporary', 'Internship']),
  startDate: z.string().optional().superRefine(dateChecker),
  dueDate: z.string().optional().superRefine(dateChecker)
});

export default JobPostingValidation;