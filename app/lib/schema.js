import { z } from "zod";
// import * as z from "zod";

// Onboarding Schema
export const onboardingSchema = z.object({
        industry: z.string({
            required_error:"Please select an industry"
        }),
        subIndustry: z.string({
            required_error:"Please select an subindustry"
        }),
        bio: z.string().max(500).optional(),

        experience: z
        .string()
        .transform((val)=> parseInt(val,10))
        .pipe(
            z
            .number()
            .min(0, "Experience must be at least 0 year")
            .max(50, "Experience can't be exceed 50 year")
        ),
        skills: z
        .string().transform((val)=>
        val
            ? val
                .split(",")
                .map((skills) => skills.trim())
                .filter(Boolean)
            : undefined    
        ),
})
// Form Schema
// Contact Schema
export const contactSchema = z.object({
    email: z.string().email("Invalid email address"),
    mobile: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional()
})

// Work Expi Schema
export const entrySchema = z.object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false),
})
.refine((data) => {
if(!data.current && !data.endDate) return false;

return true;
},{
    message:"End date required unless this is your current position",
    path:["endDate"],
});

// Combine the both Form Schema 
export const resumeSchema = z.object ({
    contactInfo: contactSchema,
    summary: z.string().min(1, "Professional summary is required"),
    skills: z.string().min(1, "Skills are required"),
    experience: z.array(entrySchema),
    education: z.array(entrySchema),
    projects: z.array(entrySchema),
})