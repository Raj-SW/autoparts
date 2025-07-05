"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  Shield,
  Truck,
  MessageCircle,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  Award,
  FileText,
  LogIn,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Link from "next/link";

export default function PartnerPage() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    yearsOperation: "",
    location: "",
    address: "",
    contactName: "",
    position: "",
    phone: "",
    email: "",
    specialization: [] as string[],
    monthlyVolume: "",
    currentSuppliers: "",
    additionalInfo: "",
    termsAccepted: false,
    marketingConsent: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecializationChange = (vehicle: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      specialization: checked
        ? [...prev.specialization, vehicle]
        : prev.specialization.filter((v) => v !== vehicle),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please log in to submit a partnership application");
      return;
    }

    if (!formData.termsAccepted) {
      toast.error("Please accept the partnership terms and conditions");
      return;
    }

    if (formData.specialization.length === 0) {
      toast.error("Please select at least one vehicle type you service");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.createPartnerApplication(formData);

      if (response.application) {
        setFormSubmitted(true);
        toast.success("Partnership application submitted successfully!");
      }
    } catch (error: any) {
      console.error("Partnership application error:", error);

      if (error.status === 409) {
        toast.error(
          error.message || "You already have an active partnership application"
        );
      } else if (error.status === 400 && error.issues) {
        const firstError = error.issues[0];
        toast.error(firstError.message || "Please check your form data");
      } else {
        toast.error(
          "Failed to submit partnership application. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (formSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 font-montserrat">
                Partnership Application Submitted!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for your interest in becoming an A.M.O Distribution
                partner. We'll review your application and get back to you
                within 24 hours.
              </p>
              <div className="space-y-4">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() =>
                    window.open(
                      "https://wa.me/23057123456?text=Hi! I just submitted a partnership application. Can you help me with the next steps?",
                      "_blank"
                    )
                  }
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Follow up on WhatsApp
                </Button>
                <div className="text-sm text-gray-600">
                  <p>Questions? Call us: +230 5712-3456</p>
                  <p>Email: amodistribution.mu@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#D72638] to-[#B91C2C] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-montserrat">
              Become Our Partner
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Join Mauritius' leading spare parts distribution network and grow
              your business with exclusive benefits
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>50+ Active Partners</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>30% Average Savings</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Trusted Since 2010</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
              Partner Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Exclusive advantages designed to help your garage or workshop
              succeed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#D72638] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-[#D72638]" />
                </div>
                <CardTitle className="font-montserrat">
                  Wholesale Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Get up to 30% off retail prices on all genuine spare parts
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tiered pricing based on volume</li>
                  <li>• Special rates for bulk orders</li>
                  <li>• Monthly promotional discounts</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#D72638] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-[#D72638]" />
                </div>
                <CardTitle className="font-montserrat">
                  Priority Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Fast-track delivery service for urgent customer repairs
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Same-day delivery available</li>
                  <li>• Dedicated partner hotline</li>
                  <li>• Free delivery on orders over Rs 5,000</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#D72638] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#D72638]" />
                </div>
                <CardTitle className="font-montserrat">
                  Technical Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Expert advice and technical assistance when you need it
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Part identification help</li>
                  <li>• Installation guidance</li>
                  <li>• Warranty support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#D72638] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-[#D72638]" />
                </div>
                <CardTitle className="font-montserrat">
                  Exclusive Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  First access to new products and special inventory
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• New product previews</li>
                  <li>• Reserved stock allocation</li>
                  <li>• Special order capabilities</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#D72638] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-[#D72638]" />
                </div>
                <CardTitle className="font-montserrat">
                  Extended Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Flexible payment terms to help manage your cash flow
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 30-day payment terms</li>
                  <li>• Credit facility available</li>
                  <li>• Monthly statements</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#D72638] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-[#D72638]" />
                </div>
                <CardTitle className="font-montserrat">
                  Marketing Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Co-marketing opportunities and promotional materials
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Partner directory listing</li>
                  <li>• Marketing materials</li>
                  <li>• Joint promotional campaigns</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick WhatsApp Application */}
      <section className="py-8 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <MessageCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-800 font-montserrat">
                        Quick Partner Application
                      </h3>
                      <p className="text-green-700">
                        Apply via WhatsApp for faster processing!
                      </p>
                    </div>
                  </div>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() =>
                      window.open(
                        "https://wa.me/23057123456?text=Hi! I want to become a garage partner with A.M.O Distribution.%0A%0ABusiness Name: %0ALocation: %0AType of Business: %0AYears in Operation: %0AContact Person: ",
                        "_blank"
                      )
                    }
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Apply via WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnership Application Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">
                Partnership Application
              </h2>
              <p className="text-xl text-gray-600">
                Fill out the form below to start your partnership application
                process
              </p>
            </div>

            {/* Authentication Check */}
            {!isAuthenticated && (
              <Card className="mb-8 border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center space-x-4">
                    <LogIn className="w-8 h-8 text-orange-600" />
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-orange-800 mb-2">
                        Login Required
                      </h3>
                      <p className="text-orange-700 mb-4">
                        You need to be logged in to submit a partnership
                        application. This helps us manage your application and
                        provide updates.
                      </p>
                      <div className="flex justify-center space-x-4">
                        <Link href="/login">
                          <Button className="bg-orange-600 hover:bg-orange-700">
                            Login
                          </Button>
                        </Link>
                        <Link href="/register">
                          <Button
                            variant="outline"
                            className="border-orange-600 text-orange-600 hover:bg-orange-50"
                          >
                            Register
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card
              className={
                !isAuthenticated ? "opacity-50 pointer-events-none" : ""
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-montserrat">
                  <FileText className="w-6 h-6 text-[#D72638]" />
                  <span>Business Information</span>
                </CardTitle>
                <CardDescription>
                  Please provide details about your business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="Your garage/workshop name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select
                        required
                        value={formData.businessType}
                        onValueChange={(value) =>
                          handleSelectChange("businessType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="garage">Auto Garage</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="dealer">Car Dealer</SelectItem>
                          <SelectItem value="mechanic">
                            Independent Mechanic
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="yearsOperation">
                        Years in Operation *
                      </Label>
                      <Select
                        required
                        value={formData.yearsOperation}
                        onValueChange={(value) =>
                          handleSelectChange("yearsOperation", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select years" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">Less than 1 year</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Business Location *</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City/Town in Mauritius"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Full Business Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Complete business address"
                      required
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold font-montserrat">
                      Contact Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="contactName">Contact Person *</Label>
                        <Input
                          id="contactName"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleInputChange}
                          placeholder="Full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Position/Title *</Label>
                        <Input
                          id="position"
                          name="position"
                          value={formData.position}
                          onChange={handleInputChange}
                          placeholder="e.g., Owner, Manager"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+230 5xxx-xxxx"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="business@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold font-montserrat">
                      Business Details
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">
                        What types of vehicles do you service? *
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          "BMW",
                          "Mercedes",
                          "Audi",
                          "Toyota",
                          "Ford",
                          "Nissan",
                        ].map((vehicle) => (
                          <div
                            key={vehicle}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={vehicle.toLowerCase()}
                              checked={formData.specialization.includes(
                                vehicle
                              )}
                              onCheckedChange={(checked) =>
                                handleSpecializationChange(
                                  vehicle,
                                  checked as boolean
                                )
                              }
                            />
                            <Label htmlFor={vehicle.toLowerCase()}>
                              {vehicle}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyVolume">
                        Estimated Monthly Parts Purchase Volume
                      </Label>
                      <Select
                        value={formData.monthlyVolume}
                        onValueChange={(value) =>
                          handleSelectChange("monthlyVolume", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select volume range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-10k">
                            Under Rs 10,000
                          </SelectItem>
                          <SelectItem value="10k-25k">
                            Rs 10,000 - Rs 25,000
                          </SelectItem>
                          <SelectItem value="25k-50k">
                            Rs 25,000 - Rs 50,000
                          </SelectItem>
                          <SelectItem value="50k-100k">
                            Rs 50,000 - Rs 100,000
                          </SelectItem>
                          <SelectItem value="over-100k">
                            Over Rs 100,000
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentSuppliers">
                        Current Parts Suppliers
                      </Label>
                      <Textarea
                        id="currentSuppliers"
                        name="currentSuppliers"
                        value={formData.currentSuppliers}
                        onChange={handleInputChange}
                        placeholder="Who do you currently buy parts from?"
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">
                      Additional Information
                    </Label>
                    <Textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your business, special requirements, or questions..."
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Terms Agreement */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            termsAccepted: checked as boolean,
                          }))
                        }
                        required
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the partnership terms and conditions *
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="marketing"
                        name="marketingConsent"
                        checked={formData.marketingConsent}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            marketingConsent: checked as boolean,
                          }))
                        }
                      />
                      <Label htmlFor="marketing" className="text-sm">
                        I agree to receive marketing communications and updates
                      </Label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || !isAuthenticated}
                      className="w-full bg-[#D72638] hover:bg-[#B91C2C] text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      {isSubmitting
                        ? "Submitting..."
                        : "Submit Partnership Application"}
                    </Button>
                    <p className="text-sm text-gray-600 text-center mt-3">
                      We'll review your application and contact you within 24
                      hours
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
