"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Shield,
  MessageCircle,
  CheckCircle,
  Star,
  Award,
  Clock,
  MapPin,
  Target,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

const iconMap = {
  Users,
  Award,
  Shield,
  Clock,
};

const timeline = [
  {
    year: "2010",
    title: "A.M.O Distribution Founded",
    description:
      "Started as a small family business specializing in German car parts in Port Louis",
  },
  {
    year: "2015",
    title: "Expanded to 4x4 Parts",
    description:
      "Added Toyota Hilux, Ford Ranger, and Navara parts to meet growing demand",
  },
  {
    year: "2018",
    title: "Island-wide Delivery",
    description:
      "Launched same-day delivery service across all regions of Mauritius",
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description:
      "Introduced WhatsApp ordering and online catalog for better customer experience",
  },
  {
    year: "2022",
    title: "Partner Network Launch",
    description: "Created wholesale partner program for garages and workshops",
  },
  {
    year: "2024",
    title: "Market Leader",
    description:
      "Became Mauritius' most trusted spare parts distributor with 500+ satisfied customers",
  },
];

export default function AboutPage() {
  const [stats, setStats] = useState([
    { number: "500+", label: "Happy Customers", icon: "Users" },
    { number: "14", label: "Years in Business", icon: "Award" },
    { number: "5000+", label: "Parts in Stock", icon: "Shield" },
    { number: "24hr", label: "Average Response", icon: "Clock" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyStats = async () => {
      try {
        const data = await apiClient.getCompanyStats();
        setStats(data.stats);
      } catch (error) {
        console.error("Failed to fetch company stats:", error);
        // Keep default values if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyStats();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-[#D72638] text-white hover:bg-[#B91C2C]">
                🇲🇺 Proudly Mauritian Since 2010
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight font-montserrat">
                Your Trusted Partner for
                <span className="text-[#D72638]"> Quality Spare Parts</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                For over 14 years, A.M.O Distribution has been Mauritius' go-to
                source for genuine spare parts. We've built our reputation on
                speed, trust, and guaranteed fitment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#D72638] hover:bg-[#B91C2C] text-white"
                  onClick={() =>
                    window.open(
                      "https://wa.me/23057123456?text=Hi! I'd like to know more about A.M.O Distribution",
                      "_blank"
                    )
                  }
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat with Us
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#D72638] text-[#D72638]"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Visit Our Store
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="A.M.O Distribution team and facility"
                width={500}
                height={400}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-[#D72638] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="w-8 h-8 text-[#D72638]" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2 font-montserrat">
                          {stat.number}
                        </h3>
                        <p className="text-gray-600">{stat.label}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
                Our Story
              </h2>
              <p className="text-xl text-gray-600">
                From humble beginnings to Mauritius' most trusted spare parts
                distributor
              </p>
            </div>

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#D72638] rounded-full flex items-center justify-center text-white font-bold">
                      {item.year.slice(-2)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#D72638] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-[#D72638]" />
                </div>
                <CardTitle className="font-montserrat">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To provide Mauritians with genuine, high-quality spare parts
                  at competitive prices, backed by exceptional service and
                  expert knowledge.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#D72638] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-[#D72638]" />
                </div>
                <CardTitle className="font-montserrat">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To be the leading automotive parts distributor in the Indian
                  Ocean region, known for reliability, innovation, and customer
                  satisfaction.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-[#D72638] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-[#D72638]" />
                </div>
                <CardTitle className="font-montserrat">Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Quality first, customer-centric service, honest pricing, and
                  building lasting relationships with our community in
                  Mauritius.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
              Why Choose A.M.O Distribution?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Here's what makes us different from other spare parts suppliers in
              Mauritius
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#D72638] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-[#D72638]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                  Genuine Parts Only
                </h3>
                <p className="text-gray-600">
                  We source directly from authorized distributors to guarantee
                  authenticity
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#D72638] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-[#D72638]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                  Fast Response
                </h3>
                <p className="text-gray-600">
                  1-hour quote response and same-day delivery across Mauritius
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#D72638] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-[#D72638]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                  Guaranteed Fitment
                </h3>
                <p className="text-gray-600">
                  Wrong part? We'll exchange it free of charge, no questions
                  asked
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#D72638] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-[#D72638]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                  Expert Knowledge
                </h3>
                <p className="text-gray-600">
                  Our team knows German cars and 4x4s inside and out
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#D72638] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-[#D72638]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                  Competitive Pricing
                </h3>
                <p className="text-gray-600">
                  Best prices in Mauritius with transparent, no-hidden-fees
                  policy
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#D72638] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-[#D72638]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                  Local Support
                </h3>
                <p className="text-gray-600">
                  Mauritian-owned business supporting the local automotive
                  community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#D72638] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join 500+ satisfied customers who trust A.M.O Distribution for
              their spare parts needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#D72638] hover:bg-gray-100"
                onClick={() =>
                  window.open(
                    "https://wa.me/23057123456?text=Hi! I'd like to get a quote for spare parts",
                    "_blank"
                  )
                }
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Get Your Quote Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#D72638]"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Visit Our Store
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
