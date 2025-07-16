import { db } from "../prisma";
import { inngest } from "./client";

export const generateIndustryInsight = inngest.createFunction(
    {name : "Generate Industry Insights"},
    {cron : "0 0 * * 0"},
    async ({step}) => {
        const industries = await step.run("Fetch industries", async () => {
            return await db.industryInsight.findMany({
                select:{industry: true},
            })
        });

        
    }
)


