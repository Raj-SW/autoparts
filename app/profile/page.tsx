"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/ui/icons";
import { BreadcrumbWrapper } from "@/components/BreadcrumbWrapper";
import { Badge } from "@/components/ui/badge";

interface ProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "",
        },
      });
    }
  }, [user]);

  // Redirect if not logged in
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setProfileData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    if (!profileData.email.trim()) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdatingProfile(true);
      await updateProfile(profileData);
    } catch (error) {
      // Error is handled in the context
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      toast({
        title: "Error",
        description: "Current password is required",
        variant: "destructive",
      });
      return;
    }

    if (!passwordData.newPassword) {
      toast({
        title: "Error",
        description: "New password is required",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsChangingPassword(true);
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      // Password change will redirect to login
    } catch (error) {
      // Error is handled in the context
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <BreadcrumbWrapper />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid gap-6">
          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icons.user className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileInputChange}
                      placeholder="Enter your email address"
                      required
                    />
                    <div className="flex items-center mt-1">
                      {user.isEmailVerified ? (
                        <Badge variant="default" className="text-xs">
                          <Icons.check className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          Not Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={handleProfileInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <Separator />

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Address Information
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address.street">Street Address</Label>
                      <Input
                        id="address.street"
                        name="address.street"
                        value={profileData.address.street}
                        onChange={handleProfileInputChange}
                        placeholder="Enter your street address"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address.city">City</Label>
                        <Input
                          id="address.city"
                          name="address.city"
                          value={profileData.address.city}
                          onChange={handleProfileInputChange}
                          placeholder="Enter your city"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address.state">State/Province</Label>
                        <Input
                          id="address.state"
                          name="address.state"
                          value={profileData.address.state}
                          onChange={handleProfileInputChange}
                          placeholder="Enter your state or province"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address.zipCode">ZIP/Postal Code</Label>
                        <Input
                          id="address.zipCode"
                          name="address.zipCode"
                          value={profileData.address.zipCode}
                          onChange={handleProfileInputChange}
                          placeholder="Enter your ZIP or postal code"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address.country">Country</Label>
                        <Input
                          id="address.country"
                          name="address.country"
                          value={profileData.address.country}
                          onChange={handleProfileInputChange}
                          placeholder="Enter your country"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Icons.save className="mr-2 h-4 w-4" />
                        Update Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Change Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icons.lock className="h-5 w-5" />
                <span>Change Password</span>
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password *</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter your current password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password *</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Enter your new password"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Password must be at least 8 characters long
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm New Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Confirm your new password"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <Icons.lock className="mr-2 h-4 w-4" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Icons.info className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
              <CardDescription>
                View your account details and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Account Role
                  </Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        user.role === "admin" ? "destructive" : "default"
                      }
                    >
                      {user.role === "admin" ? "Administrator" : "Customer"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Email Status
                  </Label>
                  <div className="mt-1">
                    <Badge
                      variant={user.isEmailVerified ? "default" : "destructive"}
                    >
                      {user.isEmailVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
