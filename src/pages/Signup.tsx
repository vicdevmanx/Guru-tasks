import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Lock,
  User,
  Briefcase,
  Camera,
  Upload,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { baseURL } from "@/components/axios";
import { toast, Toaster } from "sonner";
import { useAuthStore } from "@/store/authstore";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Please select a role"),
  profilePicture: z.any().optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

const roles = [
  { value: "Frontend Developer", label: "Frontend Developer" },
  { value: "Backend Developer", label: "Backend Developer" },
  { value: "Fullstack Developer", label: "Fullstack Developer" },
  { value: "Mobile Developer", label: "Mobile Developer" },
  { value: "Web Developer", label: "Web Developer" },
  { value: "Game Developer", label: "Game Developer" },
  { value: "DevOps Engineer", label: "DevOps Engineer" },
  { value: "Embedded Systems Engineer", label: "Embedded Systems Engineer" },
  { value: "UI/UX Designer", label: "UI/UX Designer" },
  { value: "Product Designer", label: "Product Designer" },
  { value: "Graphic Designer", label: "Graphic Designer" },
  { value: "Motion Designer", label: "Motion Designer" },
  { value: "UX Researcher", label: "UX Researcher" },
  { value: "Brand Designer", label: "Brand Designer" },
  {
    value: "CEO(Chief Executive officer)",
    label: "CEO(Chief Executive officer)",
  },
  {
    value: "COO(Chief Operation officer)",
    label: "COO(Chief Operation officer)",
  },
  {
    value: "CTO(Chief Technical officer)",
    label: "CTO(Chief Technical officer)",
  },
  { value: "Data Analyst", label: "Data Analyst" },
  { value: "Data Engineer", label: "Data Engineer" },
  { value: "AI/ML Engineer", label: "AI/ML Engineer" },
  { value: "Cloud Engineer", label: "Cloud Engineer" },
  { value: "SRE", label: "SRE" },
  { value: "Cybersecurity Engineer", label: "Cybersecurity Engineer" },
  { value: "Product Manager", label: "Product Manager" },
  { value: "Technical Product Manager", label: "Technical Product Manager" },
  { value: "Project Manager", label: "Project Manager" },
  { value: "Scrum Master", label: "Scrum Master" },
  { value: "Solutions Architect", label: "Solutions Architect" },
  { value: "Software Architect", label: "Software Architect" },
  { value: "Web3 Developer", label: "Web3 Developer" },
  { value: "Smart Contract Developer", label: "Smart Contract Developer" },
  { value: "Solidity Engineer", label: "Solidity Engineer" },
  { value: "Blockchain Architect", label: "Blockchain Architect" },
  { value: "frontend_developer", label: "frontend_developer" },
  { value: "developer", label: "developer" },
  { value: "designer", label: "designer" },
  { value: "tester", label: "tester" },
  { value: "manager", label: "manager" },
  { value: "fullstack developer", label: "fullstack developer" },
];

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast("File too large", {
          description: "Please select an image smaller than 5MB",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast("Invalid file type", {
          description: "Please select an image file",
        });
        return;
      }

      form.setValue("profilePicture", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);

      // Create FormData for backend submission
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);

      if (data.profilePicture) {
        formData.append("profile_pic", data.profilePicture, "[PROFIlE_PIC]");
      }

      // TODO: Replace with actual backend URL
      const response = await fetch(`${baseURL}/api/auth/signup`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Welcome to Guru Tasks.`);
        console.log(result);
        console.log(result);
        setUser(result.user);
        setToken(result.token);
        navigate("/");
      } else {
        const error = await response.json();
        toast(error.message || "Failed to create account");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <Card className=" border-0 bg-card/50 pt-4 backdrop-blur-sm">
          {/* <CardHeader className="space-y-4 text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                <div className="relative p-4 rounded-full bg-gradient-to-br from-primary to-primary/80">
                  <UserPlus className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Create account
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Join us and start collaborating on amazing projects
            </CardDescription>
          </CardHeader> */}

          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-4 border-primary/20">
                      {profilePreview ? (
                        <AvatarImage
                          src={profilePreview}
                          alt="Profile preview"
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5">
                          <Camera className="h-8 w-8 text-muted-foreground" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <label htmlFor="profile-picture" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors duration-200 font-medium">
                      <Camera className="h-4 w-4" />
                      Upload profile picture
                    </div>
                    <Input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="Enter your full name"
                            className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Role
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                            <SelectTrigger className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200">
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="pl-10 pr-12 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                      Creating account...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center pt-4 border-t border-border/20">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
