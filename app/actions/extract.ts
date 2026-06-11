"use server";

export interface Metric {
  value: string;
  label: string;
  description: string;
  iconType: "emerald" | "blue" | "purple";
}

export interface Role {
  id: number;
  title: string;
  company: string;
  matchScore: number;
  description: string;
}

export async function extractMetrics() {
  // Simulate Databricks API processing delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Placeholder mock data until the real Databricks API endpoint is hooked up
  const metrics: Metric[] = [
    {
      value: "600%",
      label: "Innovation Acceleration",
      description: "Driving rapid delivery and scale of advanced AI solutions.",
      iconType: "emerald"
    },
    {
      value: "$15M+",
      label: "OpEx Reduction",
      description: "Optimized operational efficiency and lean cost structuring.",
      iconType: "blue"
    },
    {
      value: "66%",
      label: "AI Vendor Footprint Reduction",
      description: "Streamlined vendor ecosystem for architectural simplicity.",
      iconType: "purple"
    }
  ];

  const roles: Role[] = [
    {
      id: 1,
      title: "VP of AI Integration",
      company: "OpenAI",
      matchScore: 98,
      description: "Lead the deployment of next-gen foundational models across enterprise partners, driving exponential ROI."
    },
    {
      id: 2,
      title: "Head of Enterprise AI Strategy",
      company: "Anthropic",
      matchScore: 95,
      description: "Define the constitutional AI roadmap for Fortune 500 integrations, focusing on safety and scale."
    },
    {
      id: 3,
      title: "Director of AI Architecture",
      company: "NVIDIA",
      matchScore: 92,
      description: "Architect comprehensive AI infrastructures to support trillion-parameter models in production environments."
    },
    {
      id: 4,
      title: "VP of Machine Learning Operations",
      company: "Google DeepMind",
      matchScore: 88,
      description: "Streamline ML pipelines and optimize AI vendor footprint to achieve massive OpEx reductions."
    },
  ];

  return { success: true, metrics, roles };
}
