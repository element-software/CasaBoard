"use client";
import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import Icon from "@mdi/react";
import {
  mdiHomeAssistant,
  mdiGrid,
  mdiLightbulb,
  mdiCheckCircle,
  mdiArrowRight,
  mdiCog,
  mdiEye,
  mdiDrag,
  mdiShield,
  mdiCloud,
  mdiTablet,
  mdiPalette,
  mdiRocket,
} from "@mdi/js";
import { CasaBoardLogo } from "@repo/ui/components/Logo/index";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-background via-theme-surface to-theme-background">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
              <CasaBoardLogo size="large" variant="dark" iconOnly={true}     />
            </div>
          <h1 className="text-5xl md:text-6xl font-bold text-theme-text mb-6">
            CasaBoard
          </h1>
          <p className="text-xl md:text-2xl text-theme-text-secondary mb-8 max-w-3xl mx-auto">
            Cloud-Hosted Smart Home Dashboard
          </p>
          <p className="text-lg text-theme-text-secondary mb-12 max-w-4xl mx-auto">
            Create beautiful, customizable dashboards for your Home Assistant setup. 
            Drag, drop, and design your perfect smart home interface with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-theme-primary text-black font-semibold px-8 py-3"
              endContent={<Icon path={mdiArrowRight} className="w-5 h-5" />}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="bordered"
              className="border-theme-primary text-theme-primary font-semibold px-8 py-3"
              startContent={<Icon path={mdiEye} className="w-5 h-5" />}
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-theme-surface/50 backdrop-blur-sm">
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-theme-primary/20 rounded-lg flex items-center justify-center">
                  <Icon path={mdiDrag} className="w-6 h-6 text-theme-primary" />
                </div>
                <h3 className="text-xl font-semibold text-theme-text">Drag & Drop</h3>
              </div>
              <p className="text-theme-text-secondary">
                Build your dashboard with intuitive drag-and-drop components. No coding required.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-theme-surface/50 backdrop-blur-sm">
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-theme-primary/20 rounded-lg flex items-center justify-center">
                  <Icon path={mdiPalette} className="w-6 h-6 text-theme-primary" />
                </div>
                <h3 className="text-xl font-semibold text-theme-text">Customizable</h3>
              </div>
              <p className="text-theme-text-secondary">
                Choose from multiple themes and customize every aspect of your dashboard.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-theme-surface/50 backdrop-blur-sm">
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-theme-primary/20 rounded-lg flex items-center justify-center">
                  <Icon path={mdiCloud} className="w-6 h-6 text-theme-primary" />
                </div>
                <h3 className="text-xl font-semibold text-theme-text">Cloud Hosted</h3>
              </div>
              <p className="text-theme-text-secondary">
                Access your dashboard from anywhere with our secure cloud hosting.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-theme-surface/50 backdrop-blur-sm">
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-theme-primary/20 rounded-lg flex items-center justify-center">
                  <Icon path={mdiTablet} className="w-6 h-6 text-theme-primary" />
                </div>
                <h3 className="text-xl font-semibold text-theme-text">Mobile Ready</h3>
              </div>
              <p className="text-theme-text-secondary">
                Responsive design that works perfectly on all devices and screen sizes.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-theme-surface/50 backdrop-blur-sm">
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-theme-primary/20 rounded-lg flex items-center justify-center">
                  <Icon path={mdiShield} className="w-6 h-6 text-theme-primary" />
                </div>
                <h3 className="text-xl font-semibold text-theme-text">Secure</h3>
              </div>
              <p className="text-theme-text-secondary">
                Enterprise-grade security with encrypted connections and OAuth authentication.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-theme-surface/50 backdrop-blur-sm">
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-theme-primary/20 rounded-lg flex items-center justify-center">
                  <Icon path={mdiRocket} className="w-6 h-6 text-theme-primary" />
                </div>
                <h3 className="text-xl font-semibold text-theme-text">Fast Setup</h3>
              </div>
              <p className="text-theme-text-secondary">
                Get up and running in minutes with our streamlined setup process.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-16">
          <CardHeader className="text-center flex flex-col pb-4">
            <h2 className="text-3xl font-bold text-theme-text">How It Works</h2>
            <p className="text-theme-text-secondary text-lg">
              Get started with CasaBoard in just a few simple steps
            </p>
          </CardHeader>
          <CardBody>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-theme-text mb-2">Sign In</h3>
                <p className="text-theme-text-secondary text-sm">
                  Connect with your Google account for secure authentication
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-theme-text mb-2">Connect HA</h3>
                <p className="text-theme-text-secondary text-sm">
                  Link your Home Assistant instance with your dashboard
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-theme-text mb-2">Design</h3>
                <p className="text-theme-text-secondary text-sm">
                  Drag and drop components to build your perfect dashboard
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
                  4
                </div>
                <h3 className="text-lg font-semibold text-theme-text mb-2">Enjoy</h3>
                <p className="text-theme-text-secondary text-sm">
                  Access your beautiful dashboard from anywhere
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-theme-primary/10 to-theme-accent/10 border border-theme-primary/20">
            <CardBody className="p-12 flex flex-col items-center">
              <h2 className="text-3xl font-bold text-theme-text mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-center text-theme-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of smart home enthusiasts who have already transformed 
                their Home Assistant experience with CasaBoard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-theme-primary text-black font-semibold px-8 py-3"
                  endContent={<Icon path={mdiArrowRight} className="w-5 h-5" />}
                >
                  Start Building Now
                </Button>
                <Button
                  size="lg"
                  variant="bordered"
                  className="border-theme-primary text-theme-primary font-semibold px-8 py-3"
                  startContent={<Icon path={mdiCog} className="w-5 h-5" />}
                >
                  Learn More
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}