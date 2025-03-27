"use client";

import type React from "react";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { cases, customers, locations } from "@/lib/data";
import { Calendar, Users, Briefcase, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Funktion zur Generierung von Fallaktivitätsdaten
function generateCaseActivityData(days: number) {
  const data = [];
  const today = new Date();

  // Start from the past and move toward today
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate some realistic data
    const newCases = Math.floor(Math.random() * 5) + 1;
    const resolvedCases = Math.floor(Math.random() * 4);

    data.push({
      date,
      newCases,
      resolvedCases,
    });
  }

  return data;
}

// Funktion zur Berechnung von Fallstatistiken
function calculateCaseStats() {
  const openCases = cases.filter((c) => c.status === "Offen").length;
  const inProgressCases = cases.filter(
    (c) => c.status === "In Bearbeitung"
  ).length;
  const closedCases = cases.filter((c) => c.status === "Abgeschlossen").length;
  const totalCases = cases.length;
  const avgResolutionDays = 3.2; // In einer echten App würde dies berechnet werden

  // Fälle nach Kunde berechnen
  const casesByCustomer = customers
    .map((customer) => {
      const customerCases = cases.filter((c) => c.customerId === customer.id);
      return {
        name: customer.name,
        count: customerCases.length,
      };
    })
    .sort((a, b) => b.count - a.count);

  // Fälle nach Standort berechnen
  const casesByLocation = locations
    .map((location) => {
      const locationCases = cases.filter((c) => c.locationId === location.id);
      return {
        name: location.name,
        count: locationCases.length,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 Standorte

  return {
    openCases,
    inProgressCases,
    closedCases,
    totalCases,
    avgResolutionDays,
    casesByCustomer,
    casesByLocation,
  };
}

// Dashboard-Widget-Typen
type WidgetType =
  | "caseActivity"
  | "caseStatus"
  | "casesByCustomer"
  | "casesByLocation"
  | "caseStats";

export default function Dashboard() {
  const { isLoading } = useAuth();
  const caseStats = useMemo(() => calculateCaseStats(), []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
      </div>

      {/* Fallstatistiken */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Gesamtfälle"
          value={caseStats.totalCases.toString()}
          icon={<Briefcase className="h-8 w-8 text-primary" />}
          bgColor="bg-primary/10"
        />
        <StatCard
          title="Offene Fälle"
          value={caseStats.openCases.toString()}
          icon={<Calendar className="h-8 w-8 text-primary" />}
          bgColor="bg-primary/10"
        />
        <StatCard
          title="Aktive Kunden"
          value={customers.length.toString()}
          icon={<Users className="h-8 w-8 text-accent" />}
          bgColor="bg-accent/10"
        />
        <StatCard
          title="Durchschn. Bearbeitungszeit"
          value={`${caseStats.avgResolutionDays} Tage`}
          icon={<Clock className="h-8 w-8 text-success" />}
          bgColor="bg-success/10"
        />
      </div>

      {/* Fälle nach Kunde */}
      <div className="bg-card p-6 rounded-custom shadow-md border border-border/50">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Fälle nach Kunde
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {caseStats.casesByCustomer.slice(0, 6).map((customer, index) => (
            <div
              key={index}
              className="bg-background p-4 rounded-custom border border-border/30 hover:border-primary/30 transition-colors"
            >
              <h3 className="font-medium text-foreground">{customer.name}</h3>
              <p className="text-2xl font-bold mt-2 text-primary">
                {customer.count}
              </p>
              <p className="text-xs text-muted-foreground">Fälle</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top-Standorte */}
      <div className="bg-card p-6 rounded-custom shadow-md border border-border/50">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Top 5 Standorte nach Fallvolumen
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {caseStats.casesByLocation.map((location, index) => (
            <div
              key={index}
              className="bg-background p-4 rounded-custom text-center border border-border/30 hover:border-secondary/30 transition-colors"
            >
              <h3 className="font-medium text-sm mb-2 text-foreground">
                {location.name}
              </h3>
              <p className="text-2xl font-bold text-secondary">
                {location.count}
              </p>
              <p className="text-xs text-muted-foreground">Fälle</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card p-6 rounded-custom shadow-md border border-border/50">
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          Neueste Aktivitäten
        </h2>
        <ActivityFeed />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  bgColor,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
}) {
  return (
    <div className="bg-card p-6 rounded-custom shadow-md border border-border/50 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
          <p className="text-3xl font-bold mt-2 text-foreground">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-custom`}>{icon}</div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const activities = [
    { id: 1, text: "Neuer Fall eröffnet für Acme GmbH", time: "vor 2 Stunden" },
    { id: 2, text: "Fall #1234 abgeschlossen", time: "vor 4 Stunden" },
    { id: 3, text: "Neuer Kunde: TechStart AG", time: "vor 1 Tag" },
    {
      id: 4,
      text: "Nachverfolgung geplant für Fall #5678",
      time: "vor 2 Tagen",
    },
  ];

  return (
    <ul className="space-y-4">
      {activities.map((activity) => (
        <li
          key={activity.id}
          className="flex justify-between items-center p-3 bg-background rounded-custom border border-border/30 hover:border-accent/30 transition-colors"
        >
          <span className="text-foreground">{activity.text}</span>
          <span className="text-sm text-muted-foreground">{activity.time}</span>
        </li>
      ))}
    </ul>
  );
}
