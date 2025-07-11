import { z } from "zod";
// import * as z from "zod";
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