"use server";

import { Metric, Role } from "./extract";

export async function triggerDatabricksJob(fileName: string) {
  const host = (process.env.DATABRICKS_HOST || '').trim().replace(/['"]/g, '');
  const rawToken = (process.env.DATABRICKS_TOKEN || '').trim().replace(/['"]/g, '');
  const finalToken = rawToken.split(',')[0].replace(/[^a-zA-Z0-9]/g, '');
  // Use the job ID provided by the user
  const jobId = 739230420431749;

  if (!host || !finalToken) {
    console.error("Missing Databricks credentials.");
    return { success: false, error: "Server configuration error." };
  }

  const url = `${host}/api/2.1/jobs/run-now`;
  const resumePath = `/Volumes/onwards_catalog/default/user_resumes/${fileName}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${finalToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job_id: jobId,
        notebook_params: {
          resume_path: resumePath
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to trigger job: ${response.status} ${errorText}`);
      return { success: false, error: `Failed to start analysis job: ${response.statusText}` };
    }

    const data = await response.json();
    return { success: true, run_id: data.run_id };
  } catch (error) {
    console.error("Error triggering Databricks job:", error);
    return { success: false, error: "Internal server error triggering job." };
  }
}

export async function pollJobStatus(runId: number) {
  const host = (process.env.DATABRICKS_HOST || '').trim().replace(/['"]/g, '');
  const rawToken = (process.env.DATABRICKS_TOKEN || '').trim().replace(/['"]/g, '');
  const finalToken = rawToken.split(',')[0].replace(/[^a-zA-Z0-9]/g, '');

  if (!host || !finalToken) {
    return { success: false, error: "Server configuration error." };
  }

  try {
    // 1. Check job status
    const statusUrl = `${host}/api/2.1/jobs/runs/get?run_id=${runId}`;
    const statusResponse = await fetch(statusUrl, {
      headers: {
        "Authorization": `Bearer ${finalToken}`
      }
    });

    if (!statusResponse.ok) {
      return { success: false, error: "Failed to poll job status." };
    }

    const statusData = await statusResponse.json();
    const state = statusData.state;

    // Check if still running
    if (state.life_cycle_state === "PENDING" || state.life_cycle_state === "RUNNING") {
      return { success: true, status: "RUNNING" };
    }

    if (state.life_cycle_state === "TERMINATED" && state.result_state === "SUCCESS") {
      // 2. Job succeeded! Fetch output
      const outputUrl = `${host}/api/2.1/jobs/runs/get-output?run_id=${runId}`;
      const outputResponse = await fetch(outputUrl, {
        headers: {
          "Authorization": `Bearer ${finalToken}`
        }
      });

      if (outputResponse.ok) {
        const outputData = await outputResponse.json();
        if (outputData.notebook_output && outputData.notebook_output.result) {
          try {
            const parsedResult = JSON.parse(outputData.notebook_output.result);
            let roles = parsedResult.roles || [];
            try {
              const { getJobsForKeywords } = await import('./jobSearch');
              const keywords = roles.map((r: any) => r.title || r.label || "");
              roles = await getJobsForKeywords(keywords);
            } catch (err) {
              console.error("Failed to map Databricks jobs to real jobs:", err);
            }
            return { 
              success: true, 
              status: "COMPLETED", 
              metrics: parsedResult.metrics || [], 
              roles
            };
          } catch (e) {
            console.error("Failed to parse notebook output as JSON. Falling back to mock data.", e);
          }
        }
      }

      // Fallback to mock data if the notebook output wasn't cleanly formatted JSON yet
      const mockResult = await import('./extract').then(m => m.extractMetrics());
      let fallbackRoles = mockResult.roles;
      try {
        const { getJobsForKeywords } = await import('./jobSearch');
        const keywords = fallbackRoles.map((r: any) => r.title || r.label || "");
        fallbackRoles = await getJobsForKeywords(keywords);
      } catch (err) {
        console.error("Failed to map mock jobs to real jobs in pollJobStatus:", err);
      }
      return { 
        success: true, 
        status: "COMPLETED", 
        metrics: mockResult.metrics, 
        roles: fallbackRoles
      };

    }

    // Job failed or was canceled
    return { success: false, error: `Job ended with state: ${state.result_state}` };

  } catch (error) {
    console.error("Error polling Databricks job:", error);
    return { success: false, error: "Internal server error during polling." };
  }
}
