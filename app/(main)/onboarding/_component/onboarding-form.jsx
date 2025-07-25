"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { industries } from '@/data/industries'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { Input, } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { onboardingSchema } from "@/app/lib/schema";
import { useFetch } from "@/hooks/use-fetch";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const OnboardingForm = ({ industries }) => {
  const [selectIndustry, setSelectIndustry] = useState(null);
  const router = useRouter();

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser)   //Api 

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (vals) => {
    try {
      const formattedIndustry = `${vals.industry}-${vals.subIndustry
        .toLowerCase()
        .replace(/ /g,"-")};`
                              // tech-developer 
        await updateUserFn({
          ...vals,
          industry: formattedIndustry,
        })

    } catch (error) {
      console.error("Onboarding error:" ,error)
       
      
    }
  }

  useEffect(() => {
      if(updateResult?.success && !updateLoading){
         toast.success("Profile completed Succesfully!")
        router.push("/dashboard")
        router.refresh()
      }
  },[updateResult,updateLoading])

  const watchIndustry = watch("industry")

  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          <CardTitle className="text-4xl gradient-title">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Select your industry to get personalized career insights and
            recommendations{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>


          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
              onValueChange = {(value) => {
                setValue("industry", value);
                setSelectIndustry(
                  industries.find((ind)=> ind.id === value)
                );
                setValue("subIndustry", "")
              }}
              >
                <SelectTrigger id="industry" className="w-[280px]">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem value={ind.id} key={ind.id}>
                      {ind.name}
                    </SelectItem> 
                  ))}
                </SelectContent>
              </Select>
                  {errors.industry && (
                    <p className="text-sm text-red-500">{errors.industry.message}</p>
                  )}
  
            </div>

            {watchIndustry && <div className="space-y-2">
              <Label htmlFor="subIndustry">Specialization</Label>
              <Select
              onValueChange = {(value) => 
                setValue("industry", value)
              
              }
              >
                <SelectTrigger id="subIndustry" className="w-[280px]">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  {selectIndustry?.subIndustries.map((ind) => (
                    <SelectItem value={ind} key={ind}>
                      {ind}
                    </SelectItem> 
                  ))}
                </SelectContent>
              </Select>
                  {errors.subIndustry && (
                    <p className="text-sm text-red-500">{errors.industry.message}</p>
                  )}
  
            </div>}


              <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input 
              id="experience"
              type='number'
              min='0'
              max='50'
              placeholder="Enter years of experience"
              {...register("experience")}
              />
                  {errors.experience && (
                    <p className="text-sm text-red-500">{errors.experience.message}</p>
                  )}
  
            </div>

              <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input 
              id="skills"
              placeholder="e.g. Python, JavaScript, Project Management"
              {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">Seprate multiple skills with commas</p>
                  {errors.skills && (
                    <p className="text-sm text-red-500">{errors.skills.message}</p>
                  )}
  
            </div>


              <div className="space-y-2">
              <Label htmlFor="skills">Professional Bio</Label>
              <Textarea 
              id="bio"
              placeholder="Tell us about your professional background"
              className="h-32"
              {...register("bio")}
              />
              <p className="text-sm text-muted-foreground">Seprate multiple skills with commas</p>
                  {errors.bio && (
                    <p className="text-sm text-red-500">{errors.bio.message}</p>
                  )}
            </div>
            <Button type="submit" className="w-full" disabled = {updateLoading}>
              {updateLoading? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ):(
                "Complete Profile"
              )}
              Complete Profile
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
