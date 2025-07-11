
"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";


export async function updateUser(data) {
    const {userId} = await auth();
     console.log("User ID from Clerk:", userId)
    if(!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where:{
            clerkUserId : userId,
        },
    });

    if(!user) throw new Error("User Not Found")


try {
    const result = await db.$transaction(
        async(tx) => {
             // First check if industry exists

             let industryInsight = await tx.industryInsight.findUnique({
                where: {
                    industry: data.industry,
                }
             })

              // If industry doesn't exist, create it with default values

                if(!industryInsight){
                   

                        const insights = await generateAIInsights(data.industry);
                           if (!insights) {
  throw new Error("AI insight generation failed. Please try again after some time.");
}
                         industryInsight = await db.industryInsight.create({
                          data: {
                           industry : data.industry,
                           ...insights,
                           nextUpdate : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          }, 
                        });
                        return industryInsight
                  
                    
                }

               // Now update the user
               const updatedUser = await tx.user.update({
                where:{
                    id : user.id,
                },
                data:{
                    industry : data.industry,
                    bio : data.bio,
                    experience: data.experience,
                    skills: data.skills,
                }
               })
               return {updatedUser, industryInsight}
        },{
            timeout: 10000,
        })
            
               
    return {success: true , ...result}
} catch (error) {
        console.error("Error updating user and industry:", error);
       throw new Error("Failed to update profile: " + (error?.message || error.toString()));

}
}


export async function getUserOnboardingStatus(){
       const {userId} = await auth();
    if(!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where:{
            clerkUserId : userId,
        },
          select: {
      industry: true,
    },
    });

    if(!user) throw new Error("User Not Found")

//      try {
//   const user = await db.user.findUnique({
//     where: {
//       clerkUserId: userId,
//     },
  
//   });

  return {
    isOnboarded: !!user?.industry,
  };

        // } catch (error) {
        //     console.error("Error checking onboarding status:", error)
        //     throw new Error("Failed to check onboarding status")
        // }
}