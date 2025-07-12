import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";
import Cookies from "js-cookie";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Trash2,
  Save,
  Camera,
  Mail,
  Lock,
  Smartphone,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Profile, useAuthStore } from "@/store/authstore";
import API, { baseURL } from "@/components/axios";
import { toast } from "sonner";

export const Settings = () => {
  const { theme, setTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [profile, setProfile] = useState<Profile>({
    name: user ? user?.name : "",
    email: user ? user?.email : "",
    // bio: 'Experienced project manager with a passion for delivering high-quality software solutions.',
    access_role: user ? user?.access_role : "",
    role: user ? user?.user_roles?.name : "",
    profile_pic: user ? user?.profile_pic : "",
  });

  const [previewPic, setPreviewPic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewPic(url);

      // Optionally store the file itself if you want to upload later
      setProfile((prev) => ({ ...prev, profile_pic: file }));
    }
  };

  useEffect(() => {
    setProfile({
      name: user ? user?.name : "",
      email: user ? user?.email : "",
      // bio: 'Experienced project manager with a passion for delivering high-quality software solutions.',
      access_role: user ? user?.access_role : "",
      role: user ? user?.user_roles?.name : "",
      profile_pic: user ? user?.profile_pic : "",
    });
  }, [user]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskUpdates: true,
    projectUpdates: true,
    teamUpdates: false,
    weeklyReport: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "30",
    loginAlerts: true,
  });
  const [loading, setLoading] = useState(false);
  const handleProfileSave = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    if (typeof profile.role == "string") {
      formData.append("role", profile.role);
    }
    if (profile.profile_pic && profile.profile_pic instanceof File) {
      formData.append("profile_pic", profile.profile_pic, "[PROFILE_PIC]");
    }
    console.log("Saving profile:", formData);
    // Add save logic here
    try {
      if (!user) {
        toast.error("No user found here!");
        return;
      }
      console.log(user.id);
      const res = await fetch(`${baseURL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: formData,
      });
      if (res.ok) {
        const result = await res.json();
         setUser(result && result.user)
        console.log(result);
      }
      toast.success("Profile Updated Successfully!");
    } catch (err) {
      console.log(err);
      toast.success("Failed to update Profile");
    }
    setLoading(false);
  };

  const handleNotificationsSave = () => {
    console.log("Saving notifications:", notifications);
    // Add save logic here
  };

  const handleSecuritySave = () => {
    console.log("Saving security:", security);
    // Add save logic here
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  {previewPic || profile.profile_pic ? (
                    <img
                      src={
                        previewPic ||
                        (typeof profile.profile_pic === "string"
                          ? profile.profile_pic
                          : "")
                      }
                      alt={profile.name}
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={triggerFileSelect}
                  >
                    <Camera className="h-4 w-4" />
                    Change Photo
                  </Button>
                  <input
                    type="file"
                    title="upload image"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, GIF, PNG, WEBP, AVIF. Max size of 800KB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Profession</Label>
                  <Input
                    id="role"
                    value={profile && profile?.role}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, role: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Role</Label>
                  <Input
                    // id="department"
                    disabled={true}
                    value={profile && profile?.access_role}
                    // onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
              </div> */}

              <Button
                disabled={loading}
                onClick={handleProfileSave}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        emailNotifications: checked,
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        pushNotifications: checked,
                      }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Task Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when tasks are assigned or updated
                    </p>
                  </div>
                  <Switch
                    checked={notifications.taskUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        taskUpdates: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Project Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about project milestones and deadlines
                    </p>
                  </div>
                  <Switch
                    checked={notifications.projectUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        projectUpdates: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Team Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when team members join or leave
                    </p>
                  </div>
                  <Switch
                    checked={notifications.teamUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        teamUpdates: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Report</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a summary of your week every Monday
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        weeklyReport: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleNotificationsSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={security.twoFactor}
                    onCheckedChange={(checked) =>
                      setSecurity((prev) => ({ ...prev, twoFactor: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) =>
                      setSecurity((prev) => ({
                        ...prev,
                        sessionTimeout: e.target.value,
                      }))
                    }
                    className="w-32"
                  />
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after this period of inactivity
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) =>
                      setSecurity((prev) => ({ ...prev, loginAlerts: checked }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="gap-2 mr-2">
                  <Lock className="h-4 w-4" />
                  Change Password
                </Button>
                <Button onClick={handleSecuritySave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Delete Account</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose your preferred theme
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      onClick={() => setTheme("light")}
                      className="h-20 flex-col gap-2"
                    >
                      <Sun className="h-6 w-6" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      onClick={() => setTheme("dark")}
                      className="h-20 flex-col gap-2"
                    >
                      <Moon className="h-6 w-6" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      onClick={() => setTheme("system")}
                      className="h-20 flex-col gap-2"
                    >
                      <Monitor className="h-6 w-6" />
                      System
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base">Language</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose your preferred language
                  </p>
                  <Input defaultValue="English (US)" className="w-48" />
                </div>

                <Separator />

                <div>
                  <Label className="text-base">Time Zone</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set your local time zone
                  </p>
                  <Input
                    defaultValue="UTC-05:00 Eastern Time"
                    className="w-64"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
