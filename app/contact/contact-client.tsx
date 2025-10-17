"use client";

import { useEffect, useState } from 'react';
// jsonLdBreadcrumb import removed due to "use client" directive
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Shield, 
  Users, 
  Send,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Globe,
  Heart,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import layout from "@/app/styles/common.module.css";
import './contact.light.module.css'
import './contact.dark.module.css'

export function ContactPageClient() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // JSON-LD script removed due to "use client" directive
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get in touch via email",
      value: "info@comsats.edu.pk",
      action: "mailto:info@comsats.edu.pk",
      color: "text-blue-500",
      bgColor: "from-blue-500/20 to-indigo-600/20",
      borderColor: "border-blue-200/30 dark:border-blue-700/30"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our team",
      value: "+92-51-9049-4949",
      action: "tel:+92519049494",
      color: "text-green-500",
      bgColor: "from-green-500/20 to-emerald-600/20",
      borderColor: "border-green-200/30 dark:border-green-700/30"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come to our campus",
      value: "Park Road, Chak Shahzad, Islamabad",
      action: "https://goo.gl/maps/comsats",
      color: "text-purple-500",
      bgColor: "from-purple-500/20 to-pink-600/20",
      borderColor: "border-purple-200/30 dark:border-purple-700/30"
    },
    {
      icon: Clock,
      title: "Office Hours",
      description: "When we're available",
      value: "Monday - Friday: 8:00 AM - 5:00 PM",
      action: "",
      color: "text-orange-500",
      bgColor: "from-orange-500/20 to-red-600/20",
      borderColor: "border-orange-200/30 dark:border-orange-700/30"
    }
  ];

  const features = [
    {
      icon: MessageCircle,
      title: "Quick Response",
      description: "We typically reply within 24 hours"
    },
    {
      icon: Shield,
      title: "Secure Communication",
      description: "Your information is safe with us"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Our team is here to help students succeed"
    },
    {
      icon: Heart,
      title: "Student-Focused",
      description: "Built by students, for students"
    }
  ];

  return (
    <div className="min-h-screen bg-mesh overflow-hidden relative">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-3xl animate-pulse float" style={{ animationDelay: '4s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-primary/30 rotate-45 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-500/30 rotate-45 animate-bounce" style={{ animationDelay: '5s' }} />
      </div>

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-blue-500/8" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />

      <div className={`${layout.section} relative z-10 py-24`}>
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Badge variant="soft" className="mb-8 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20 hover:from-primary/20 hover:to-blue-500/20 transition-all duration-300 hover-lift">
              <Sparkles className="h-3 w-3 mr-2 text-primary" />
              Get in Touch
            </Badge>
          </div>

          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-5xl lg:text-8xl font-bold leading-[0.9] text-balance mb-6">
              Contact{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Our Team
              </span>
            </h1>
          </div>

          <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-serif max-w-3xl mx-auto mb-4">
              Have questions, suggestions, or need support? We'd love to hear from you. 
              Our dedicated team is here to help you succeed.
            </p>
            <p className="text-lg text-muted-foreground/80 font-light max-w-xl mx-auto">
              Typically responding within 24 hours
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className={`transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Card className="card-modern border-0 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  Send us a Message
                </CardTitle>
                <p className="text-muted-foreground font-serif">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 rounded-xl h-12 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 rounded-xl h-12 font-medium"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-foreground">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="What's this about?"
                      required
                      className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 rounded-xl h-12 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us more about your inquiry..."
                      required
                      rows={6}
                      className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 rounded-xl font-medium resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full text-lg px-8 py-4 rounded-2xl button-modern bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className={`transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} space-y-6`}>
            <div className="grid gap-4">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <Card 
                    key={index} 
                    className={cn(
                      "card-modern border-0 backdrop-blur-sm hover-lift transition-all duration-300 group cursor-pointer",
                      method.borderColor
                    )}
                    onClick={() => method.action && window.open(method.action)}
                  >
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className={cn(
                        "p-4 rounded-2xl bg-gradient-to-br border group-hover:scale-110 transition-transform duration-300",
                        method.bgColor,
                        method.borderColor
                      )}>
                        <Icon className={cn("h-6 w-6", method.color)} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {method.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {method.description}
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {method.value}
                        </p>
                      </div>
                      {method.action && (
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={`transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card className="card-modern border-0 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl mb-2">
                Why <span className="text-primary">Contact Us?</span>
              </CardTitle>
              <p className="text-muted-foreground font-serif max-w-2xl mx-auto">
                We're committed to providing the best experience for COMSATS students.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="text-center group">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 backdrop-blur-sm border border-border/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-all duration-300 hover-glow">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-serif leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}